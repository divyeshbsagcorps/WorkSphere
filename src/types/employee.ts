import { Role } from './auth';

export type EmployeeStatus = 'Active' | 'On Leave' | 'Inactive';
export type Department = 'Engineering' | 'HR' | 'Finance' | 'Design' | 'Product' | 'Marketing';

export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: Department;
  title: string;
  role: Role;
  status: EmployeeStatus;
  startDate: string;
  experienceYears: number;
  skills: string[];
  managerName?: string;
  location: string;
  bio?: string;
  avatar: string;
}

export interface EmployeeQuery {
  search?: string;
  department?: string;
  status?: string;
  role?: string;
  page: number;
  limit: number;
  sortBy?: keyof Employee;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EmployeeState {
  employees: Employee[];
  selectedEmployee: Employee | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    department: string;
    status: string;
    role: string;
  };
}
