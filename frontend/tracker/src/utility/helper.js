import { notification } from "antd";

// Notifications
export const openNotificationWithIcon = (type, message, description) => {
  notification[type]({
    message,
    description,
  });
};

export const capitalize = (str) => {
  return str
    .split(" ")
    .map((text) => text.charAt(0).toUpperCase() + text.slice(1))
    .join(" ");
};
