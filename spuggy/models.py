from django.db import models
from django.contrib.auth.models import User
from djrichtextfield.models import RichTextField
from django.db.models.signals import post_save
from django.dispatch import receiver

from django.conf import settings
from rest_framework.authtoken.models import Token


class Project_model(models.Model):

    created_by = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True, related_name='project_creator')
    project_name = models.CharField(max_length=100)
    testing_procedure = RichTextField()
    creation_date = models.DateTimeField(auto_now_add=True)
    team_members = models.ManyToManyField(User, blank=True)

    def __str__(self):
        return self.project_name

class Issue_model(models.Model):
    issue_title = models.CharField(max_length=200)
    issue_description = models.TextField(blank=True)
    issue_image = models.ImageField(upload_to='issueimg/',null=True, blank=True)
    created_by = models.ForeignKey(User,blank=True, null=True, related_name='issue_creator', on_delete=models.CASCADE)
    assigned_to = models.ForeignKey(User,blank=True, null=True, related_name='issue_handler', on_delete=models.CASCADE)
    issue_date = models.DateTimeField(auto_now_add=True)
    issue_project = models.ForeignKey(Project_model, on_delete=models.CASCADE)
    # specifying status
    STATUS_CHOICES = (
        ("Created", "Created"),
        ("Open", "Open"),
        ("Rejected", "Rejected"),
        ("Assigned", "Assigned")
        ,("Resolved", "Resolved"),
    )

    issue_status = models.CharField(max_length=100, choices=STATUS_CHOICES, default='Created')
    # specifying choices
    SEMESTER_CHOICES = ( 
    ("UI", "Enhancement/UI"), 
    ("Bug", "Bug"), 
)
    issue_tag = models.CharField(max_length=100, choices=SEMESTER_CHOICES, default='Bug')

    def __str__(self):
        return self.issue_title

class Comment_model(models.Model):
    comment_project = models.ForeignKey(Project_model, on_delete=models.CASCADE)
    comment_issue = models.ForeignKey(Issue_model, on_delete=models.CASCADE)
    commented_by = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    comment_text = models.TextField()
    comment_date = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return self.comment_text



class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    current_year = models.IntegerField(blank=True, null=True)
    branch = models.CharField(max_length=200)

    STATUS_CHOICES = (
        ("Normal", "Normal"),
        ("Admin", "Admin"),
    )
    status = models.CharField(max_length=100,choices=STATUS_CHOICES, default='Normal')
    isBlocked = models.BooleanField(default=False)
    email = models.EmailField(max_length = 254, null=True, blank=True)

    def __str__(self):
        return self.name    




@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)







    

