import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, Role } from '@/types';
import { DEMO_USERS } from '@/utils/mockData';

const initialUser: User = DEMO_USERS.MANAGER; // Default starting user for quick demo

const initialState: AuthState = {
  user: initialUser,
  token: 'mock-initial-token-102',
  isAuthenticated: true,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state, _action: PayloadAction<Role>) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    switchRole: (state, action: PayloadAction<Role>) => {
      const newUser = DEMO_USERS[action.payload] || DEMO_USERS.EMPLOYEE;
      state.user = newUser;
      state.token = `mock-token-${newUser.id}`;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure, switchRole, logout } = authSlice.actions;
export default authSlice.reducer;
