interface ApiError {
  response?: {
    data?: {
      msg?: string;
    };
  };
}


interface ChangePasswordResponse {
  msg: string;
  // ... có thể có thêm các trường khác
}
