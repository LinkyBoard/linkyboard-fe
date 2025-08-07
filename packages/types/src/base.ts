export interface BaseResponseDTO<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}
