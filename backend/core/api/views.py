import json
from datetime import datetime
from click import help_option
from django.db.models import Q
from django.db import IntegrityError
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from rest_framework import views
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .. import models
from . import serializers
from ..libs import exceptions, utils
from users.api import serializers as user_serializers
from mptt.templatetags.mptt_tags import cache_tree_children

User = get_user_model()


class StaffIDLoginAPIView(views.APIView):
    permission_classes = (AllowAny,)

    # Get and return email of the user using the staff id
    def post(self, request, format=None):
        data = request.data
        retry_count = data.get('retry_count')

        try:
            staff_id = request.data.get('staff_id')
            user = get_object_or_404(User, staff_id=staff_id)
            email = user.email
        except:
            raise exceptions.StaffIDNotFound

        # if int(retry_count) > 5:
        #     user.is_active = False
        #     user.save()
        #     raise exceptions.LoginLimitExceeded

        return Response({"email": email}, status=status.HTTP_200_OK)


class LogoutAPIView(views.APIView):
    def post(self, request, format=None):
        request.user.auth_token.delete()
        return Response({"details": "log out success"}, status=status.HTTP_200_OK)


class IncomingAPIView(views.APIView):
    def get(self, request, document_id=None, format=None):
        try:
            if document_id:
                incoming_document = models.Trail.objects.filter(
                    document__id=document_id)[0]
                serialized_data = serializers.IncomingSerializer(
                    incoming_document)
                return Response(serialized_data.data, status=status.HTTP_200_OK)

            user = models.User.objects.get(staff_id=request.user.staff_id)
            incoming = models.Trail.objects.filter(
                forwarded=True,
                receiver=user, status='P')
        except Exception as err:
            raise exceptions.ServerError(err.args[0])

        serialized_data = serializers.IncomingSerializer(incoming, many=True)
        return Response(serialized_data.data, status=status.HTTP_200_OK)


class IncomingCountAPIView(views.APIView):
    def get(self, request, format=None):
        try:
            user = models.User.objects.get(staff_id=request.user.staff_id)
            incoming = models.Trail.objects.filter(
                forwarded=True,
                receiver=user, status='P')
            data = utils.Count(len(incoming))
        except Exception as err:
            raise exceptions.ServerError(err.args[0])
        serialized_data = serializers.CountSerializer(data)
        return Response(serialized_data.data, status=status.HTTP_200_OK)


class OutgoingAPIView(views.APIView):
    def get(self, request, format=None):
        user = models.User.objects.get(staff_id=request.user.staff_id)
        outgoing = models.Trail.objects.filter(
            send_id=user.staff_id,
            sender=user, status='P').order_by('-document__id').distinct('document__id')
        serialized_data = serializers.OutgoingSerializer(outgoing, many=True)
        return Response(serialized_data.data, status=status.HTTP_200_OK)


class OutgoingCountAPIView(views.APIView):
    def get(self, request, format=None):
        user = models.User.objects.get(staff_id=request.user.staff_id)
        outgoing = models.Trail.objects.filter(
            send_id=user.staff_id,
            sender=user, status='P').order_by('-document__id').distinct('document__id')
        data = utils.Count(len(outgoing))
        serialized_data = serializers.CountSerializer(data)
        return Response(serialized_data.data, status=status.HTTP_200_OK)


class ArchiveCountAPIView(views.APIView):
    def get(self, request, format=None):
        user = models.User.objects.get(staff_id=request.user.staff_id)
        archive = [archive for archive in models.Archive.objects.all().order_by(
            'created_by') if archive.created_by.department == user.department]
        folder_archive = models.Folder.objects.viewable(request.user)
        data = utils.Count(len(archive) + len(folder_archive))
        serialized_data = serializers.CountSerializer(data)
        return Response(serialized_data.data, status=status.HTTP_200_OK)


class DocumentAPIView(views.APIView):
    def get(self, request, id, format=None):
        try:
            document = get_object_or_404(models.Document, id=id)
            serialized_data = serializers.DocumentsSerializer(document)
        except:
            raise exceptions.DocumentNotFound

        return Response(serialized_data.data, status=status.HTTP_200_OK)


class MinuteAPIView(views.APIView):
    def post(self, request, document_id, format=None):
        content = request.data
        try:
            document = get_object_or_404(models.Document, id=document_id)
            creator = get_object_or_404(models.User, id=request.user.id)
            minute = models.Minute.objects.create(
                content=content, created_by=creator, document=document)
            serialized_data = serializers.MinuteSerializer(minute)
        except:
            raise exceptions.MinuteError

        return Response(serialized_data.data, status=status.HTTP_201_CREATED)


class ArchiveAPIView(views.APIView):
    def get(self, request, user_id=None, format=None):
        # get archive of logged in user[department]
        if user_id:
            try:
                employee = models.User.objects.get(
                    staff_id=user_id, is_department=True)

                data = [archive for archive in models.Archive.objects.all().order_by(
                    'created_by') if archive.created_by.department == employee.department]
                serialized_data = serializers.ArchiveSerializer(
                    data, many=True)
                return Response(serialized_data.data, status=status.HTTP_200_OK)
            except:
                raise exceptions.DocumentNotFound

        # get all archives in the database
        archives = models.Archive.objects.all()
        serialized_data = serializers.ArchiveSerializer(archives, many=True)

        return Response(serialized_data.data, status=status.HTTP_200_OK)


class MarkCompleteAPIView(views.APIView):
    def post(self, request, id, format=None):
        try:
            document = models.Document.objects.get(id=id)
            trails = models.Trail.objects.filter(document__id=id)
        except:
            raise exceptions.DocumentNotFound

        for trail in trails:
            trail.status = 'C'
            trail.save()

        completed_documents = models.Trail.objects.filter(
            document__id=id, status='C').order_by('date')
        last_trail = completed_documents.last()

        create_archive = models.Archive.objects.create(
            created_by=document.created_by, closed_by=last_trail.receiver, document=document)

        return Response({'message': 'marked as complete'}, status=status.HTTP_200_OK)


class TrackingAPIView(views.APIView):
    def get(self, request, document_id, format=None):
        trackingStep = []
        try:
            document = get_object_or_404(models.Document, id=document_id)
            trails = models.Trail.objects.filter(document__id=document_id)
            creator = document.created_by
            creator_detail = {
                "name": f'{creator.first_name} {creator.last_name}',
                "department": creator.department.name,
                "date": document.created_at
            }
            creator_data = utils.Tracking(
                creator_detail["name"], creator_detail["department"], creator_detail["date"])
            trackingStep.append(creator_data)

            for i in range(len(trails)-1, -1, -1):
                trail = trails[i]
                other_users_detail = {
                    "name": f'{trail.receiver.first_name} {trail.receiver.last_name}',
                    "department": trail.receiver.department.name,
                    "date": trail.date
                }
                data = utils.Tracking(
                    other_users_detail["name"], other_users_detail["department"], other_users_detail["date"])
                trackingStep.append(data)
        except:
            raise exceptions.TrackingNotFound

        serialized_data = serializers.TrackingSerializer(
            trackingStep, many=True)
        print(serialized_data.data)
        return Response(serialized_data.data, status=status.HTTP_200_OK)


class PreviewCodeAPIView(views.APIView):
    def post(self, request, user_id, document_id, format=None):
        data = request.data
        user_code = data.get('code')
        try:
            code = models.PreviewCode.objects.filter(
                user__staff_id=user_id, document__id=document_id).first()

            if user_code == code.code:
                code.used = True
                code.save()
        except:
            raise exceptions.PreviewCodeError

        return Response({'message': 'success'}, status=status.HTTP_200_OK)

    def get(self, request, user_id, document_id, format=None):
        try:
            data = models.PreviewCode.objects.filter(
                document__id=document_id, user__staff_id=user_id)
        except:
            raise exceptions.PreviewCodeNotFound

        serialised_data = serializers.PreviewCodeSerializer(data, many=True)
        return Response(serialised_data.data, status=status.HTTP_200_OK)


class DocumentTypeAPIView(views.APIView):
    def get(self, request, format=None):
        try:
            document_types = models.DocumentType.objects.filter(
                Q(department=request.user.department) | Q(department=None))

            serialized_data = serializers.DocumentTypeSerializer(
                document_types, many=True)
        except:
            raise exceptions.NotFound

        return Response(serialized_data.data, status=status.HTTP_200_OK)


class DocumentActionAPIView(views.APIView):

    def get(self, request, document_type_id=None, format=None):
        if document_type_id:
            try:
                # get document actions for the requested document type
                document_type = get_object_or_404(
                    models.DocumentType, id=document_type_id)
                document_action = models.DocumentAction.objects.filter(
                    document_type__id=document_type_id)
                if len(document_action) > 0:
                    # check if the last user in the document action is the department account else create a department action
                    document_action_last_user = document_action.last()
                    department_account = models.User.objects.get(
                        department=request.user.department, is_department=True)
                    if document_action_last_user.user != department_account:
                        document_type = document_action[0].document_type
                        models.DocumentAction.objects.create(
                            user=department_account, action='F', document_type=document_type)
                    # Check if the request.user [creator of document] is in the document actions
                    document_sender = [
                        user for user in document_action if user.user == request.user]
                    if len(document_sender) > 0:
                        # if request.user is in the document action send document to next user after request.user
                        document_action_lst = [
                            action for action in models.DocumentAction.objects.filter(
                                document_type__id=document_type_id)]
                        document_action_sender_index = document_action_lst.index(
                            document_sender[0])
                        # check if there is a next user to send to then send
                        if document_action_sender_index + 1 <= len(document_action_lst):
                            document_action_next_receiveing_user = document_action_lst[
                                document_action_sender_index + 1]
                        data = document_action_next_receiveing_user
                        serialized_data = serializers.DocumentActionSerializer(
                            data)
                        return Response(serialized_data.data, status=status.HTTP_200_OK)
                    else:
                        document_action_next_receiveing_user = document_action[0]
                        data = document_action_next_receiveing_user
                        serialized_data = serializers.DocumentActionSerializer(
                            data)
                        return Response(serialized_data.data, status=status.HTTP_200_OK)
                else:
                    data = {"document_type": {
                        "id": document_type_id, "name": "Custom"}}
                    return Response(data, status=status.HTTP_200_OK)
            except Exception as err:
                raise exceptions.BadRequest(err)


class ForwardDocumentAPIView(views.APIView):

    def get(self, request, document_id, format=None):
        try:
            document = models.Document.objects.get(id=document_id)
            if document.document_type.name == 'Custom':
                return Response({}, status=status.HTTP_200_OK)

            document_actions = models.DocumentAction.objects.filter(
                document_type=document.document_type)
            document_prev_trail = models.Trail.objects.filter(
                document=document)[0]
            next_receiving_user_index = document_prev_trail.order + 1
            if next_receiving_user_index <= len(document_actions)-1:
                next_receiving_user = document_actions[next_receiving_user_index].user
                serialized_receiver = user_serializers.UserSerializer(
                    next_receiving_user)
                data = {"receiver": serialized_receiver.data,
                        "last_receiver": False}
                return Response(data, status=status.HTTP_200_OK)
            else:
                data = {"receiver": None,
                        "last_receiver": True}
                return Response(data, status=status.HTTP_200_OK)
        except Exception as err:
            raise exceptions.ForwardDocumentError

    def post(self, request, format=None):
        data = request.data
        try:
            receiver = models.User.objects.get(staff_id=data.get('receiver'))
            sender = models.User.objects.get(staff_id=request.user.staff_id)
            document = models.Document.objects.get(id=data.get('document'))
        except Exception as e:
            raise exceptions.FieldError(e)

        if document.document_type.name.lower() == 'custom':
            try:
                prev_trail = models.Trail.objects.filter(
                    document=document).latest('document')
                prev_trail.forwarded = False
                prev_trail.save()

                # When a department is forwarding a document
                if sender.is_department:
                    # Department is same as that of receiver
                    if receiver.department == sender.department:
                        trail = models.Trail.objects.create(
                            receiver=receiver, sender=sender, document=document)
                        trail.send_id = sender.staff_id
                        trail.forwarded = True
                        trail.save()
                        utils.send_email(receiver=receiver,
                                         sender=sender, document=document, create_code=document.encrypt)
                    # Department is different from that of receiver
                    else:
                        meta_info = f'Receipient : {receiver}'
                        receiver_department_account = models.User.objects.get(
                            department=receiver.department, is_department=True)
                        trail = models.Trail.objects.create(
                            receiver=receiver_department_account, sender=sender, document=document, meta_info=meta_info)
                        # department_trail = models.DepartmentTrail.objects.create(
                        #     trail=trail)
                        trail.send_id = sender.staff_id
                        trail.forwarded = True
                        trail.save()
                        utils.send_email(receiver=receiver_department_account,
                                         sender=sender, document=document, create_code=document.encrypt)
                # When an employee is forwarding a document
                else:
                    # sending employee Department is same as receiver employee department
                    if receiver.department == sender.department:
                        trail = models.Trail.objects.create(
                            receiver=receiver, sender=sender, document=document)
                        trail.send_id = sender.staff_id
                        trail.forwarded = True
                        trail.save()
                        utils.send_email(receiver=receiver,
                                         sender=sender, document=document, create_code=document.encrypt)
                    # sending employee department is different from receiver employee department
                    else:
                        meta_info = f'Receipient : {receiver}'
                        receiver_department_account = models.User.objects.get(
                            department=receiver.department, is_department=True)
                        trail = models.Trail.objects.create(
                            receiver=receiver_department_account, sender=sender, document=document, meta_info=meta_info)
                        trail.send_id = sender.staff_id
                        trail.forwarded = True
                        trail.save()
                        utils.send_email(receiver=receiver_department_account,
                                         sender=sender, document=document, create_code=document.encrypt)
            except Exception as err:
                return Response({'error': 'Wrong Credentials'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            try:
                prev_trail = models.Trail.objects.filter(
                    document=document)[0]
                document_actions = models.DocumentAction.objects.filter(
                    document_type=document.document_type)
                prev_trail.forwarded = False
                prev_trail.save()

                # document_action_lst = [action for action in document_actions]

                document_action_receiver_index = prev_trail.order + 1
                trail = models.Trail.objects.create(
                    receiver=receiver, sender=sender, document=document, order=document_action_receiver_index)
                trail.send_id = sender.staff_id
                trail.forwarded = True
                trail.save()
                utils.send_email(receiver=receiver,
                                 sender=sender, document=document, create_code=document.encrypt)
            except Exception as err:
                raise exceptions.ServerError

        return Response({'message': 'Document forwarded'}, status=status.HTTP_201_CREATED)


class RequestDocumentAPIView(views.APIView):

    def post(self, request, format=None):
        data = request.data
        print(data)

        try:
            document = get_object_or_404(
                models.Document, id=data.get('document_id'))
        except:
            raise exceptions.DocumentNotFound

        try:
            requested_by = models.User.objects.get(
                staff_id=request.user.staff_id)
            archive_document = models.Archive.objects.get(
                document__id=document.id)

            requested_from = archive_document.created_by if archive_document.closed_by == None else archive_document.closed_by

            existing_request = models.RequestDocument.objects.filter(
                document__id=document.id, requested_by=requested_by, active=True)

            sent_document = models.ActivateDocument.objects.filter(
                document__id=document.id, document_receiver=requested_by, expired=False)

            if len(existing_request) > 0:
                return Response({'message': 'You already requested this document'}, status=status.HTTP_200_OK)

            if len(sent_document) > 0:
                return Response({'message': 'Document has been sent to you'}, status=status.HTTP_200_OK)

            create_request = models.RequestDocument.objects.create(
                requested_by=requested_by, document=document, requested_from=requested_from)
        except:
            raise exceptions.ServerError

        return Response({'message': 'Document request sent'}, status=status.HTTP_201_CREATED)

    def get(self, request, format=None):
        try:
            employee = models.User.objects.get(
                staff_id=request.user.staff_id)
            active_requests = models.RequestDocument.objects.filter(
                active=True, requested_from=employee)
            serialized_data = serializers.RequestDocumentSerializer(
                active_requests, many=True)
        except Exception as e:
            raise exceptions.ServerError

        return Response(serialized_data.data, status=status.HTTP_200_OK)


class NotificationsCountAPIView(views.APIView):

    def get(self, request, format=None):
        pending_document_requests = models.RequestDocument.objects.filter(
            active=True, requested_from=request.user).count()
        activated_documents = models.ActivateDocument.objects.filter(
            document_receiver=request.user, expired=False).count()

        total = pending_document_requests + activated_documents
        data = utils.Count(total)

        serialized_data = serializers.CountSerializer(data)

        return Response(serialized_data.data, status=status.HTTP_200_OK)


class ActivateDocument(views.APIView):
    def post(self, request, format=None):
        data = request.data

        try:
            document = get_object_or_404(
                models.Document, id=data.get('document_id'))
            receiver = get_object_or_404(
                User, staff_id=data.get('receiver_id'))
            sender = models.User.objects.get(staff_id=request.user.staff_id)
            date = data.get('expire_at')
        except Exception as e:
            raise exceptions.FieldError(e)

        try:
            expire_at = datetime.fromisoformat(date[:-1])

            requested_doc_instance = models.RequestDocument.objects.get(
                id=data['request_id'])

            activate_doc = models.ActivateDocument.objects.create(document=document, expire_at=expire_at, document_receiver=receiver,
                                                                  document_sender=sender)

            utils.send_email(receiver=receiver,
                             sender=sender, document=document, create_code=False)

            if activate_doc:
                requested_doc_instance.active = False
                requested_doc_instance.save()
        except:
            raise exceptions.ServerError

        return Response({'msg': 'Document has been activated and sent'}, status=status.HTTP_201_CREATED)

    def get(self, request, format=None):
        try:
            employee = models.User.objects.get(
                staff_id=request.user.staff_id)
            activated_documents = models.ActivateDocument.objects.filter(
                expired=False, document_receiver=employee)
        except:
            raise exceptions.ServerError

        serialized_data = serializers.ActivateDocumentSerializer(
            activated_documents, many=True)

        return Response(serialized_data.data, status=status.HTTP_200_OK)


class CreateFlow(views.APIView):
    def post(self, request, format=None):
        data = request.data

        name = data.get('flowName')
        flow = data.get('users')

        if len(flow) == 0:
            raise exceptions.FieldError("Flow cannot be empty")

        try:
            document_type = models.DocumentType.objects.create(
                name=name, department=request.user.department)

            for action in flow:
                employee = models.User.objects.get(
                    staff_id=action.get('employee'))
                act = action.get('action')
                if act.startswith('f'):
                    document_action = models.DocumentAction.objects.create(
                        user=employee, action='F', document_type=document_type)

                if act.startswith('c'):
                    document_action = models.DocumentAction.objects.create(
                        user=employee, action='CC', document_type=document_type)
        except Exception as err:
            raise exceptions.ServerError(err.args[0])

        return Response(request.data, status=status.HTTP_200_OK)

    def get(self, request, format=None):
        flow = models.DocumentType.objects.filter(
            department=request.user.department)
        serialized_data = serializers.FlowSerializer(flow, many=True)

        return Response(serialized_data.data, status=status.HTTP_200_OK)


class SearchAPIView(views.APIView):
    def get(self, request, term, format=None):
        documents = []
        active_requested_document = models.RequestDocument.objects.filter(
            requested_by=request.user, active=True)
        active_requested_document_lst = [
            doc.document for doc in active_requested_document]

        # activated documents
        activated_documents = models.ActivateDocument.objects.filter(
            document_receiver=request.user, expired=False)
        activated_document_lst = [doc.document for doc in activated_documents]
        for item in activated_documents:
            document_serializer = serializers.DocumentsSerializer(
                item.document)
            activated_data = {
                "document": document_serializer.data, "route": "activated"}
            documents.append(activated_data)

        # pending documents
        for item in active_requested_document:
            document_serializer = serializers.DocumentsSerializer(
                item.document)
            pending_data = {
                "document": document_serializer.data, "route": "pending"}
            documents.append(pending_data)

        # incoming documents
        incoming = models.Trail.objects.filter(
            forwarded=True,
            receiver=request.user, status='P')
        for item in incoming:
            document_serializer = serializers.DocumentsSerializer(
                item.document)
            incoming_data = {
                "document": document_serializer.data, "route": "incoming"}
            documents.append(incoming_data)

        # outgoing documents
        outgoing = models.Trail.objects.filter(
            send_id=request.user.staff_id,
            sender=request.user, status='P').order_by('-document__id').distinct('document__id')
        for item in outgoing:
            document_serializer = serializers.DocumentsSerializer(
                item.document)
            outgoing_data = {
                "document": document_serializer.data, "route": "outgoing"}
            documents.append(outgoing_data)

        # created archived documents
        archive = [archive for archive in models.Archive.objects.all()]
        for item in archive:
            if item.document not in active_requested_document_lst and item.document not in activated_document_lst:
                document_serializer = serializers.DocumentsSerializer(
                    item.document)
                archive_data = {
                    "document": document_serializer.data,
                    "route": "archive",
                    "department": item.created_by.department.name if item.closed_by == None else item.closed_by.department.name}
                documents.append(archive_data)

        data = [doc for doc in documents if term.lower() in doc['document']
                ['subject'].lower()]

        return Response(data, status=status.HTTP_200_OK)


class CreateDocument(views.APIView):

    def post(self, request, format=None):
        data = request.data
        data_lst = list(data)  # for attachments

        data_document_type = data.get('documentType')
        document = data.get('document')
        reference = data.get('reference')
        subject = data.get('subject')
        filename = data.get('filename')
        encrypt = json.loads(data.get('encrypt'))

        receiver = get_object_or_404(
            models.User, staff_id=data.get("receiver"))
        sender = get_object_or_404(
            models.User, staff_id=self.request.user.staff_id)
        document_type = get_object_or_404(
            models.DocumentType, id=data_document_type)

        if document_type.name.lower() == 'custom':
            department = data.get('department')

            meta_info = f'Receipient : {receiver}'

            receiver_department_account = get_object_or_404(
                models.User, is_department=True, department__id=receiver.department.id)

            try:
                # creating documents and attachments
                document = models.Document.objects.create(
                    content=document, subject=subject, created_by=sender,
                    ref=reference, document_type=document_type, encrypt=encrypt, filename=filename)
                if document:
                    count = 0
                    for item in data_lst:
                        if item == f'attachment_{count}':
                            doc = data[item]
                            if f'attachment_subject_{count}' in data_lst:
                                sub = data[f'attachment_subject_{count}']

                            related_document = models.RelatedDocument.objects.create(
                                subject=sub, content=doc, document=document)
                            count += 1

                # send to reciever department if sender and receiver not in the same department
                if sender.department != receiver.department:
                    trail = models.Trail.objects.create(
                        receiver=receiver_department_account, sender=sender, document=document, meta_info=meta_info)
                    trail.forwarded = True
                    trail.send_id = sender.staff_id
                    trail.save()
                    utils.send_email(receiver=receiver_department_account,
                                     sender=sender, document=document, create_code=encrypt)
                else:
                    # send to receiver
                    trail = models.Trail.objects.create(
                        receiver=receiver, sender=sender, document=document, meta_info=meta_info)
                    trail.forwarded = True
                    trail.send_id = sender.staff_id
                    trail.save()
                    utils.send_email(receiver=receiver,
                                     sender=sender, document=document, create_code=encrypt)
            except Exception as err:
                raise exceptions.ServerError(err.args[0])
        else:
            try:
                document_type = models.DocumentType.objects.get(
                    id=data_document_type)
                document = models.Document.objects.create(
                    content=document, subject=subject, created_by=sender,
                    ref=reference, document_type=document_type, filename=filename)
                if document:
                    count = 0
                    for item in data_lst:
                        if item == f'attachment_{count}':
                            doc = data[item]
                            if f'attachment_subject_{count}' in data_lst:
                                sub = data[f'attachment_subject_{count}']

                            related_document = models.RelatedDocument.objects.create(
                                subject=sub, content=doc, document=document)
                            count += 1
                document_actions = models.DocumentAction.objects.filter(
                    document_type=document_type)
                document_action_receiver = [
                    path for path in document_actions if path.user == receiver]
                document_action_lst = [action for action in document_actions]

                if len(document_action_receiver) > 0:
                    document_action_receiver_index = document_action_lst.index(
                        document_action_receiver[0])
                    current_trail_position = document_action_receiver_index

                    trail = models.Trail.objects.create(
                        receiver=receiver, sender=sender, document=document, order=current_trail_position)
                    trail.forwarded = True
                    trail.send_id = sender.staff_id
                    trail.save()
                    utils.send_email(receiver=receiver,
                                     sender=sender, document=document, create_code=encrypt)
            except Exception as err:
                raise exceptions.ServerError(err.args[0])

        return Response({'message': 'Document sent'}, status=status.HTTP_201_CREATED)


class FolderAPIView(views.APIView):

    def get(self, request, slug=None, format=None):
        try:
            if slug is None:
                tree = cache_tree_children(
                    models.Folder.objects.viewable(request.user))
                serializer = serializers.FolderSerializer(tree, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)

            tree = cache_tree_children(models.Folder.objects.children(slug))
            serializer = serializers.FolderSerializer(tree, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as err:
            raise exceptions.ServerError(err.args[0])

    def post(self, request, format=None):
        folder_name = request.data.get("name")
        parent_folder_id = request.data.get("folderId")

        try:
            new_folder = models.Folder.objects.create(
                name=folder_name, parent_id=parent_folder_id, created_by=request.user)
            serialized_data = serializers.FolderSerializer(new_folder)
            return Response(serialized_data.data, status=status.HTTP_201_CREATED)
        except Exception as err:
            raise exceptions.ServerError(err.args[0])


class ArchiveFileAPIView(views.APIView):

    def post(self, request, format=None):
        subject = request.data.get("subject")
        reference = request.data.get("reference")
        file = request.data.get("file")
        parent_folder_id = request.data.get("parentFolderId")
        filename = request.data.get("filename")

        try:
            if parent_folder_id != "undefined":
                parent_folder = models.Folder.objects.get_queryset().filter(
                    id=parent_folder_id)
                file = models.Document.objects.create(
                    subject=subject, ref=reference, content=file,
                    created_by=request.user, folder=parent_folder[0], filename=filename)
                serialized_data = serializers.DocumentsSerializer(file)
            else:
                try:
                    file = models.Document.objects.create(
                        subject=subject, ref=reference, content=file, created_by=request.user, filename=filename)
                except IntegrityError:
                    raise exceptions.ServerError(
                        "Reference exists, please provide a unique reference")

                archive = models.Archive.objects.create(
                    document=file, created_by=request.user)
                serialized_data = serializers.ArchiveSerializer(archive)

            return Response(serialized_data.data, status=status.HTTP_201_CREATED)
        except Exception as err:
            raise exceptions.ServerError(err.args[0])
