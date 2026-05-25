import { Response } from 'express';
import { ApiResponse } from './types';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200
) => {
  const response: ApiResponse<T> = {
    status: 'success',
    message,
    data,
    timestamp: new Date(),
  };
  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 400,
  code?: string
) => {
  const response: ApiResponse = {
    status: 'error',
    message,
    timestamp: new Date(),
  };
  if (code) {
    (response as any).code = code;
  }
  res.status(statusCode).json(response);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};
