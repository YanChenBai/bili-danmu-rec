import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
type DateType = string | number | dayjs.Dayjs | Date;
export const getDay = (d?: DateType) => dayjs(d).utc(true);
export const getString = (d?: DateType) =>
  getDay(d).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
export const today = () => getDay().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
