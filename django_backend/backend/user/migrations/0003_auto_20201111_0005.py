# Generated by Django 3.1.3 on 2020-11-11 07:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0002_auto_20201108_1947'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='history',
            field=models.TextField(default='[]'),
        ),
        migrations.AlterField(
            model_name='user',
            name='photo',
            field=models.ImageField(upload_to='post_images'),
        ),
    ]