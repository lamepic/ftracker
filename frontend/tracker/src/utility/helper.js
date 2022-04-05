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

export function getFolderDifference(array1, array2) {
  return array1.filter((object1) => {
    return !array2.some((object2) => {
      return object1.slug === object2.name.props.slug;
    });
  });
}
