# Generated by Django 3.2 on 2022-03-09 09:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_alter_folder_document'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='folder',
            name='subfolder',
        ),
        migrations.AddField(
            model_name='folder',
            name='subfolder',
            field=models.ManyToManyField(blank=True, null=True, to='core.Folder'),
        ),
    ]