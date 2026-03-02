import { apiFetch, setAuthToken } from './base';
import { User } from '../types';

interface AuthResponse {
  token: string;
  user: User;
}

export const login = async (email: string, password: string): Promise<User> => {
  const data = await apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setAuthToken(data.token);
  return data.user;
};

export const register = async (payload: { name: string; username: string; email: string; password: string }): Promise<User> => {
  const data = await apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  setAuthToken(data.token);
  return data.user;
};

export const getMe = async (): Promise<User> => {
  return apiFetch<User>('/auth/me');
};

export const getUsers = async (): Promise<User[]> => {
  return apiFetch<User[]>('/users');
};
