import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Upload } from "antd";
import Modal from "antd/lib/modal/Modal";
import React from "react";

const validateMessages = {
  required: "This field is required!",
};

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
    offset: 4,
  },
};

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("fail");
  }, 0);
};

const getFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

function CreateFileModal({ setOpenCreateFileModal, openCreateFileModal }) {
  const [form] = Form.useForm();

  const handleCancel = () => {
    setOpenCreateFileModal(false);
  };

  const onFinish = (values) => {
    console.log(values);
  };
  return (
    <>
      <Modal
        title="Upload File"
        visible={openCreateFileModal}
        onOk={form.submit}
        onCancel={handleCancel}
        style={{ top: 20 }}
      >
        <Form
          {...layout}
          form={form}
          name="complex-form"
          onFinish={onFinish}
          validateMessages={validateMessages}
          requiredMark={false}
        >
          <Form.Item
            labelAlign="left"
            name="name"
            label="Subject"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              style={{
                borderColor: "var(--dark-brown)",
                outline: "none",
              }}
            />
          </Form.Item>
          <Form.Item
            labelAlign="left"
            name="name"
            label="Reference"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              style={{
                borderColor: "var(--dark-brown)",
                outline: "none",
              }}
            />
          </Form.Item>
          <Form.Item
            labelAlign="left"
            name="document"
            label="File"
            wrapperCol={{ ...layout.wrapperCol }}
            getValueFromEvent={getFile}
          >
            <Upload maxCount={1} customRequest={dummyRequest}>
              <Button icon={<UploadOutlined />} style={{ width: "275px" }}>
                Upload
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default CreateFileModal;
