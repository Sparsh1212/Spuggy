from rest_framework.viewsets import ModelViewSet
from .serializers import ProjectsSerializer, IssuesSerializer, CommentsSerializer,  ProfilesSerializer, UserSerializer
from .models import Project_model
from .models import Issue_model
from .models import Comment_model
from .models import Profile
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from .permissions import IsCreatorOrReadOnlyProject, IsCreatorOrReadOnlyIssue, OnlyAdminAccess
from django.core.mail import send_mail
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.http import HttpResponse
import requests
import json
from rest_framework.authtoken.models import Token
from django.shortcuts import redirect
from decouple import config
import threading


class ProjectViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, IsCreatorOrReadOnlyProject]
    serializer_class = ProjectsSerializer
    queryset = Project_model.objects.all()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class IssueViewSet(ModelViewSet):

    permission_classes = [IsAuthenticated, IsCreatorOrReadOnlyIssue]
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    serializer_class = IssuesSerializer
    queryset = Issue_model.objects.all()

    def perform_update(self, serializer):
        instance = serializer.save()

        def send_email(instance):
            email_subject = 'Issue Status Changed'
            email_body = '<b>Issue:</b> '+instance.issue_title+' <b>Updated Status: </b>' + \
                instance.issue_status+' <b>Project:</b> '+instance.issue_project.project_name
            email_sender = config('EMAIL_HOST_USER')
            recipents = []
            recipents.append(instance.created_by.profile.email)
            recipents.append(instance.issue_project.created_by.profile.email)
            for team_member in instance.issue_project.team_members.all():
                recipents.append(team_member.profile.email)
            send_mail(email_subject, email_body, email_sender,
                      recipents, fail_silently=True)
        email_thread = threading.Thread(target=send_email, args=(instance,))
        email_thread.start()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
        instance = serializer.save()

        def send_email(instance):
            email_subject = 'New Issue Reported'
            email_body = '<b>Issue:</b> '+instance.issue_title + \
                ' <b>Project:</b> '+instance.issue_project.project_name
            email_sender = config('EMAIL_HOST_USER')
            recipents = []
            recipents.append(instance.issue_project.created_by.profile.email)
            for team_member in instance.issue_project.team_members.all():
                recipents.append(team_member.profile.email)
            send_mail(email_subject, email_body, email_sender,
                      recipents, fail_silently=True)
        email_thread = threading.Thread(target=send_email, args=(instance,))
        email_thread.start()


class CommentViewSet(ModelViewSet):
    serializer_class = CommentsSerializer
    queryset = Comment_model.objects.all()

    def perform_create(self, serializer):
        serializer.save(commented_by=self.request.user)
        instance = serializer.save()

        def send_email(instance):
            email_subject = 'New Comment Added'
            email_body = '<b>Comment:</b> '+instance.comment_text+' <b>Issue:</b> ' + \
                instance.comment_issue.issue_title+' <b>Project:</b> ' + \
                instance.comment_project.project_name
            email_sender = config('EMAIL_HOST_USER')
            team_members_recipents = []
            team_members_recipents.append(
                instance.comment_issue.created_by.profile.email)
            for team_member in instance.comment_project.team_members.all():
                team_members_recipents.append(team_member.profile.email)
            send_mail(email_subject, email_body, email_sender,
                      team_members_recipents, fail_silently=True)
        email_thread = threading.Thread(target=send_email, args=(instance,))
        email_thread.start()


class ProfileViewSet(ModelViewSet):

    permission_classes = [IsAuthenticated, OnlyAdminAccess]

    serializer_class = ProfilesSerializer
    queryset = Profile.objects.all()


class UserProfileViewSet(ModelViewSet):
    serializer_class = ProfilesSerializer

    def get_queryset(self):
        user = self.request.user
        return Profile.objects.filter(user=user)


class MyCreatedIssuesViewSet(ModelViewSet):
    serializer_class = IssuesSerializer

    def get_queryset(self):
        user = self.request.user
        return Issue_model.objects.filter(created_by=user)


class UsersViewSet(ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()


class MyAssignedIssuesViewSet(ModelViewSet):
    serializer_class = IssuesSerializer

    def get_queryset(self):
        user = self.request.user
        return Issue_model.objects.filter(assigned_to=user)


def oauth_handler(request):
    code = request.GET.get('code')
    print('Authentication_Code: '+code)
    data_for_post_request1 = {
        'client_id': 'FpManHnDgfhdL2CxZseuB82cDBzsj9VY14QKILhn',
        'client_secret': '49nUOKHKF7TAGq1bRHqESk0Ku1F6GKdYDPJ3jhBZ7kcffr8Y4BxJkKIM9VMtVYmn3G4Ausc66ZsG3AvISbXpBgN0d1z6msftn2v1ZAEgJ0pS73H9JfEMtzlhnYIGQnWO',
        'grant_type': 'authorization_code',
        'redirect_url': 'http://127.0.0.1:8000/spuggy/oauth/',
        'code': code

    }
    resp = requests.post(
        'https://internet.channeli.in/open_auth/token/', data=data_for_post_request1)
    dictionary_obj = resp.json()
    access_token = dictionary_obj['access_token']
    print('Access_Token: '+access_token)
    header = {
        'Authorization': 'Bearer ' + access_token
    }
    user_data = requests.get(
        'https://internet.channeli.in/open_auth/get_user_data/', headers=header)
    user_data_dict = user_data.json()
    name = user_data_dict['person']['fullName'].split()
    last_char_enrollment_number = user_data_dict['student']['enrolmentNumber']
    current_year = user_data_dict['student']['currentYear']
    custom_username = str(current_year)+'_'+name[0]+last_char_enrollment_number[4] + \
        last_char_enrollment_number[5] + \
        last_char_enrollment_number[6]+last_char_enrollment_number[7]
    print(custom_username)
    try:
        obj = User.objects.get(username=custom_username)
    except User.DoesNotExist:
        name = user_data_dict['person']['fullName']
        branch = user_data_dict['student']['branch name']
        email = user_data_dict['contactInformation']['emailAddress']
        obj = User(username=custom_username, password='spuggy2020spuggy')
        obj.save()
        obj2 = Profile(user=obj, current_year=current_year,
                       name=name, branch=branch, email=email)
        obj2.save()
    token = Token.objects.get(user=obj)
    print(token)
    return redirect('http://127.0.0.1:8000/?token='+str(token)+'&username='+custom_username)
