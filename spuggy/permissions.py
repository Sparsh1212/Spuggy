from rest_framework import permissions

class IsCreatorOrReadOnlyProject(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        if request.user.profile.status == 'Admin':
            return True

        for team_member in obj.team_members.all():
            if team_member == request.user:
                return True

        if obj.created_by == request.user:
            return True

        return False        


class IsCreatorOrReadOnlyIssue(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        if request.user.profile.status == 'Admin':
            return True
        
        for team_member in obj.issue_project.team_members.all():
            if team_member == request.user:
                return True

        if obj.issue_project.created_by == request.user:
            return True

        return False

class OnlyAdminAccess(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.user.profile.status == 'Admin':
            return True
        return False
    
    def has_object_permission(self, request, view, obj):

        if request.user.profile.status == 'Admin':
            return True

        return False        
