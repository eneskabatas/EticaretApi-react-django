# Generated by Django 4.1.1 on 2025-01-31 17:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_alter_user_password'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='ad',
            new_name='first_name',
        ),
        migrations.RenameField(
            model_name='user',
            old_name='soyad',
            new_name='last_name',
        ),
    ]
