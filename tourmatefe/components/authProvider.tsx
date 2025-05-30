'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getUserRole } from '@/components/getToken';

interface AuthContextType {
  token: string | null;
  role: string | null;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  role: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem('accessToken');
    if (storedToken) {
      setToken(storedToken);
      const userRole = getUserRole(storedToken);
      setRole(userRole);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
