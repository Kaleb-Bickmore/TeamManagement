# Generated by Django 3.1.3 on 2020-11-12 16:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0004_auto_20201111_1101'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='end',
            field=models.CharField(max_length=120),
        ),
        migrations.AlterField(
            model_name='user',
            name='start',
            field=models.CharField(max_length=120),
        ),
    ]
