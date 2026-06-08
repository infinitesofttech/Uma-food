from django.contrib import admin
from django.urls import path, include
from .views import *

urlpatterns = [
    path('categories/', CategoryView.as_view()),
    path('menu/', FoodView.as_view()),
    path('menu/<slug:slug>/', FoodDetailView.as_view()),
    path('orders/', OrderView.as_view()),
    path('contact/', ContactMessageView.as_view()),
    path('register/', RegisterAPI.as_view(), name='register'),
    path('request-register-otp/', RequestRegisterOTP.as_view(), name='request_otp'),
    path('verify-register-otp/', VerifyRegisterOTP.as_view(), name='verify_otp'),
    path('request-login-otp/', RequestLoginOTPAPI.as_view(), name='request_login_otp'),
    path('login/', LoginAPI.as_view(), name='login'),
    path('logout/', LogoutAPI.as_view(), name='logout'),
    path('user/', FetchUserAPI.as_view(), name='fetch_user'),
    # path('test-email/', test_email, name='test_email'),
    path('checkout/', CheckoutAPI.as_view(), name='checkout'),
    path('cart/', CartView.as_view()),
    path('cart/add/', AddToCartAPI.as_view()),
    path('cart/update/', UpdateCartAPI.as_view()),
    path('cart/remove/', RemoveCartItemAPI.as_view()),
    path('cart/clear/', ClearCartAPI.as_view()),
    path('verify-payment/', VerifyPaymentAPI.as_view(), name='verify_payment'),
    path('myorders/', UserOrdersAPI.as_view(), name='user_orders'),
    path("myorders/<int:id>/", OrderDetailView.as_view()),
    path("wishlist/", WishlistView.as_view()),
    path("add-wishlist/", AddToWishlistAPI.as_view()),
    path("remove-wishlist/<int:id>/", RemoveWishlistAPI.as_view()),
    path("clear-wishlist/", ClearWishlistAPI.as_view()),
    
    # Admin URLs
    
    path("admin/login/", AdminLoginAPI.as_view()),
    path("admin/check-admin/", CheckAdminAPI.as_view()),
    
    path("admin/dashboard/", AdminDashboardAPI.as_view()),

    path("admin/products/", AdminProductAPI.as_view()),
    path("admin/products/<int:id>/", AdminProductDetailAPI.as_view()),

    path("admin/orders/", AdminOrdersAPI.as_view()),
    path("admin/orders/<int:id>/", AdminOrderDetailView.as_view()),
    path("admin/orders/<int:id>/status/", AdminUpdateOrderStatus.as_view()),

    path("admin/users/", AdminUsersAPI.as_view()),
    
    path("admin/categories/", AdminCategoryAPI.as_view()),
    path("admin/categories/<int:id>/", AdminCategoryDetailAPI.as_view()),
    
    path("admin/messages/", AdminMessagesView.as_view()),
    path("admin/messages/<int:pk>/read/", MarkMessageReadView.as_view()),
    path("admin/contact-subjects/", ContactSubjectView.as_view()),
    path("admin/contact-subjects/<int:pk>/", ContactSubjectDeleteView.as_view()),
    
]
