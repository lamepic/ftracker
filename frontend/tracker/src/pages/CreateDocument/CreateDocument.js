import React, { useEffect, useState } from "react";
import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import Loading from "../../components/Loading/Loading";
import "./CreateDocument.css";
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  notification,
  Checkbox,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  createDocument,
  fetchDocumentAction,
  fetchDocumentType,
} from "../../http/document";
import { useStateValue } from "../../store/StateProvider";
import { departments, loadUsers } from "../../http/user";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";
import AttachmentModal from "../../components/AttachmentModal/AttachmentModal";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
    offset: 2,
  },
};

const validateMessages = {
  required: "This field is required!",
};

const openNotificationWithIcon = (type, description) => {
  notification[type]({
    message: "Error",
    description,
  });
};

const uploadRules = {
  // beforeUpload: (file) => {
  //   const isPDF = file.type === "application/pdf";
  //   if (!isPDF) {
  //     openNotificationWithIcon("error", "File is not a pdf");
  //     return;
  //   }
  //   return isPDF;
  // },

  onChange({ file, fileList }) {
    console.log(file);
    if (file.status !== "uploading") {
      console.log(file, fileList);
    }
  },
};

const dummyRequest = ({ file, onSuccess }) => {
  const isPDF = file.type === "application/pdf";
  if (!isPDF) {
    openNotificationWithIcon("error", "File is not a pdf");
    onSuccess("fail");
    return;
  }
  onSuccess("ok");

  // setTimeout(() => {

  // }, 0);
};

const getFile = (e) => {
  console.log("Upload event:", e);
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

function CreateDocument() {
  const [store, dispatch] = useStateValue();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [documentAction, setDocumentAction] = useState(null);
  const [namesOfUsers, setNamesOfUsers] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [encrypt, setEncrypt] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const [submitting, setSubmitting] = useState(false);

  //   api state
  const [_departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    _fetchDocumentType();
    fetchDepartments();
    fetchUsers();
    setLoading(false);
  }, []);

  const _fetchDocumentActions = async (id) => {
    try {
      const res = await fetchDocumentAction(store.token, id);
      const data = res.data;
      setDocumentAction(data);
      setSelectedDocumentType(data.document_type);

      if (data.document_type.name !== "Custom") {
        const name = `${data?.user?.first_name} ${data?.user?.last_name}`;
        form.setFieldsValue({
          department: data?.user?.department.name,
          receiver: name,
        });
        setUserDetails({
          department: data.user.department,
          receiver: data.user.staff_id,
        });
      } else {
        form.setFieldsValue({
          department: "",
          receiver: "",
        });
      }
    } catch (error) {
      openNotificationWithIcon("error", error.response.data.detail);
    }
  };

  const _fetchDocumentType = async () => {
    const res = await fetchDocumentType(store.token);
    const data = res.data;
    setDocumentTypes(data);
  };

  const onDepartmentChange = (value) => {
    const _namesOfUsers = users
      .filter(
        (user) =>
          user.staff_id !== store.user.staff_id && user.department?.id === value
      )
      .map((user) => {
        const { first_name, last_name, staff_id } = user;
        const name = `${first_name} ${last_name}`;
        return { staff_id, name };
      });
    setNamesOfUsers(_namesOfUsers);
  };

  const onDocumentTypeChange = async (value) => {
    _fetchDocumentActions(value);
  };

  const fetchDepartments = async () => {
    try {
      const res = await departments(store.token);
      setDepartments(res.data);
    } catch (error) {
      console.log("Fetch departments", error);
    }
  };

  const departmentOptions = _departments.map((department) => ({
    value: department.id,
    label: department.name,
  }));

  const fetchUsers = async () => {
    try {
      const res = await loadUsers(store.token);
      setUsers(res.data);
    } catch (error) {
      console.log("Fetch Users", error);
    }
  };

  const onEncryptChange = (e) => {
    setEncrypt(e.target.checked);
  };

  const [form] = Form.useForm();

  const onFinish = (values) => {
    let data = {};
    if (selectedDocumentType.name !== "Custom") {
      data = {
        subject: values.subject,
        reference: values.reference,
        receiver: userDetails.receiver,
        department: userDetails.department.id,
        document: values.document || null,
        attachments: attachments,
        encrypt: encrypt,
        documentType: values.document_type,
      };
    } else {
      data = {
        subject: values.subject,
        reference: values.reference,
        receiver: values.receiver,
        department: values.department,
        document: values.document || null,
        attachments: attachments,
        encrypt: encrypt,
        documentType: values.document_type,
      };
    }

    if (data.document === null) {
      swal({
        title: "Empty Document",
        text: "Submission of empty document, press OK to proceed",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willSubmit) => {
        if (willSubmit) {
          try {
            const res = await createDocument(store.token, data);
            if (res.status === 201) {
              history.replace("/dashboard/outgoing");
              swal("Document has been sent succesfully", {
                icon: "success",
              });
            }
          } catch (err) {
            console.log(err.response.data.detail);
            openNotificationWithIcon("error", err.response.data.detail);
          }
        }
      });
    } else {
      swal({
        title: "Are you sure you want to submit this Document?",
        text: "Submission of this Document is irreversible",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willSubmit) => {
        if (willSubmit) {
          setSubmitting(true);
          try {
            const res = await createDocument(store.token, data);
            if (res.status === 201) {
              setSubmitting(false);
              history.push("/dashboard/outgoing");
              swal("Document has been sent succesfully", {
                icon: "success",
              });
            }
          } catch (error) {
            openNotificationWithIcon("Error", error.response.data.detail);
          }
        }
      });
    }
  };

  return (
    <Box position="relative" marginTop="10px">
      {submitting && (
        <Box
          position="absolute"
          zIndex="1000"
          display="grid"
          placeItems="center"
          h="100%"
          w="100%"
          backdropFilter="blur(1px)"
        >
          <Box display="grid" placeItems="center">
            <Spinner
              thickness="4px"
              speed="0.65s"
              color="var(--dark-brown)"
              size="xl"
            />
            <Text fontWeight="600" color="var(--dark-brown)">
              Submitting...
            </Text>
          </Box>
        </Box>
      )}
      {!loading ? (
        <Box>
          <Heading as="h2" fontSize="22px" color="var(--dark-brown)">
            Add Document / Attachment
          </Heading>
          <hr className="divider" />
          <Box maxW="490px" marginTop="10px">
            <Form
              form={form}
              {...layout}
              name="complex-form"
              onFinish={onFinish}
              validateMessages={validateMessages}
              requiredMark={false}
            >
              <Form.Item
                labelAlign="left"
                name="subject"
                label="Subject"
                rules={[{ required: true }]}
              >
                <Input
                  style={{
                    borderColor: "var(--dark-brown)",
                    outline: "none",
                  }}
                />
              </Form.Item>
              <Form.Item
                name="reference"
                label="Reference"
                labelAlign="left"
                rules={[{ required: true }]}
              >
                <Input
                  style={{
                    borderColor: "var(--dark-brown)",
                    outline: "none",
                  }}
                />
              </Form.Item>
              <Form.Item
                name="document_type"
                label="Document Type"
                labelAlign="left"
                rules={[{ required: true, message: "Select a document type" }]}
              >
                <Select
                  placeholder="Select Document type"
                  style={{
                    borderColor: "var(--dark-brown)",
                    outline: "none",
                  }}
                  onChange={(value) => onDocumentTypeChange(value)}
                >
                  {documentTypes.map((documentType) => {
                    return (
                      <Select.Option
                        value={documentType.id}
                        key={documentType.id}
                      >
                        {documentType.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              {documentAction === null ||
              documentAction?.document_type?.name !== "Custom" ? (
                <Form.Item
                  labelAlign="left"
                  name="department"
                  label="Department"
                  rules={[{ required: true }]}
                >
                  <Input
                    style={{
                      borderColor: "var(--dark-brown)",
                      backgroundColor: "var(--lightest-brown)",
                      outline: "none",
                      color: "#000",
                    }}
                    disabled
                  />
                </Form.Item>
              ) : (
                <Form.Item
                  labelAlign="left"
                  name="department"
                  label="Department"
                  rules={[{ required: true }]}
                >
                  <Select
                    showSearch
                    placeholder="Select Department"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={onDepartmentChange}
                  >
                    {departmentOptions.map((department) => (
                      <Select.Option
                        value={department.value}
                        key={department.value}
                      >
                        {department.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
              {documentAction === null ||
              documentAction?.document_type?.name !== "Custom" ? (
                <Form.Item
                  labelAlign="left"
                  name="receiver"
                  label="To"
                  rules={[{ required: true }]}
                >
                  <Input
                    style={{
                      borderRadius: "3px",
                      borderColor: "var(--dark-brown)",
                      backgroundColor: "var(--lightest-brown)",
                      outline: "none",
                      color: "#000",
                    }}
                    disabled
                  />
                </Form.Item>
              ) : (
                <Form.Item
                  labelAlign="left"
                  name="receiver"
                  label="To"
                  rules={[{ required: true }]}
                >
                  <Select
                    showSearch
                    placeholder="Select Employee"
                    optionFilterProp="children"
                  >
                    {namesOfUsers &&
                      namesOfUsers.map((receiver) => (
                        <Select.Option
                          value={receiver.staff_id}
                          key={receiver.staff_id}
                        >
                          {receiver.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              )}
              <Form.Item
                labelAlign="left"
                name="document"
                label="Document"
                wrapperCol={{ ...layout.wrapperCol }}
                getValueFromEvent={getFile}
              >
                <Upload
                  maxCount={1}
                  {...uploadRules}
                  customRequest={dummyRequest}
                >
                  <Button icon={<UploadOutlined />} style={{ width: "285px" }}>
                    Upload
                  </Button>
                </Upload>
              </Form.Item>
              <Form.Item
                labelAlign="left"
                name="attachments"
                label={`Attachments (${attachments.length})`}
                wrapperCol={{ ...layout.wrapperCol }}
                getValueFromEvent={getFile}
              >
                <Button
                  icon={<UploadOutlined />}
                  style={{ width: "285px" }}
                  onClick={() => setOpenModal(true)}
                >
                  Upload Attachments
                </Button>
                {openModal && (
                  <AttachmentModal
                    getAttachments={setAttachments}
                    attachments={attachments}
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                  />
                )}
              </Form.Item>
              <Form.Item
                name="encrypt"
                label="Encrypt"
                labelAlign="left"
                valuePropName="checked"
              >
                <Checkbox onChange={onEncryptChange} />
              </Form.Item>
              <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 19 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    width: "100px",
                    backgroundColor: "var(--light-brown)",
                    border: "none",
                  }}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Box>
        </Box>
      ) : (
        <Loading />
      )}
    </Box>
  );
}

export default CreateDocument;
