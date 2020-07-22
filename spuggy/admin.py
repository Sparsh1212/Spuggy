from django.contrib import admin
from .models import Project_model, Issue_model, Comment_model, Profile

admin.site.register(Project_model)
admin.site.register(Issue_model)
admin.site.register(Comment_model)

admin.site.register(Profile)



# Register your models here.
