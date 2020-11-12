# Generated by Django 3.1.3 on 2020-11-09 01:40

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=120)),
                ('address', models.CharField(max_length=120)),
                ('emailaddress', models.EmailField(max_length=254)),
                ('phonenumber', models.CharField(max_length=120)),
                ('position', models.CharField(max_length=120)),
                ('start', models.DateField(default=django.utils.timezone.now)),
                ('end', models.DateField(default=django.utils.timezone.now)),
                ('department', models.CharField(max_length=120)),
                ('status', models.CharField(max_length=120)),
                ('shift', models.CharField(max_length=120)),
                ('manager', models.CharField(max_length=120)),
                ('photo', models.ImageField(upload_to='')),
                ('color', models.CharField(max_length=120)),
                ('permissions', models.CharField(max_length=120)),
                ('history', models.TextField()),
            ],
        ),
    ]