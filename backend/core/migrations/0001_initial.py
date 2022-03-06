# Generated by Django 3.2 on 2022-02-23 14:49

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Document',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.FileField(blank=True, upload_to='documents/')),
                ('subject', models.CharField(max_length=100)),
                ('ref', models.CharField(blank=True, max_length=60, null=True)),
                ('encrypt', models.BooleanField(default=False)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='document_creator', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Trail',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('status', models.CharField(choices=[('P', 'Pending'), ('C', 'Completed')], default='P', max_length=1)),
                ('meta_info', models.CharField(blank=True, max_length=100, null=True)),
                ('send_id', models.CharField(max_length=50)),
                ('forwarded', models.BooleanField(default=False)),
                ('order', models.IntegerField(blank=True, null=True)),
                ('document', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.document')),
                ('receiver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='receiver', to=settings.AUTH_USER_MODEL)),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sender', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ('-date', 'status'),
            },
        ),
        migrations.CreateModel(
            name='RequestDocument',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('active', models.BooleanField(default=True)),
                ('document', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.document')),
                ('requested_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='request_creator', to=settings.AUTH_USER_MODEL)),
                ('requested_from', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='request_receiver', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='RelatedDocument',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('subject', models.CharField(max_length=100)),
                ('content', models.FileField(upload_to='related_documents/')),
                ('document', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.document')),
            ],
        ),
        migrations.CreateModel(
            name='PreviewCode',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=4)),
                ('used', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('document', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='document_code', to='core.document')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='employee_code', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ('-created_at',),
            },
        ),
        migrations.CreateModel(
            name='Minute',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('document', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.document')),
            ],
            options={
                'ordering': ('-date',),
            },
        ),
        migrations.CreateModel(
            name='DocumentType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('department', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='flow_department', to='users.department')),
            ],
        ),
        migrations.CreateModel(
            name='DocumentAction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('action', models.CharField(choices=[('F', 'Forward'), ('CC', 'Carbon Copy')], max_length=2)),
                ('document_type', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='core.documenttype')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='document',
            name='document_type',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='core.documenttype'),
        ),
        migrations.CreateModel(
            name='Archive',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('close_date', models.DateTimeField(auto_now_add=True)),
                ('requested', models.BooleanField(default=False)),
                ('closed_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='closed_by_employee', to=settings.AUTH_USER_MODEL)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='created_by_employee', to=settings.AUTH_USER_MODEL)),
                ('document', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='archive_document', to='core.document')),
            ],
        ),
        migrations.CreateModel(
            name='ActivateDocument',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_activated', models.DateTimeField(auto_now_add=True)),
                ('expire_at', models.DateTimeField()),
                ('expired', models.BooleanField(default=False)),
                ('document', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.document')),
                ('document_receiver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='activate_document_sender', to=settings.AUTH_USER_MODEL)),
                ('document_sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='activate_document_receiver', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]