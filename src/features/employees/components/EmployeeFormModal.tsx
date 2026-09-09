import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store';
import { createEmployeeRequest } from '@/features/employees/employeeSlice';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';
import { Department, EmployeeStatus, Role } from '@/types';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const validationSchema = Yup.object({
  name: Yup.string().min(2, 'Name must be at least 2 characters').required('Full name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  department: Yup.string().required('Department is required'),
  title: Yup.string().required('Job title is required'),
  role: Yup.string().required('Role is required'),
  status: Yup.string().required('Status is required'),
  startDate: Yup.string().required('Start date is required'),
  experienceYears: Yup.number().min(0, 'Must be positive').required('Experience years required'),
  location: Yup.string().required('Location is required'),
});

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      department: 'Engineering' as Department,
      title: '',
      role: 'EMPLOYEE' as Role,
      status: 'Active' as EmployeeStatus,
      startDate: new Date().toISOString().substring(0, 10),
      experienceYears: 3,
      skills: 'React, TypeScript, Node.js',
      location: 'San Francisco, CA',
      bio: '',
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(
        createEmployeeRequest({
          ...values,
          experienceYears: Number(values.experienceYears),
          skills: values.skills.split(',').map((s) => s.trim()),
          avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        })
      );
      formik.resetForm();
      onClose();
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Employee" subtitle="Create enterprise workforce record" maxWidth="lg">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            name="name"
            placeholder="John Doe"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && formik.errors.name ? formik.errors.name : undefined}
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="john.doe@worksphere.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            name="phone"
            placeholder="+1 (555) 000-0000"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && formik.errors.phone ? formik.errors.phone : undefined}
          />

          <Input
            label="Job Title"
            name="title"
            placeholder="Senior Software Engineer"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && formik.errors.title ? formik.errors.title : undefined}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Department"
            name="department"
            value={formik.values.department}
            options={['Engineering', 'HR', 'Finance', 'Design', 'Product', 'Marketing']}
            onChange={formik.handleChange}
          />

          <Select
            label="Role"
            name="role"
            value={formik.values.role}
            options={['EMPLOYEE', 'MANAGER', 'HR_ADMIN']}
            onChange={formik.handleChange}
          />

          <Select
            label="Status"
            name="status"
            value={formik.values.status}
            options={['Active', 'On Leave', 'Inactive']}
            onChange={formik.handleChange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Start Date"
            name="startDate"
            type="date"
            value={formik.values.startDate}
            onChange={formik.handleChange}
            error={formik.touched.startDate && formik.errors.startDate ? formik.errors.startDate : undefined}
          />

          <Input
            label="Experience (Years)"
            name="experienceYears"
            type="number"
            value={formik.values.experienceYears}
            onChange={formik.handleChange}
            error={formik.touched.experienceYears && formik.errors.experienceYears ? formik.errors.experienceYears : undefined}
          />

          <Input
            label="Office Location"
            name="location"
            placeholder="San Francisco, CA"
            value={formik.values.location}
            onChange={formik.handleChange}
            error={formik.touched.location && formik.errors.location ? formik.errors.location : undefined}
          />
        </div>

        <Input
          label="Skills (Comma-separated)"
          name="skills"
          placeholder="React, TypeScript, Redux, PostgreSQL"
          value={formik.values.skills}
          onChange={formik.handleChange}
        />

        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create Employee
          </Button>
        </div>
      </form>
    </Modal>
  );
};
