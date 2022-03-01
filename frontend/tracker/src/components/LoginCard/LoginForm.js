import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import { Form, Input } from "antd";
import { login } from "../../http/auth";
import { notification } from "antd";
import { useStateValue } from "../../store/StateProvider";
import * as actionTypes from "../../store/actionTypes";

const openNotificationWithIcon = (type, description) => {
  notification[type]({
    message: "Error",
    description,
  });
};

function LoginForm({ verifiedEmail }) {
  const [_, dispatch] = useStateValue();

  const onFinish = (values) => {
    const token = values.token;
    loginUser(verifiedEmail, token);
  };

  const loginUser = async (email, token) => {
    try {
      const res = await login(email, token);
      dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        payload: res.data,
      });
    } catch (e) {
      dispatch({
        type: actionTypes.LOGIN_FAIL,
      });
      openNotificationWithIcon("error", e.response.data.token[0]);
    }
  };

  return (
    <div>
      <Box marginTop="15px">
        <Form name="normal_login" className="login-form" onFinish={onFinish}>
          <Form.Item
            name="token"
            rules={[
              {
                required: true,
                message: "Please input token",
              },
            ]}
          >
            <Input
              placeholder="Enter Token"
              style={{
                borderRadius: "5px",
                width: "90%",
                outlineColor: "var(--light-brown)",
              }}
            />
          </Form.Item>
          <Form.Item>
            <button type="submit" className="login__btn">
              Login
            </button>
          </Form.Item>
        </Form>
      </Box>
    </div>
  );
}

export default LoginForm;
