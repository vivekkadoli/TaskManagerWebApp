import { createContext } from 'react';

export type UserType = {
  id: string;
  token: string;
  email: string;
};

export type AuthContextType = {
  user: UserType | null;
  login: (userData: UserType) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);