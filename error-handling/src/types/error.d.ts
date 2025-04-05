type AppError = Error & {
  code: number;
  message: string;
};
