from rest_framework import serializers
from .models import Project_model, Issue_model, Comment_model, Profile
from django.contrib.auth.models import User


# class UsernameSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['username']

class ProjectsSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')

    
    class Meta:
        model = Project_model
        fields = '__all__'

class IssuesSerializer(serializers.ModelSerializer):
    projectname = serializers.ReadOnlyField(source='issue_project.project_name')
    created_by = serializers.ReadOnlyField(source='created_by.username')
    currently_assigned_to = serializers.ReadOnlyField(source='assigned_to.username', default='No one')
    class Meta:
        model = Issue_model
        fields = '__all__'

class CommentsSerializer(serializers.ModelSerializer):
    commented_by = serializers.ReadOnlyField(source='commented_by.username')
    class Meta:
        model = Comment_model
        fields = '__all__'



class ProfilesSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = Profile
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'profile']
