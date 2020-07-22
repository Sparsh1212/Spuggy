
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import re_path
from spuggy import consumers

websocket_urlpatterns = [
  #  re_path(r'ws/chat$', consumers.CommentConsumer),
    re_path(r'ws/issue/(?P<issue_id>\w+)/$', consumers.CommentConsumer),
]

application = ProtocolTypeRouter({
    # http is channels.http.AsgiHandler by default 
    'websocket': AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})



# websocket_urlpatterns = [
#     re_path(r'ws/chat/(?P<room_name>\w+)/$', consumers.ChatConsumer),
# ]