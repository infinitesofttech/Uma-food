from rest_framework_simplejwt.authentication import JWTAuthentication

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        token = request.COOKIES.get('access_token')
        print(token[:20] if token else None)

        if token is None:
            print("DEBUG: No access_token in cookies")
            return None

        try:
            validated_token = self.get_validated_token(token)
            user = self.get_user(validated_token)

            print(f"DEBUG: Auth success: {user.username}")
            return (user, validated_token)

        except Exception as e:
            print(f"DEBUG: Auth failed: {str(e)}")
            return None