import React, { useState } from "react";
import "./AttachmentModal.css";

import { Button, Form, Input, Modal, notification, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
    offset: 4,
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
  beforeUpload: (file) => {
    const isPDF = file.type === "application/pdf";
    if (!isPDF) {
      openNotificationWithIcon("error", "File is not a pdf");
    }
    return isPDF;
  },
  onChange({ file, fileList }) {
    if (file.status !== "uploading") {
      console.log(file, fileList);
    }
  },
};

const getFile = (e) => {
  console.log("Upload event:", e);
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

function AttachmentModal({
  getAttachments,
  attachments,
  openModal,
  setOpenModal,
}) {
  const [form] = Form.useForm();

  const handleCancel = () => {
    setOpenModal(false);
  };

  const onFinish = (values) => {
    console.log(values);
    const new_attachment = {
      file: values.document[0].originFileObj,
      subject: values.subject,
    };
    console.log(new_attachment);
    const items = [...attachments, new_attachment];
    getAttachments(items);
    setOpenModal(false);
    setOpenModal(false);
  };

  return (
    <>
      <Modal
        title="Add Attachment"
        visible={openModal}
        onOk={form.submit}
        onCancel={handleCancel}
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
            name="subject"
            label="Subject"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              style={{
                borderRadius: "3px",

                outline: "none",
              }}
            />
          </Form.Item>
          <Form.Item
            labelAlign="left"
            name="document"
            label="Document"
            // wrapperCol={{ ...layout.labelCol, offset: 9 }}
            getValueFromEvent={getFile}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Upload maxCount={1} {...uploadRules}>
              <Button icon={<UploadOutlined />} style={{ width: "275px" }}>
                Upload PDF only
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AttachmentModal;