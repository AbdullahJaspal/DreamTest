import {DateTime} from 'luxon';

const formattedDateAndTime = (date: string): string => {
  const inputDate = DateTime.fromISO(date);
  return inputDate.toFormat("dd-LL-yyyy 'at' HH:mm");
};

const formatDateAndTimeForVideo = (date: string): string => {
  const inputDate = DateTime.fromISO(date);
  return inputDate.toFormat('HH:mm d-MMM-yyyy');
};

const formatDateOnly = (date: string | Date): string => {
  let inputDate: DateTime;
  if (typeof date === 'string') {
    inputDate = DateTime.fromISO(date);
  } else {
    inputDate = DateTime.fromJSDate(date);
  }
  return inputDate.isValid ? inputDate.toFormat('d-MMM-yyyy') : 'Invalid Date';
};

export {formattedDateAndTime, formatDateAndTimeForVideo, formatDateOnly};
