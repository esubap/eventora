import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserProfile, UserRole } from '../types';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (params: { email: string; password: string }) => Promise<void>;
  register: (params: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    role: UserRole;
    organizationName?: string;
  }) => Promise<{ requiresOtp: boolean; tempUserId?: string }>;
  verifyOtp: (email: string, token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  switchDemoRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const toast = useToast();

  const refreshUser = useCallback(async () => {
    try {
      const current = await authService.getCurrentUser();
      setUser(current);
    } catch (err) {
      console.error('Error fetching current user:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();

    // Listen to storage changes for reactive multi-tab and demo switches
    const handleAuthChange = () => {
      refreshUser();
    };

    window.addEventListener('eventora:auth-changed', handleAuthChange);
    return () => {
      window.removeEventListener('eventora:auth-changed', handleAuthChange);
    };
  }, [refreshUser]);

  const login = async (params: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const loggedUser = await authService.login(params);
      setUser(loggedUser);
      toast.success(`Welcome back, ${loggedUser.full_name}!`, 'Signed In');
    } catch (err: any) {
      toast.error(err.message || 'Failed to sign in', 'Authentication Error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (params: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    role: UserRole;
    organizationName?: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await authService.register(params);
      toast.info(res.message, 'Verification Code Sent');
      return res;
    } catch (err: any) {
      toast.error(err.message || 'Registration failed', 'Registration Error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (email: string, token: string) => {
    setIsLoading(true);
    try {
      const verifiedUser = await authService.verifyOtp(email, token);
      setUser(verifiedUser);
      toast.success('Your account is now verified and active!', 'Email Verified');
    } catch (err: any) {
      toast.error(err.message || 'Invalid OTP code', 'Verification Failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      toast.info('You have been logged out securely.', 'Signed Out');
    } catch (err: any) {
      toast.error('Logout error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const updated = await authService.updateProfile(user.id, updates);
      setUser(updated);
      toast.success('Your profile changes have been saved.', 'Profile Updated');
    } catch (err: any) {
      toast.error(err.message || 'Could not update profile');
      throw err;
    }
  };

  const switchDemoRole = (targetRole: UserRole) => {
    try {
      const demoUser = authService.switchDemoUser(targetRole);
      setUser(demoUser);
      toast.success(`Switched active view to demo ${targetRole.toUpperCase()}: ${demoUser.full_name}`, 'Role Switched');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        verifyOtp,
        logout,
        updateProfile,
        switchDemoRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
