import { apiCall } from './client';
import { Employee, EmployeeQuery, PaginatedResult } from '@/types';
import { INITIAL_EMPLOYEES } from '@/utils/mockData';

let employeesDb: Employee[] = [...INITIAL_EMPLOYEES];

export const employeeApi = {
  getEmployees: async (params: EmployeeQuery): Promise<PaginatedResult<Employee>> => {
    return apiCall(() => {
      let filtered = [...employeesDb];

      // Filter by search query (name, email, title, skills)
      if (params.search && params.search.trim()) {
        const query = params.search.toLowerCase().trim();
        filtered = filtered.filter(
          (emp) =>
            emp.name.toLowerCase().includes(query) ||
            emp.email.toLowerCase().includes(query) ||
            emp.title.toLowerCase().includes(query) ||
            emp.department.toLowerCase().includes(query) ||
            emp.skills.some((s) => s.toLowerCase().includes(query))
        );
      }

      // Filter by department
      if (params.department && params.department !== 'All') {
        filtered = filtered.filter((emp) => emp.department === params.department);
      }

      // Filter by status
      if (params.status && params.status !== 'All') {
        filtered = filtered.filter((emp) => emp.status === params.status);
      }

      // Filter by role
      if (params.role && params.role !== 'All') {
        filtered = filtered.filter((emp) => emp.role === params.role);
      }

      // Sorting
      if (params.sortBy) {
        const key = params.sortBy;
        const order = params.sortOrder === 'desc' ? -1 : 1;
        filtered.sort((a, b) => {
          if ((a[key] ?? '') < (b[key] ?? '')) return -1 * order;
          if ((a[key] ?? '') > (b[key] ?? '')) return 1 * order;
          return 0;
        });
      }

      // Pagination
      const page = params.page || 1;
      const limit = params.limit || 5;
      const total = filtered.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const startIndex = (page - 1) * limit;
      const data = filtered.slice(startIndex, startIndex + limit);

      return {
        data,
        total,
        page,
        limit,
        totalPages,
      };
    }, 350);
  },

  getEmployeeById: async (id: number): Promise<Employee | null> => {
    return apiCall(() => {
      return employeesDb.find((e) => e.id === id) || null;
    }, 200);
  },

  createEmployee: async (data: Omit<Employee, 'id'>): Promise<Employee> => {
    return apiCall(() => {
      const newId = Math.max(...employeesDb.map((e) => e.id), 100) + 1;
      const newEmployee: Employee = {
        ...data,
        id: newId,
        avatar: data.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      };
      employeesDb = [newEmployee, ...employeesDb];
      return newEmployee;
    }, 450);
  },

  updateEmployee: async (id: number, data: Partial<Employee>): Promise<Employee> => {
    return apiCall(() => {
      const index = employeesDb.findIndex((e) => e.id === id);
      if (index === -1) throw new Error(`Employee with ID ${id} not found.`);
      const updated = { ...employeesDb[index], ...data };
      employeesDb[index] = updated;
      return updated;
    }, 400);
  },

  deleteEmployee: async (id: number): Promise<{ id: number }> => {
    return apiCall(() => {
      employeesDb = employeesDb.filter((e) => e.id !== id);
      return { id };
    }, 300);
  },
};
