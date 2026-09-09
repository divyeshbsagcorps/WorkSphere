import { apiCall } from './client';
import { User, Role } from '@/types';
import { DEMO_USERS } from '@/utils/mockData';

export const authApi = {
  login: async (role: Role): Promise<{ user: User; token: string }> => {
    return apiCall(() => {
      const user = DEMO_USERS[role] || DEMO_USERS.EMPLOYEE;
      const token = `mock-jwt-token-${user.id}-${Date.now()}`;
      return { user, token };
    }, 300);
  },

  getCurrentUser: async (token: string): Promise<User | null> => {
    return apiCall(() => {
      if (!token) return null;
      return DEMO_USERS.EMPLOYEE;
    }, 200);
  },

  resetPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    return apiCall(() => {
      return {
        success: true,
        message: `Password reset instructions have been sent to ${email}`,
      };
    }, 500);
  },
};
