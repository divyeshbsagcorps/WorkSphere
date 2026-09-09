import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EmployeeState, Employee, EmployeeQuery, PaginatedResult } from '@/types';

const initialState: EmployeeState = {
  employees: [],
  selectedEmployee: null,
  total: 0,
  page: 1,
  limit: 5,
  totalPages: 1,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    department: 'All',
    status: 'All',
    role: 'All',
  },
};

export const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    fetchEmployeesRequest: (state, _action: PayloadAction<EmployeeQuery>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchEmployeesSuccess: (state, action: PayloadAction<PaginatedResult<Employee>>) => {
      state.isLoading = false;
      state.employees = action.payload.data;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.totalPages = action.payload.totalPages;
    },
    fetchEmployeesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchEmployeeByIdRequest: (state, _action: PayloadAction<number>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchEmployeeByIdSuccess: (state, action: PayloadAction<Employee | null>) => {
      state.isLoading = false;
      state.selectedEmployee = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<EmployeeState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1; // Reset to first page on filter change
    },
    createEmployeeRequest: (state, _action: PayloadAction<Omit<Employee, 'id'>>) => {
      state.isLoading = true;
    },
    createEmployeeSuccess: (state, action: PayloadAction<Employee>) => {
      state.isLoading = false;
      state.employees.unshift(action.payload);
      state.total += 1;
    },
    updateEmployeeRequest: (state, _action: PayloadAction<{ id: number; data: Partial<Employee> }>) => {
      state.isLoading = true;
    },
    updateEmployeeSuccess: (state, action: PayloadAction<Employee>) => {
      state.isLoading = false;
      state.employees = state.employees.map((e) => (e.id === action.payload.id ? action.payload : e));
      if (state.selectedEmployee?.id === action.payload.id) {
        state.selectedEmployee = action.payload;
      }
    },
    deleteEmployeeRequest: (state, _action: PayloadAction<number>) => {
      state.isLoading = true;
    },
    deleteEmployeeSuccess: (state, action: PayloadAction<number>) => {
      state.isLoading = false;
      state.employees = state.employees.filter((e) => e.id !== action.payload);
      state.total -= 1;
    },
  },
});

export const {
  fetchEmployeesRequest,
  fetchEmployeesSuccess,
  fetchEmployeesFailure,
  fetchEmployeeByIdRequest,
  fetchEmployeeByIdSuccess,
  setFilters,
  createEmployeeRequest,
  createEmployeeSuccess,
  updateEmployeeRequest,
  updateEmployeeSuccess,
  deleteEmployeeRequest,
  deleteEmployeeSuccess,
} = employeeSlice.actions;

export default employeeSlice.reducer;
