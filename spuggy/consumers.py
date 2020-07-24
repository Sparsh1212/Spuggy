from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth.models import User
from .models import Comment_model, Issue_model
import json
from django.core.mail import send_mail
from decouple import config
import threading


class CommentConsumer(WebsocketConsumer):

    def fetch_messages(self, data):

        issue = Issue_model.objects.get(id=data['issue_id'])

        messages = issue.comment_model_set.all().order_by('comment_date')
        messages_list = []
        for message in messages:
            messages_list.append({
                'id': message.id,
                'text': message.comment_text,
                'date': str(message.comment_date),
                'comment_creator': message.commented_by.username,
            })

        content = {
            'command': 'messages',
            'messages': messages_list
        }
        print(content)
        self.send(text_data=json.dumps(content))

    def new_message(self, data):
        commented_by = data['commented_by']
        comment_text = data['comment_text']
        comment_issue = data['comment_issue']
        comment_project = data['comment_project']

        new_comment = Comment_model.objects.create(comment_issue_id=comment_issue,
                                                   comment_project_id=comment_project, commented_by_id=commented_by,
                                                   comment_text=comment_text)
        content = {
            'command': 'new_message',
            'message': {
                'id': new_comment.id,
                'text': new_comment.comment_text,
                'date': str(new_comment.comment_date),
                'comment_creator': new_comment.commented_by.username,
            }

        }
        async_to_sync(self.channel_layer.group_send)(self.room_group_name,
                                                     {
                                                         'type': 'chat_message',
                                                         'message': content
                                                     }
                                                     )

        def send_email():
            email_subject = 'New Comment Added'
            email_body = '<b>Comment:</b> '+new_comment.comment_text+' <b>Issue:</b> ' + \
                new_comment.comment_issue.issue_title+' <b>Project:</b> ' + \
                new_comment.comment_project.project_name
            email_sender = config('EMAIL_HOST_USER')
            team_members_recipents = []
            team_members_recipents.append(
                new_comment.comment_issue.created_by.profile.email)
            for team_member in new_comment.comment_project.team_members.all():
                team_members_recipents.append(team_member.profile.email)
            send_mail(email_subject, email_body, email_sender,
                      team_members_recipents, fail_silently=True)
        email_thread = threading.Thread(target=send_email)
        email_thread.start()

    commands = {

        'fetch_messages': fetch_messages,
        'new_message': new_message
    }

    def connect(self):
        print('Request aayi thi connection ki !!')
#        self.room_name = 'room'
#        self.room_group_name = 'chat_' + self.room_name
        self.room_name = self.scope['url_route']['kwargs']['issue_id']
        self.room_group_name = 'issue_'+self.room_name
        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        print('Request aayi thi band karne ki !!')
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        # Receive message from WebSocket
        json_data = json.loads(text_data)
        self.commands[json_data['command']](self, json_data)

    # Receive message from room group
    def chat_message(self, event):
        message = event['message']
        print(message)
        self.send(text_data=json.dumps(message))

# self.room_name = self.scope['url_route']['kwargs']['room_name']
# self.room_group_name = 'chat_%s' % self.room_name
