from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import ProjectViewSet, IssueViewSet, CommentViewSet,  ProfileViewSet, MyCreatedIssuesViewSet, UsersViewSet, MyAssignedIssuesViewSet, UserProfileViewSet, oauth_handler

router = SimpleRouter()
router.register("api/Projects", ProjectViewSet)
router.register("api/Issues", IssueViewSet)
router.register("api/Comments", CommentViewSet)

router.register("api/Profiles", ProfileViewSet)
router.register("api/UserProfile", UserProfileViewSet, basename='Profile')
router.register("api/MyCreatedIssues",MyCreatedIssuesViewSet, basename='Issue_model')
router.register("api/Users", UsersViewSet)
router.register("api/MyAssignedIssues",MyAssignedIssuesViewSet, basename='Issue_model')


urlpatterns = router.urls
urlpatterns += [ path('oauth/', oauth_handler , name="oauth_handler"), ]
