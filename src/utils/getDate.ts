function getDate(time: number | null = null) {
  const date = time === null ? new Date() : new Date(time);
  if (process.env.DATE === '0') return date;
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - userTimezoneOffset);
}

export default getDate;
