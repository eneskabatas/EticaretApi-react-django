from rest_framework import permissions

class IsSystemUser(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in ('GET',"HEAD","OPTIONS"):
            return True
        if request.user.is_systemuser:
            return True
class RegisterPermissons(permissions.BasePermission):
    def has_permission(self, request, view):
        
        if request.method in ('POST',"HEAD","OPTIONS"):
            return True
        
class CommentPermissions(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in ('GET','HEAD','OPTİONS'):
            return True
        if request.user:
            return True
    def has_object_permission(self, request, view, obj):
        return True