# Generated by Django 3.2 on 2022-03-09 09:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_alter_folder_subfolder'),
    ]

    operations = [
        migrations.AlterField(
            model_name='folder',
            name='subfolder',
            field=models.ManyToManyField(blank=True, to='core.Folder'),
        ),
    ]
