# Generated by Django 3.0.5 on 2020-05-05 13:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spuggy', '0013_auto_20200501_1551'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='email',
            field=models.EmailField(blank=True, max_length=254, null=True),
        ),
    ]
