export const modify_notification_number = (number: string) => {
  const noti_info = parseInt(number, 10);
  if (noti_info >= 10) {
    return '9+';
  } else {
    return noti_info;
  }
};
