from rest_framework import serializers

from .. import models

from users.api import serializers as users_serializers


class MinuteSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Minute
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['user'] = f'{instance.created_by.first_name} {instance.created_by.last_name}'
        return representation


class RelatedDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.RelatedDocument
        fields = ['id', 'subject', 'content']


class PreviewCodeSerializer(serializers.ModelSerializer):
    user = users_serializers.UserSerializer()

    class Meta:
        model = models.PreviewCode
        fields = ['code', 'used', 'user']


class DocumentTypeSerializer(serializers.ModelSerializer):
    department = users_serializers.DepartmentSerializer()

    class Meta:
        model = models.DocumentType
        fields = ['id', 'name', 'department']


class DocumentActionSerializer(serializers.ModelSerializer):
    document_type = DocumentTypeSerializer()
    user = users_serializers.UserSerializer()

    class Meta:
        model = models.DocumentAction
        fields = ['id', 'user', 'action', 'document_type']


class DocumentsSerializer(serializers.ModelSerializer):
    minute = serializers.SerializerMethodField()
    related_document = serializers.SerializerMethodField()
    preview_code = serializers.SerializerMethodField()
    document_type = DocumentTypeSerializer()

    class Meta:
        model = models.Document
        fields = ['id', 'content', 'subject', 'minute',
                  'related_document', 'preview_code', 'ref', 'document_type', "filename", "created_at"]

    def get_related_document(self, obj):
        related_document = obj.relateddocument_set
        serialized_related_document = RelatedDocumentSerializer(
            related_document, many=True)
        return serialized_related_document.data

    def get_minute(self, obj):
        minute = models.Minute.objects.filter(document=obj)
        serialized_data = MinuteSerializer(minute, many=True)
        return serialized_data.data

    def get_preview_code(self, obj):
        code = models.PreviewCode.objects.filter(document=obj)
        serialized_data = PreviewCodeSerializer(code, many=True)
        return serialized_data.data


class IncomingSerializer(serializers.ModelSerializer):
    sender = users_serializers.UserSerializer()
    document = DocumentsSerializer()
    related_document = serializers.SerializerMethodField()

    class Meta:
        model = models.Trail
        fields = ['id', 'sender', 'document',
                  'date', 'related_document', 'meta_info']

    def get_related_document(self, obj):
        related_document = obj.document.relateddocument_set
        serialized_related_document = RelatedDocumentSerializer(
            related_document, many=True)
        return serialized_related_document.data


class OutgoingSerializer(serializers.ModelSerializer):
    receiver = users_serializers.UserSerializer()
    document = DocumentsSerializer()
    related_document = serializers.SerializerMethodField()

    class Meta:
        model = models.Trail
        fields = ['id', 'receiver', 'document',
                  'date', 'related_document', 'meta_info']

    def get_related_document(self, obj):
        related_document = obj.document.relateddocument_set
        serialized_related_document = RelatedDocumentSerializer(
            related_document, many=True)
        return serialized_related_document.data


class TrailSerializer(serializers.ModelSerializer):
    sender = users_serializers.UserSerializer()
    receiver = users_serializers.UserSerializer()
    document = DocumentsSerializer(required=False)
    related_document = serializers.SerializerMethodField()

    class Meta:
        model = models.Trail
        fields = ['sender', 'receiver', 'document',
                  'related_document', 'meta_info']

    def get_related_document(self, obj):
        related_document = obj.document.relateddocument_set
        serialized_related_document = RelatedDocumentSerializer(
            related_document, many=True)
        return serialized_related_document.data


class ArchiveSerializer(serializers.ModelSerializer):
    created_by = users_serializers.UserSerializer()
    closed_by = users_serializers.UserSerializer()
    document = DocumentsSerializer(required=False)

    class Meta:
        model = models.Archive
        fields = ['created_by', 'closed_by', 'document']


class RequestDocumentSerializer(serializers.ModelSerializer):
    requested_by = users_serializers.UserSerializer()
    requested_from = users_serializers.UserSerializer()
    document = DocumentsSerializer()

    class Meta:
        model = models.RequestDocument
        fields = ['id', 'requested_by', 'requested_from',
                  'document', 'active', 'created_at']


class ActivateDocumentSerializer(serializers.ModelSerializer):
    document = DocumentsSerializer()
    document_receiver = users_serializers.UserSerializer()
    document_sender = users_serializers.UserSerializer()

    class Meta:
        model = models.ActivateDocument
        fields = ['id', 'document', 'expire_at', 'document_receiver',
                  'document_sender', 'date_activated', 'expired']


class CountSerializer(serializers.Serializer):
    count = serializers.IntegerField()


class TrackingSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=50)
    department = serializers.CharField(max_length=30)
    date = serializers.DateTimeField()


class FlowSerializer(serializers.ModelSerializer):
    document_action = serializers.SerializerMethodField()

    class Meta:
        model = models.DocumentType
        fields = ["id", "name", "document_action"]

    def get_document_action(self, obj):
        document_action = obj.documentaction_set
        serialized_document_action = DocumentActionSerializer(
            document_action, many=True)
        return serialized_document_action.data


class RecursiveField(serializers.Serializer):
    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data


class FolderSerializer(serializers.ModelSerializer):
    children = RecursiveField(many=True, required=False)
    documents = serializers.SerializerMethodField()

    class Meta:
        model = models.Folder
        fields = ('id', 'name', "slug", "documents", 'children')

    def get_documents(self, obj):
        documents = obj.document_set
        serialized_document = DocumentsSerializer(
            documents, many=True)
        return serialized_document.data
