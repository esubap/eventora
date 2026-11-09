// ==============================================================================
// AUTHENTICATION SERVICE
// Full Supabase Auth + Resilient Local Auth with Email OTP & Session Persistence
// ==============================================================================

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { storage } from '../lib/storage';
import { UserProfile, UserRole } from '../types';

interface RegisterParams {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
  organizationName?: string;
}

interface LoginParams {
  email: string;
  password: string;
}

// Memory store for active OTP codes in transit
const activeOtps: Record<string, { code: string; expiresAt: number; email: string }> = {};

export const authService = {
  // 1. Get Current Active User
  async getCurrentUser(): Promise<UserProfile | null> {
    if (isSupabaseConfigured && supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      // Fetch profile from supabase profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) return profile as UserProfile;
    }

    return storage.getCurrentUser();
  },

  // 2. Register New User
  async register(params: RegisterParams): Promise<{ success: boolean; requiresOtp: boolean; message: string; tempUserId?: string }> {
    const existing = storage.getUserByEmail(params.email);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
          data: {
            full_name: params.fullName,
            phone: params.phone || '',
            role: params.role,
            organization_name: params.organizationName || ''
          }
        }
      });

      if (error) throw error;
      return {
        success: true,
        requiresOtp: true,
        message: 'Registration successful! Please check your email for the verification code.',
        tempUserId: data.user?.id
      };
    }

    // Local / Resilient Mode: Create user profile & generate 6-digit OTP
    const newId = `usr-${Date.now().toString(36)}`;
    const newProfile: UserProfile = {
      id: newId,
      email: params.email.toLowerCase(),
      full_name: params.fullName,
      phone: params.phone,
      role: params.role,
      status: 'active',
      organization_name: params.organizationName,
      created_at: new Date().toISOString()
    };

    storage.addUser(newProfile);

    // Send 6-digit OTP
    await this.sendEmailOtp(params.email);

    return {
      success: true,
      requiresOtp: true,
      message: 'Account created! Enter the 6-digit OTP verification code sent to your email.',
      tempUserId: newId
    };
  },

  // 3. Send Email OTP
  async sendEmailOtp(email: string): Promise<{ success: boolean; demoCode?: string }> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    activeOtps[email.toLowerCase()] = { code, expiresAt, email };

    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signInWithOtp({ email });
    } else {
      console.info(`%c[EVENTORA OTP SIMULATOR] Code for ${email} is: ${code}`, 'color: #06B6D4; font-weight: bold;');
    }

    return { success: true, demoCode: code };
  },

  // 4. Verify OTP Code
  async verifyOtp(email: string, token: string): Promise<UserProfile> {
    const normalizedEmail = email.toLowerCase();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.verifyOtp({
        email: normalizedEmail,
        token,
        type: 'signup'
      });
      if (error) throw error;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user?.id)
        .single();

      if (profile) {
        storage.setCurrentUser(profile as UserProfile);
        return profile as UserProfile;
      }
    }

    // Local Mode: Validate against stored OTP or master test code
    const stored = activeOtps[normalizedEmail];
    const isMasterCode = token === '123456';
    const isMatch = stored && stored.code === token && stored.expiresAt > Date.now();

    if (!isMatch && !isMasterCode) {
      throw new Error('Invalid or expired verification code. Please check your code or request a new one.');
    }

    const user = storage.getUserByEmail(normalizedEmail);
    if (!user) throw new Error('User account not found.');

    storage.setCurrentUser(user);
    delete activeOtps[normalizedEmail];
    return user;
  },

  // 5. Login
  async login({ email, password }: LoginParams): Promise<UserProfile> {
    const normalizedEmail = email.toLowerCase().trim();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password
      });
      if (error) throw error;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user?.id)
        .single();

      if (profile) {
        if (profile.status === 'suspended') {
          await supabase.auth.signOut();
          throw new Error('Your account has been suspended by an administrator. Please contact support.');
        }
        storage.setCurrentUser(profile as UserProfile);
        return profile as UserProfile;
      }
    }

    // Local / Resilient Mode
    const user = storage.getUserByEmail(normalizedEmail);
    if (!user) {
      throw new Error('No account found with this email. Please check your credentials or register.');
    }

    if (user.status === 'suspended') {
      throw new Error('This account has been suspended by an administrator. Please contact support.');
    }

    storage.setCurrentUser(user);
    return user;
  },

  // 6. Logout
  async logout(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    storage.setCurrentUser(null);
  },

  // 7. Forgot Password
  async forgotPassword(email: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    }
    await this.sendEmailOtp(email);
    return true;
  },

  // 8. Update Profile
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      if (error) throw error;
      if (data) {
        storage.setCurrentUser(data as UserProfile);
        return data as UserProfile;
      }
    }

    const updated = storage.updateUser(userId, updates);
    if (!updated) throw new Error('User not found');
    return updated;
  },

  // 9. Quick Switch Demo User (For testing Customer, Organizer, and Admin roles instantly)
  switchDemoUser(role: UserRole): UserProfile {
    const users = storage.getUsers();
    const target = users.find(u => u.role === role);
    if (!target) throw new Error(`No user with role ${role} found`);
    storage.setCurrentUser(target);
    return target;
  }
};
