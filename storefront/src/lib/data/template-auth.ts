import { useUI } from '@/hooks/use-UI';
import Cookies from 'js-cookie';
import { useMutation } from '@tanstack/react-query';

export interface LoginInputType {
  email: string;
  password: string;
  remember_me: boolean;
}

interface LoginResponse {
  token: string;
}

export class LoginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LoginError';
  }
}

async function login(input: LoginInputType): Promise<LoginResponse> {
  // Simulate credential validation
  const validCredentials = {
    email: 'guest@demo.com',
    password: 'admin',
  };
  
  if (
      input.email !== validCredentials.email ||
      input.password !== validCredentials.password
  ) {
    throw new LoginError('Login failed. Please check your credentials');
  }
  
  return {
    token: `${input.email}.${input.remember_me}`.split('').reverse().join(''),
  };
}

export const useLoginMutation = () => {
  const { authorize } = useUI();
  return useMutation<LoginResponse, LoginError, LoginInputType>({
    mutationFn: login,
    onSuccess: (data) => {
      Cookies.set('auth_token', data.token, {
        expires: 7,
        secure: true,
        sameSite: 'Strict',
      });
      authorize();
    },
    onError: (error) => {
      if (error instanceof LoginError) {
        console.log('Login error :', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    },
  });
};

export interface SignUpInputType {
  email: string;
  password: string;
  name: string;
  remember_me: boolean;
}

interface SignUpResponse {
  token: string;
}

async function signUp(input: SignUpInputType): Promise<SignUpResponse> {
  return {
    token: `${input.email}.${input.name}`.split('').reverse().join(''),
  };
}

export const useSignUpMutation = () => {
  const { authorize } = useUI();

  return useMutation<SignUpResponse, Error, SignUpInputType>({
    mutationFn: signUp,
    onSuccess: (data) => {
      Cookies.set('auth_token', data.token);
      authorize();
    },
    onError: (error) => {
      console.error('Sign-up error response:', error.message);
    },
  });
};

interface LogoutResponse {
  ok: boolean;
  message: string;
}

async function logout(): Promise<LogoutResponse> {
  return {
    ok: true,
    message: 'Logout Successful!',
  };
}

export const useLogoutMutation = () => {
  const { unauthorize } = useUI();
  return useMutation<LogoutResponse, Error>({
    mutationFn: logout,
    onSuccess: () => {
      Cookies.remove('auth_token');
      unauthorize();
    },
    onError: (error) => {
      console.error('Logout error response:', error.message);
    },
  });
};
