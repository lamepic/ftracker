import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, notification, Upload } from "antd";
import React, { useState } from "react";
import { addSignatureStamp } from "../../http/document";
import { useStateValue } from "../../store/StateProvider";
import { capitalize, uploadRules } from "../../utility/helper";

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

function SignatureStampModal({
  openSignatureStampModal,
  setOpenSignatureStampModal,
  type,
  document_id,
  setStamps,
  setSignatures,
}) {
  const [form] = Form.useForm();
  const [store] = useStateValue();
  const [submitting, setSubmitting] = useState(false);

  const handleCancel = () => {
    setOpenSignatureStampModal(false);
  };

  const onFinish = async (values) => {
    const data = {
      type,
      document_id,
    };
    if (values.signature) {
      data.content = values.signature[0].originFileObj;
    }
    if (values.stamp) {
      data.content = values.stamp[0].originFileObj;
    }

    try {
      const res = await addSignatureStamp(store.token, data);
      const resData = res.data;
      if (resData.type === "signature") {
        setSignatures(resData.data);
      }
      if (resData.type === "stamp") {
        setStamps(resData.data);
      }
      setOpenSignatureStampModal(false);
    } catch (e) {
      console.log(e);
      return notification.error({
        message: "Error",
        description: e.response.data.detail,
      });
    }
  };

  return (
    <>
      <Modal
        title={`Add ${capitalize(type)}`}
        visible={openSignatureStampModal}
        onOk={form.submit}
        onCancel={handleCancel}
        style={{ top: 20 }}
        confirmLoading={submitting}
        footer={[
          <Button type="primary" onClick={form.submit} key="rename">
            {submitting ? "Submitting..." : "Submit"}
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
            name={type}
            label={capitalize(type)}
            wrapperCol={{ ...layout.wrapperCol }}
            getValueFromEvent={getFile}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Upload maxCount={1} customRequest={dummyRequest} {...uploadRules}>
              <Button icon={<UploadOutlined />} style={{ width: "285px" }}>
                Upload
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default SignatureStampModal;
