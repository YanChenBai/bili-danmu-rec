export default function (time: number | null = null) {
  const date = time === null ? new Date() : new Date(time);
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - userTimezoneOffset);
}
