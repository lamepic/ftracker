import random
import json
import uuid
from django.db import models
from django.dispatch import receiver
from django.forms import ValidationError
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.template.defaultfilters import slugify
from django.utils.translation import ugettext as _
from mptt.models import MPTTModel, TreeForeignKey, TreeManager
from django_celery_beat.models import PeriodicTask, CrontabSchedule


from users import models as users_model


User = get_user_model()


class DocumentAction(models.Model):
    ACTION_OPTIONS = (
        ('F', 'Forward'),
        ('CC', 'Carbon Copy')
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=2, choices=ACTION_OPTIONS)
    document_type = models.ForeignKey(
        'DocumentType', on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f'{self.user.first_name} {self.user.last_name} - {self.action}'


class DocumentType(models.Model):
    name = models.CharField(max_length=100)
    department = models.ForeignKey(
        users_model.Department, on_delete=models.CASCADE, related_name='flow_department', blank=True, null=True)

    def __str__(self):
        if self.department:
            return f'{self.name} [{self.department.name}]'
        return f'{self.name}'


class Document(models.Model):
    content = models.FileField(upload_to='documents/', blank=True, null=False)
    subject = models.CharField(max_length=100)
    filename = models.CharField(max_length=100)
    ref = models.CharField(max_length=60, blank=True, null=True, unique=True)
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='document_creator')
    document_type = models.ForeignKey(
        DocumentType, on_delete=models.CASCADE, null=True, blank=True)
    encrypt = models.BooleanField(default=False)
    folder = models.ForeignKey(
        "Folder", on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.subject

    def save(self, *args, **kwargs):
        if len(self.subject.strip()) == 0:
            raise ValidationError("Subject cannot be blank")
        if len(self.ref.strip()) == 0:
            raise ValidationError("Reference cannot be blank")

        if self.content:
            filename = self.content.name
            check = (".pdf", ".docx", ".xls", ".xlsx",
                     ".ppt", ".pptx", ".txt", ".jpeg", ".jpg")
            if not filename.endswith(check):
                raise ValidationError("Unsupported File format")

        self.subject = self.subject.strip()
        self.ref = self.ref.strip()

        super(Document, self).save(*args, **kwargs)


class RelatedDocument(models.Model):
    subject = models.CharField(max_length=100)
    content = models.FileField(upload_to='related_documents/')
    document = models.ForeignKey(Document, on_delete=models.CASCADE)

    def __str__(self):
        return self.subject

    def save(self, *args, **kwargs):
        if len(self.subject.strip()) == 0:
            raise ValidationError("Subject cannot be blank")
        if len(self.ref.strip()) == 0:
            raise ValidationError("Reference cannot be blank")

        if self.content:
            filename = self.content.name
            check = (".pdf", ".docx", ".xls", ".xlsx",
                     ".ppt", ".pptx", ".txt", ".jpeg", ".jpg")
            if not filename.endswith(check):
                raise ValidationError("Unsupported File format")

        self.document.related_document = True
        self.subject = self.subject.strip()
        self.ref = self.ref.strip()
        super(RelatedDocument, self).save(*args, **kwargs)


class Minute(models.Model):
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    content = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-date',)

    def __str__(self):
        return self.content


class Trail(models.Model):
    STATUS_OPTIONS = (
        ('P', 'Pending'),
        ('C', 'Completed')
    )

    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='sender')
    receiver = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='receiver')
    date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=1, choices=STATUS_OPTIONS, default='P')
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    meta_info = models.CharField(max_length=100, blank=True, null=True)
    send_id = models.CharField(max_length=50)
    forwarded = models.BooleanField(default=False)
    order = models.IntegerField(null=True, blank=True)

    class Meta:
        ordering = ('-date', 'status')

    def __str__(self):
        return f'{self.sender} ==> {self.receiver}'


class PreviewCode(models.Model):
    code = models.CharField(max_length=4)
    document = models.ForeignKey(
        Document, on_delete=models.CASCADE, related_name='document_code')
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='employee_code')
    used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.document.subject} - {self.code}'

    class Meta:
        ordering = ('-created_at',)


class Archive(models.Model):
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='created_by_employee')
    closed_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='closed_by_employee', null=True, blank=True)
    document = models.ForeignKey(
        Document, on_delete=models.CASCADE, related_name='archive_document')
    close_date = models.DateTimeField(auto_now_add=True)
    requested = models.BooleanField(default=False)

    def __str__(self):
        return self.document.subject


class RequestDocument(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    requested_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='request_creator')
    requested_from = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='request_receiver')
    created_at = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return f'{self.document.subject}'


class ActivateDocument(models.Model):
    document_receiver = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='activate_document_sender')
    document_sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='activate_document_receiver')
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    date_activated = models.DateTimeField(auto_now_add=True)
    expire_at = models.DateTimeField()
    expired = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.document.subject} - {self.expire_at}'


class FolderManager(TreeManager):
    def viewable(self, user):
        queryset = self.get_queryset().filter(created_by=user, level=0)
        return queryset

    def children(self, slug):
        queryset = self.get_queryset().filter(slug=slug, level__lte=50)
        return queryset


class Folder(MPTTModel):
    name = models.CharField(max_length=60)
    parent = TreeForeignKey('self', on_delete=models.CASCADE,
                            null=True, blank=True, related_name='children')
    slug = models.SlugField()
    objects = FolderManager()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    class MPTTMeta:
        order_insertion_by = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if len(self.name.strip()) == 0:
            raise ValidationError("Name cannot be blank")

        unique_id = uuid.uuid4()
        if not self.slug:
            self.slug = slugify(unique_id)

        return super().save(*args, **kwargs)


@ receiver(post_save, sender=ActivateDocument)
def expire_date_handler(sender, instance, created, **kwargs):
    secret_id = random.randint(1, 9999)
    if created:
        schedule, created = CrontabSchedule.objects.get_or_create(
            minute=0, hour=0,
            day_of_month=instance.expire_at.day, month_of_year=instance.expire_at.month)

        task = PeriodicTask.objects.create(crontab=schedule, name='document_'+str(
            secret_id), task='core.tasks.expire_document', args=json.dumps((instance.id,)))
