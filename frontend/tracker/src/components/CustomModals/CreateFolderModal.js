import React from "react";
import { Input, Form, notification } from "antd";
import Modal from "antd/lib/modal/Modal";
import { createFolder } from "../../http/directory";
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

function CreateFolderModal({
  setOpenCreateFolderModal,
  openCreateFolderModal,
  folderId,
  appendSubFolder,
  parentFolder,
  addFolder,
}) {
  const [form] = Form.useForm();
  const [store, dispatch] = useStateValue();

  const handleCancel = () => {
    setOpenCreateFolderModal(false);
  };

  const onFinish = async (values) => {
    try {
      const res = await createFolder(store.token, {
        name: values.name,
        folderId,
      });
      if (addFolder) {
        addFolder([...parentFolder, res.data]);
      } else {
        appendSubFolder({
          ...parentFolder,
          children: [...parentFolder?.children, res.data],
        });
      }
      console.log(res.data);
    } catch (e) {
      notification.error({
        message: "Error",
        description: e.response.data.detail,
      });
    }
    setOpenCreateFolderModal(false);
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
