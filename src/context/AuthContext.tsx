import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, verifyAdminStatus } from '../lib/firebase.ts';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  adminError: string | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAdmin: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [adminError, setAdminError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const authorized = await verifyAdminStatus(currentUser);
          setIsAdmin(authorized);
          if (!authorized) {
            setAdminError('Your account does not have administrator privileges.');
          } else {
            setAdminError(null);
          }
        } catch (err: any) {
          console.error('Admin status verification failed:', err);
          setIsAdmin(false);
          setAdminError(err.message || 'Authorization check failed.');
        }
      } else {
        setIsAdmin(false);
        setAdminError(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    setAdminError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const authorized = await verifyAdminStatus(cred.user);
      setIsAdmin(authorized);
      if (!authorized) {
        setAdminError('Access restricted: Account is not on the admin allowlist.');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
    setAdminError(null);
  };

  const checkAdmin = async (): Promise<boolean> => {
    if (!user) return false;
    const authorized = await verifyAdminStatus(user);
    setIsAdmin(authorized);
    return authorized;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        adminError,
        login,
        logout,
        checkAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

