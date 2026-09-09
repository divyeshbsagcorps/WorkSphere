import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { fetchEmployeesRequest, setFilters, deleteEmployeeRequest } from '@/features/employees/employeeSlice';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useDebounce } from '@/hooks/useDebounce';
import { useModal } from '@/hooks/useModal';
import { Table, Column } from '@/components/common/Table';
import { Pagination } from '@/components/common/Pagination';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Modal } from '@/components/common/Modal';
import { Employee } from '@/types';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, Trash2, Eye, RefreshCw } from 'lucide-react';
import { EmployeeFormModal } from '../components/EmployeeFormModal';

export const EmployeeList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { queryParams, setMultipleQueryParams } = useQueryParams();

  const { employees, total, page, limit, totalPages, isLoading, filters } = useSelector(
    (state: RootState) => state.employees
  );

  const [searchTerm, setSearchTerm] = useState(queryParams.search || filters.search || '');
  const debouncedSearch = useDebounce(searchTerm, 400);

  const addModal = useModal();
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

  useEffect(() => {
    const dept = queryParams.department || 'All';
    const stat = queryParams.status || 'All';
    const rol = queryParams.role || 'All';
    const pg = Number(queryParams.page) || 1;

    dispatch(
      setFilters({
        search: debouncedSearch,
        department: dept,
        status: stat,
        role: rol,
      })
    );

    dispatch(
      fetchEmployeesRequest({
        search: debouncedSearch,
        department: dept,
        status: stat,
        role: rol,
        page: pg,
        limit,
      })
    );
  }, [dispatch, debouncedSearch, queryParams.department, queryParams.status, queryParams.role, queryParams.page, limit]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    setMultipleQueryParams({ search: val, page: '1' });
  };

  const handleFilterChange = (key: string, value: string) => {
    setMultipleQueryParams({ [key]: value, page: '1' });
  };

  const handlePageChange = (newPage: number) => {
    setMultipleQueryParams({ page: String(newPage) });
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      dispatch(deleteEmployeeRequest(deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const columns: Column<Employee>[] = [
    {
      header: 'Employee Name & Contact',
      cell: (emp) => (
        <div className="flex items-center space-x-3">
          <img
            src={emp.avatar}
            alt={emp.name}
            className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs"
          />
          <div>
            <p className="text-sm font-bold text-slate-900 m-0">{emp.name}</p>
            <p className="text-xs text-slate-500 m-0">{emp.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Department',
      cell: (emp) => (
        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
          {emp.department}
        </span>
      ),
    },
    {
      header: 'Job Title & Role',
      cell: (emp) => (
        <div>
          <p className="text-xs font-semibold text-slate-800 m-0">{emp.title}</p>
          <Badge variant="role">{emp.role}</Badge>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (emp) => (
        <Badge
          variant={
            emp.status === 'Active' ? 'active' : emp.status === 'On Leave' ? 'leave' : 'inactive'
          }
        >
          {emp.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      className: 'text-end',
      cell: (emp) => (
        <div className="flex items-center justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => navigate(`/employees/${emp.id}`)}
            className="btn btn-sm btn-link text-slate-400 hover:text-indigo-600 p-1.5"
            title="View Employee Profile"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(emp)}
            className="btn btn-sm btn-link text-slate-400 hover:text-rose-600 p-1.5"
            title="Delete Employee"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Employee Directory</h2>
          <p className="text-xs text-slate-500 mt-1 m-0">
            Search, filter, and manage enterprise workforce records with debounced search & URL state synchronization
          </p>
        </div>
        <Button variant="primary" icon={<UserPlus className="w-4 h-4" />} onClick={addModal.openModal}>
          Add New Employee
        </Button>
      </div>

      {/* Toolbar */}
      <div className="saas-card p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-100">
          <Input
            placeholder="Search by name, email, title, or skills... (Debounced Saga)"
            icon={<Search className="w-4 h-4" />}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-100 md:w-auto">
          <div className="w-36">
            <Select
              value={queryParams.department || 'All'}
              options={['All', 'Engineering', 'HR', 'Finance', 'Design', 'Product', 'Marketing']}
              onChange={(e) => handleFilterChange('department', e.target.value)}
            />
          </div>

          <div className="w-32">
            <Select
              value={queryParams.status || 'All'}
              options={['All', 'Active', 'On Leave', 'Inactive']}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            />
          </div>

          <div className="w-32">
            <Select
              value={queryParams.role || 'All'}
              options={['All', 'EMPLOYEE', 'MANAGER', 'HR_ADMIN']}
              onChange={(e) => handleFilterChange('role', e.target.value)}
            />
          </div>

          <button
            onClick={() => setMultipleQueryParams({ search: '', department: 'All', status: 'All', role: 'All', page: '1' })}
            className="btn btn-outline-secondary btn-sm p-2 text-slate-500"
            title="Reset Filters"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="saas-card overflow-hidden">
        <Table
          columns={columns}
          data={employees}
          keyExtractor={(e) => e.id}
          isLoading={isLoading}
          emptyMessage="No employees match your filter criteria."
          onRowClick={(emp) => navigate(`/employees/${emp.id}`)}
        />
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={total}
          itemsPerPage={limit}
          onPageChange={handlePageChange}
        />
      </div>

      <EmployeeFormModal isOpen={addModal.isOpen} onClose={addModal.closeModal} />

      {deleteTarget && (
        <Modal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="Delete Employee Record"
          subtitle="This action cannot be undone"
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs text-slate-600">
            <p className="m-0">
              Are you sure you want to permanently delete{' '}
              <strong className="text-slate-900">{deleteTarget.name}</strong> ({deleteTarget.email})?
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleDeleteConfirm}>
                Confirm Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
