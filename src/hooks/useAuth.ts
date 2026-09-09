import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { loginRequest, switchRole, logout } from '@/features/auth/authSlice';
import { Role } from '@/types';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isAuthenticated, isLoading, error } = useSelector((state: RootState) => state.auth);

  const login = (role: Role) => {
    dispatch(loginRequest(role));
  };

  const setRole = (role: Role) => {
    dispatch(switchRole(role));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    user,
    token,
    role: user?.role,
    isAuthenticated,
    isLoading,
    error,
    login,
    switchRole: setRole,
    logout: handleLogout,
  };
};
