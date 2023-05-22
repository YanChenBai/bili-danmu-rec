export class Response<T = null> {
  code: number;
  message: string;
  data: T = null;
}

export function Success<T = any>(data: T, message = '') {
  return {
    code: 200,
    message,
    data,
  };
}
