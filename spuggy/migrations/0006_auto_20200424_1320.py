# Generated by Django 3.0.5 on 2020-04-24 07:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spuggy', '0005_profile'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='current_year',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
