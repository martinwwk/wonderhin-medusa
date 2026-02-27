"use client";

import { useMutation } from '@tanstack/react-query';

export interface ChangePasswordInputType {
  newPassword: string;
  oldPassword: string;
}

interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

async function changePassword(): Promise<ChangePasswordResponse> {
  return {
    success: true,
    message: 'Password changed successfully!',
  };
}

export const useChangePasswordMutation = () => {
  return useMutation<ChangePasswordResponse, Error, ChangePasswordInputType>({
    mutationFn: changePassword,
    onSuccess: (data) => {
      console.log('ChangePassword success response:', data);
    },
    onError: (error) => {
      console.error('ChangePassword error response:', error.message);
    },
  });
};

export interface UpdateUserType {
  userName: string;
  addess: string;
  date: string;
  phoneNumber: string;
  email: string;
  gender: string;
  message: string;
  default: boolean;
}

async function updateUser(input: UpdateUserType) {
  return input;
}

export const useUpdateUserMutation = () => {
  return useMutation({
    mutationFn: (input: UpdateUserType) => updateUser(input),
    onSuccess: (data) => {
      console.log(data, 'UpdateUser success response');
    },
    onError: (data) => {
      console.log(data, 'UpdateUser error response');
    },
  });
};
