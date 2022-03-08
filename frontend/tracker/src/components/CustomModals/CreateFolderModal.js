import React from "react";
import { Input, Form } from "antd";
import Modal from "antd/lib/modal/Modal";

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

function CreateFolderModal({
  setOpenCreateFolderModal,
  openCreateFolderModal,
}) {
  const [form] = Form.useForm();

  const handleCancel = () => {
    setOpenCreateFolderModal(false);
  };

  const onFinish = (values) => {
    console.log(values);
  };
  return (
    <>
      <Modal
        title="New Folder"
        visible={openCreateFolderModal}
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
            label="Folder Name"
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
        </Form>
      </Modal>
    </>
  );
}

export default CreateFolderModal;
