from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(Category)
admin.site.register(FoodItems)
admin.site.register(ContactSubject)
admin.site.register(ContactMessage)
admin.site.register(Order)
admin.site.register(OrderItems)
# admin.site.register(LoginOTP)
admin.site.register(Cart)
admin.site.register(CartItem)

