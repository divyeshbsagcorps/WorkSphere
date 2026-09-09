import { describe, it, expect } from 'vitest';
import authReducer, { loginSuccess, switchRole, logout } from '@/features/auth/authSlice';
import { DEMO_USERS } from '@/utils/mockData';

describe('Auth Reducer & State Management', () => {
  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };

  it('should handle loginSuccess correctly', () => {
    const user = DEMO_USERS.EMPLOYEE;
    const nextState = authReducer(initialState, loginSuccess({ user, token: 'test-token' }));

    expect(nextState.isAuthenticated).toBe(true);
    expect(nextState.user?.name).toBe('Alex Rivera');
    expect(nextState.token).toBe('test-token');
  });

  it('should switch roles dynamically for recruiter testing', () => {
    const stateWithEmp = authReducer(initialState, loginSuccess({ user: DEMO_USERS.EMPLOYEE, token: 't1' }));
    const switchedState = authReducer(stateWithEmp, switchRole('HR_ADMIN'));

    expect(switchedState.user?.role).toBe('HR_ADMIN');
    expect(switchedState.user?.name).toBe('Michael Vance');
  });

  it('should clear authentication state on logout', () => {
    const loggedInState = authReducer(initialState, loginSuccess({ user: DEMO_USERS.MANAGER, token: 't2' }));
    const loggedOutState = authReducer(loggedInState, logout());

    expect(loggedOutState.isAuthenticated).toBe(false);
    expect(loggedOutState.user).toBeNull();
    expect(loggedOutState.token).toBeNull();
  });
});
