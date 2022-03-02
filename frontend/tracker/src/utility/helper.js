import { notification } from "antd";

// Notifications
export const openNotificationWithIcon = (type, message, description) => {
  notification[type]({
    message,
    description,
  });
};
