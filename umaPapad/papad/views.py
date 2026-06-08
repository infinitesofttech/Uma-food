from django.shortcuts import render

from .authentication import CookieJWTAuthentication
from .models import *
from .serializers import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import generics, permissions
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from django.core.mail import send_mail
from django.http import JsonResponse
import threading
import random
from datetime import timedelta
from django.utils import timezone
import razorpay
import hmac
import hashlib
from .permissions import IsAdminUserCustom
from rest_framework.parsers import MultiPartParser, FormParser 
from rest_framework.generics import ListCreateAPIView, DestroyAPIView


client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

# helper function to send email asynchronously
def send_email_async(subject, message, recipient):
    def send():
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [recipient],
                fail_silently=True,
            )
        except Exception:
            pass

    threading.Thread(target=send, daemon=True).start()


OTP_EXPIRY_MINUTES = 10


def generate_otp():
    return f"{random.randint(100000, 999999)}"


def build_login_response(user):
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)

    response = Response(
        {"message": "Login successful", "username": user.username},
        status=status.HTTP_200_OK
    )

    # ✅ ACCESS TOKEN COOKIE
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,     # localhost only
        samesite="Lax",   # 🔥 IMPORTANT FIX
        path="/",
        max_age=60 * 60,
    )

    # ✅ REFRESH TOKEN COOKIE
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="Lax",
        path="/",
        max_age=30 * 24 * 60 * 60,
    )

    return response

def build_logout_response():
    response = Response(
        {"message": "Logged out successfully"},
        status=status.HTTP_200_OK
    )

    response.delete_cookie(
        key="access_token",
        path="/",
        samesite="Lax",
    )

    response.delete_cookie(
        key="refresh_token",
        path="/",
        samesite="Lax",
    )

    return response


def get_user_from_identifier(identifier):
    user = User.objects.filter(email__iexact=identifier).first()
    if user is None:
        user = User.objects.filter(username__iexact=identifier).first()
    return user

# def test_email(request):
#     send_mail(
#         'Test Email',
#         'This email was sent from Django.',
#         settings.DEFAULT_FROM_EMAIL,
#         ['2302030400016@silveroakuni.ac.in'],
#         fail_silently=False,
#     )
#     return JsonResponse({'message': 'Email sent successfully'})


class CategoryView(APIView):
    def get(self, request):
        data = Category.objects.all()
        serializer = CategorySerializer(data, many=True)
        return Response(serializer.data)
    
class FoodView(APIView):
    def get(self, request):
        data = FoodItems.objects.all()
        serializer = FoodItemSerializer(data, many=True)
        return Response(serializer.data)
    
class FoodDetailView(APIView):
    def get(self, request, slug):
        try:
            product = FoodItems.objects.get(slug=slug)
            serializer = FoodItemSerializer(product)
            return Response(serializer.data)
        except FoodItems.DoesNotExist:
            return Response(
                {"error": "Product not found"},
                status=status.HTTP_404_NOT_FOUND
            )
    
class OrderView(APIView):
    def post(self, request):
        serializer = OrderSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response( {"message": "Order placed"}, 
                status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    
    
class ContactMessageView(APIView):
    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Contact message received"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
    
class RegisterAPI(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            send_email_async(
                'Welcome to Uma Papad',
                f'Hello {user.username}, your account has been created successfully.',
                user.email,
            )
            response = build_login_response(user)
            response.data = {
                "message": "User created successfully",
                "username": user.username,
            }
            response.status_code = status.HTTP_201_CREATED
            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RequestRegisterOTP(APIView):
    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        if not username or not email or not password:
            return Response({"error": "All fields required"}, status=400)

        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists"}, status=400)

        otp = generate_otp()

        RegisterOTP.objects.create(
            username=username,
            email=email,
            password=password,
            otp=otp,
            expires_at=timezone.now() + timedelta(minutes=OTP_EXPIRY_MINUTES)
        )

        send_email_async(
            "Your Register OTP",
            f"Your OTP is {otp}",
            email
        )

        return Response({"message": "OTP sent to email"}, status=200)

class VerifyRegisterOTP(APIView):
    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")

        record = RegisterOTP.objects.filter(
            email=email,
            otp=otp,
            is_used=False
        ).order_by("-created_at").first()

        if not record:
            return Response({"error": "Invalid OTP"}, status=400)

        if record.is_expired():
            return Response({"error": "OTP expired"}, status=400)

        # create user
        user = User.objects.create_user(
            username=record.username,
            email=record.email,
            password=record.password
        )

        record.is_used = True
        record.save()

        return build_login_response(user)

class RequestLoginOTPAPI(APIView):
    def post(self, request):
        serializer = RequestLoginOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        identifier = serializer.validated_data['username']
        password = serializer.validated_data['password']
        user = get_user_from_identifier(identifier)
        if user is None:
            return Response({
                "error": "User not found"
            }, status=status.HTTP_404_NOT_FOUND)

        authenticated_user = authenticate(username=user.username, password=password)
        if authenticated_user is None:
            return Response({
                "error": "Invalid username/email or password"
            }, status=status.HTTP_401_UNAUTHORIZED)

        LoginOTP.objects.filter(user=authenticated_user, is_used=False).update(is_used=True)
        otp = generate_otp()
        LoginOTP.objects.create(
            user=authenticated_user,
            otp=otp,
            expires_at=timezone.now() + timedelta(minutes=OTP_EXPIRY_MINUTES),
        )
        send_email_async(
            'Your Uma Papad login OTP',
            (
                f'Hello {authenticated_user.username},\n\n'
                f'Your login OTP is {otp}. It is valid for {OTP_EXPIRY_MINUTES} minutes.\n\n'
                'If you did not request this, please ignore this email.'
            ),
            authenticated_user.email,
        )
        return Response({
            "message": "OTP sent to your email.",
            "email": authenticated_user.email,
        }, status=status.HTTP_200_OK)


class LoginAPI(APIView):
    def post(self, request):
        serializer = VerifyLoginOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        identifier = serializer.validated_data['username']
        otp = serializer.validated_data['otp']
        user = get_user_from_identifier(identifier)
        if user is None:
            return Response({
                "error": "User not found"
            }, status=status.HTTP_404_NOT_FOUND)

        login_otp = LoginOTP.objects.filter(
            user=user,
            otp=otp,
            is_used=False,
        ).order_by('-created_at').first()

        if login_otp is None:
            return Response({
                "error": "Invalid OTP"
            }, status=status.HTTP_401_UNAUTHORIZED)

        if login_otp.is_expired():
            return Response({
                "error": "OTP expired. Please request a new one."
            }, status=status.HTTP_401_UNAUTHORIZED)

        login_otp.is_used = True
        login_otp.save()

        send_email_async(
            'Login Alert',
            f'Hello {user.username}, your account was just logged in.',
            user.email,
        )

        return build_login_response(user)


class LogoutAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print(f"DEBUG: LogoutAPI called")
        print(f"DEBUG: Cookies before delete: access_token={request.COOKIES.get('access_token', 'None')[:20] if request.COOKIES.get('access_token') else 'None'}")
        
        refresh_token = request.COOKIES.get("refresh_token")

        if refresh_token:
            try:
                RefreshToken(refresh_token).blacklist()
                print(f"DEBUG: Token blacklisted successfully")
            except Exception as e:
                print(f"DEBUG: Token blacklist error: {e}")
                pass

        return build_logout_response()

        
class FetchUserAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.is_authenticated:
            response = Response({
                "username": request.user.username,
                "email": request.user.email,
                "is_admin": request.user.is_staff
            }, status=status.HTTP_200_OK)
            # Add cache-control headers to prevent caching
            response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
            response['Pragma'] = 'no-cache'
            response['Expires'] = '0'
            return response
        error_data = {
            "error": "Not authenticated",
        }

        if settings.DEBUG:
            error_data["debug"] = {
                "has_access_cookie": "access_token" in request.COOKIES,
                "has_refresh_cookie": "refresh_token" in request.COOKIES,
                "cookie_keys": list(request.COOKIES.keys()),
                "auth_header_present": bool(request.headers.get("Authorization")),
                "user_repr": str(request.user),
                "is_authenticated": bool(getattr(request.user, "is_authenticated", False)),
            }

        return Response(error_data, status=status.HTTP_401_UNAUTHORIZED)
    
    
class CheckoutAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data

        name = data.get("name")
        phone = data.get("phone")
        address = data.get("address")
        cart = data.get("cart", [])

        # VALIDATION
        if not name or not phone or not address:
            return Response({"error": "All fields required"}, status=400)

        if not cart:
            return Response({"error": "Cart is empty"}, status=400)
        
        for item in cart:
            product = FoodItems.objects.get(id=item['id'])

            if product.stock < item['quantity']:
                return Response({"error": f"{product.name} is out of stock"}, status=400)

        # for item in order.items.all():
        #     product = item.food_item
        #     product.stock -= item.quantity
        #     product.save()
        
        # CREATE ORDER (your DB order = PENDING)
        order = Order.objects.create(
            user=request.user,
            name=name,
            phone=phone,
            address=address,
            status="PENDING"   
        )

        total_amount = 0

        for item in cart:
            try:
                product = FoodItems.objects.get(id=item["id"])
                quantity = item["quantity"]

                # ✅ DOUBLE CHECK STOCK (safe)
                if product.stock < quantity:
                    return Response({
                        "error": f"{product.name} is out of stock"
                    }, status=400)

                # ✅ CREATE ORDER ITEM
                OrderItems.objects.create(
                    order=order,
                    food_item=product,
                    quantity=quantity
                )

                # ✅ REDUCE STOCK 🔥
                product.stock -= quantity
                product.save()

                total_amount += product.price * quantity

            except FoodItems.DoesNotExist:
                return Response({"error": "Invalid product"}, status=400)

        # STEP 1: convert to paise
        amount_in_paise = int(total_amount * 100)

        # STEP 2: create razorpay order
        razorpay_order = client.order.create({
            "amount": amount_in_paise,
            "currency": "INR",
            "payment_capture": 1
        })

        # STEP 3: save razorpay order id in DB
        order.razorpay_order_id = razorpay_order["id"]
        order.total_amount = total_amount
        order.save()

        # STEP 4: send response to frontend
        return Response({
            "message": "Order created",
            "order_id": order.id, 
            "total_amount": order.total_amount,# your DB order
            "razorpay_order": razorpay_order,     # razorpay order
            "key": settings.RAZORPAY_KEY_ID       # frontend needs this
        }, status=200)  
        
class VerifyPaymentAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data

        razorpay_order_id = data.get("razorpay_order_id")
        razorpay_payment_id = data.get("razorpay_payment_id")
        razorpay_signature = data.get("razorpay_signature")

        try:
            order = Order.objects.get(razorpay_order_id=razorpay_order_id)

            # verify signature
            generated_signature = hmac.new(
                settings.RAZORPAY_KEY_SECRET.encode(),
                f"{razorpay_order_id}|{razorpay_payment_id}".encode(),
                hashlib.sha256
            ).hexdigest()

            if generated_signature == razorpay_signature:
                order.status = "CONFIRMED"
                order.razorpay_payment_id = razorpay_payment_id
                order.razorpay_signature = razorpay_signature
                order.save()

                return Response({"message": "Payment successful"}, status=200)
            print("ORDER:", razorpay_order_id)
            print("PAYMENT:", razorpay_payment_id)
            print("SIGN:", razorpay_signature)
            print("GEN SIGN:", generated_signature)
            
            return Response({"error": "Invalid signature"}, status=400)

        except Exception as e:
            print(e)
            return Response({"error": "Verification failed"}, status=500)
        
class CartView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    
class AddToCartAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get("product_id")
        quantity = request.data.get("quantity", 1)

        try:
            product = FoodItems.objects.get(id=product_id)
        except FoodItems.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)

        cart, _ = Cart.objects.get_or_create(user=request.user)

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            food_item=product
        )

        if not created:
            cart_item.quantity += int(quantity)
        else:
            cart_item.quantity = quantity

        cart_item.save()

        return Response({"message": "Item added to cart"})
    
class UpdateCartAPI(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        item_id = request.data.get("item_id")
        quantity = request.data.get("quantity")

        try:
            item = CartItem.objects.get(id=item_id, cart__user=request.user)
            item.quantity = quantity
            item.save()
            return Response({"message": "Updated"})
        except CartItem.DoesNotExist:
            return Response({"error": "Item not found"}, status=404)


class RemoveCartItemAPI(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        item_id = request.data.get("item_id")

        try:
            item = CartItem.objects.get(id=item_id, cart__user=request.user)
            item.delete()
            return Response({"message": "Removed"})
        except CartItem.DoesNotExist:
            return Response({"error": "Item not found"}, status=404)
        
class ClearCartAPI(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart.items.all().delete()
        return Response({"message": "Cart cleared"})
    
    
class UserOrdersAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).order_by("-created_at")
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    
class OrderDetailView(APIView):
    def get(self, request, id):
        try:
            order = Order.objects.get(id=id, user=request.user)
            serializer = OrderSerializer(order)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found"},
                status=status.HTTP_404_NOT_FOUND
            )
            
class WishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        serializer = WishlistSerializer(wishlist)
        return Response(serializer.data)
    
class AddToWishlistAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get("product_id")

        product = FoodItems.objects.get(id=product_id)
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)

        item, created = WishlistItem.objects.get_or_create(
            wishlist=wishlist,
            food_item=product
        )

        return Response({"message": "Added to wishlist"})
    
class RemoveWishlistAPI(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        WishlistItem.objects.filter(
            id=id,
            wishlist__user=request.user
        ).delete()

        return Response({"message": "Removed"})
    
class ClearWishlistAPI(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        Wishlist.objects.filter(user=request.user).delete()
        return Response({"message": "Wishlist cleared"})
    
    
######################################### Admin Views #########################################################3

# Admin Login API

class AdminLoginAPI(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user is None:
            return Response({"error": "Invalid credentials"}, status=401)

        if not user.is_staff:
            return Response({"error": "Not an admin"}, status=403)

        return build_login_response(user)
    
#  Dashboard 

class AdminDashboardAPI(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserCustom]

    def get(self, request):
        total_orders = Order.objects.count()
        total_revenue = sum(o.total_amount or 0 for o in Order.objects.all())
        total_users = User.objects.count()
        total_messages = ContactMessage.objects.count()

        return Response({
            "orders": total_orders,
            "revenue": total_revenue,
            "users": total_users,
            "messages": total_messages,
        })
     

# Admin Product CRUD

class AdminProductAPI(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserCustom]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        products = FoodItems.objects.all()
        serializer = FoodItemSerializer(products, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = FoodItemSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        print("ERROR:", serializer.errors)   # 👈 ADD THIS
        return Response(serializer.errors, status=400)
    
class CheckAdminAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "is_admin": request.user.is_staff
        })
    
    
# Update & Delete Product

class AdminProductDetailAPI(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserCustom]

    def put(self, request, id):
        try:
            product = FoodItems.objects.get(id=id)
            serializer = FoodItemSerializer(product, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors)
        except FoodItems.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

    def delete(self, request, id):
        FoodItems.objects.filter(id=id).delete()
        return Response({"message": "Deleted"})
    
# 2. Admin Orders (View all users' orders)

class AdminOrdersAPI(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserCustom]

    def get(self, request):
        orders = Order.objects.all().order_by("-created_at")
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    
# Update Order Status

class AdminUpdateOrderStatus(APIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    permission_classes = [permissions.IsAdminUser]

    def put(self, request, id):   # ✅ ADD THIS
        return self.update_status(request, id)

    def patch(self, request, id):
        return self.update_status(request, id)

    def update_status(self, request, id):
        try:
            order = Order.objects.get(pk=id)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=404)

        status_value = request.data.get("status")

        valid_statuses = [choice[0] for choice in Order.STATUS_CHOICES]

        if status_value not in valid_statuses:
            return Response({"error": "Invalid status"}, status=400)

        order.status = status_value
        order.save()

        return Response({"message": "Status updated successfully"})
        
# 3. Admin Users List

class AdminUsersAPI(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserCustom]

    def get(self, request):
        users = User.objects.all().values("id", "username", "email", "is_staff")
        return Response(users)
    
class AdminCategoryAPI(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserCustom]

    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)
    
class AdminCategoryDetailAPI(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserCustom]

    def put(self, request, id):
        try:
            category = Category.objects.get(id=id)
        except Category.DoesNotExist:
            return Response({"error": "Category not found"}, status=404)

        serializer = CategorySerializer(category, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    def delete(self, request, id):
        try:
            category = Category.objects.get(id=id)
            category.delete()
            return Response({"message": "Deleted successfully"})
        except Category.DoesNotExist:
            return Response({"error": "Category not found"}, status=404)
        
#  Manage Orders from Admin




# GET SINGLE ORDER
class AdminOrderDetailView(generics.RetrieveAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]


class AdminMessagesView(APIView):
    queryset = ContactMessage.objects.all().order_by('-received_at')
    serializer_class = ContactMessageSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            return Response({"error": "Unauthorized"}, status=403)

        messages = ContactMessage.objects.all().order_by('-received_at')
        serializer = ContactMessageSerializer(messages, many=True)
        return Response(serializer.data)
    
class MarkMessageReadView(APIView):
    def patch(self, request, pk):
        try:
            msg = ContactMessage.objects.get(id=pk)
            msg.is_read = True
            msg.save()
            return Response({"message": "Marked as read"})
        except ContactMessage.DoesNotExist:
            return Response({"error": "Not found"}, status=404)
        
        
class ContactSubjectView(ListCreateAPIView):
    queryset = ContactSubject.objects.all()
    serializer_class = ContactSubjectSerializer
    
class ContactSubjectDeleteView(DestroyAPIView):
    queryset = ContactSubject.objects.all()
    serializer_class = ContactSubjectSerializer