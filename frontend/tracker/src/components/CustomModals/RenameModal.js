import { Button, Form, Input, Modal, notification } from "antd";
import React, { useEffect, useState } from "react";
import { rename } from "../../http/directory";
import { useStateValue } from "../../store/StateProvider";

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

function RenameModal({ openRenameModal, setOpenRenameModal, selectedRow }) {
  const [store, dispatch] = useStateValue();
  const [submitting, setSubmitting] = useState(false);
  // const [name, setName] = useState()
  const [form] = Form.useForm();

  const handleCancel = () => {
    setOpenRenameModal(false);
  };

  useEffect(() => {
    form.setFieldsValue({
      name:
        selectedRow[0]?.type === "Folder"
          ? selectedRow[0]?.foldername
          : selectedRow[0]?.filename,
    });
  }, [selectedRow, form]);

  const onFinish = async (values) => {
    setSubmitting(true);
    const type = selectedRow[0]?.type;
    let id;
    if (type.toLowerCase() === "folder") {
      id = selectedRow[0]?.name.props.slug;
    }

    if (type.toLowerCase() === "file") {
      id = selectedRow[0]?.name.props.document.id;
    }

    try {
      const data = { name: values.name, type, id: id };
      const res = await rename(store.token, data);
      if (res.status === 200) {
        notification.success({
          message: "Success",
          description: res.data.message,
        });
        setOpenRenameModal(false);
        setSubmitting(false);
      }
    } catch (e) {
      setSubmitting(false);
      notification.error({
        message: "Error",
        description: e.response.data.detail,
      });
    }
  };

  return (
    <>
      <Modal
        title="Rename Folder"
        visible={openRenameModal}
        onOk={form.submit}
        onCancel={handleCancel}
        style={{ top: 20 }}
        confirmLoading={submitting}
        footer={[
          <Button type="primary" onClick={form.submit} key="rename">
            {submitting ? "Renaming..." : "Rename"}
          </Button>,
        ]}
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
            label="New name"
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

export default RenameModal;
