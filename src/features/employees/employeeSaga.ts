import { call, put, takeLatest, debounce } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { employeeApi } from '@/api/employeeApi';
import {
  fetchEmployeesRequest,
  fetchEmployeesSuccess,
  fetchEmployeesFailure,
  fetchEmployeeByIdRequest,
  fetchEmployeeByIdSuccess,
  createEmployeeRequest,
  createEmployeeSuccess,
  updateEmployeeRequest,
  updateEmployeeSuccess,
  deleteEmployeeRequest,
  deleteEmployeeSuccess,
} from './employeeSlice';
import { EmployeeQuery, Employee, PaginatedResult } from '@/types';

function* handleFetchEmployees(action: PayloadAction<EmployeeQuery>): Generator {
  try {
    const result = (yield call(employeeApi.getEmployees, action.payload)) as PaginatedResult<Employee>;
    yield put(fetchEmployeesSuccess(result));
  } catch (err: any) {
    yield put(fetchEmployeesFailure(err.message || 'Failed to fetch employees'));
  }
}

function* handleFetchEmployeeById(action: PayloadAction<number>): Generator {
  try {
    const employee = (yield call(employeeApi.getEmployeeById, action.payload)) as Employee | null;
    yield put(fetchEmployeeByIdSuccess(employee));
  } catch (err: any) {
    yield put(fetchEmployeesFailure(err.message || 'Failed to fetch employee details'));
  }
}

function* handleCreateEmployee(action: PayloadAction<Omit<Employee, 'id'>>): Generator {
  try {
    const newEmployee = (yield call(employeeApi.createEmployee, action.payload)) as Employee;
    yield put(createEmployeeSuccess(newEmployee));
  } catch (err: any) {
    yield put(fetchEmployeesFailure(err.message || 'Failed to create employee'));
  }
}

function* handleUpdateEmployee(action: PayloadAction<{ id: number; data: Partial<Employee> }>): Generator {
  try {
    const updated = (yield call(employeeApi.updateEmployee, action.payload.id, action.payload.data)) as Employee;
    yield put(updateEmployeeSuccess(updated));
  } catch (err: any) {
    yield put(fetchEmployeesFailure(err.message || 'Failed to update employee'));
  }
}

function* handleDeleteEmployee(action: PayloadAction<number>): Generator {
  try {
    const res = (yield call(employeeApi.deleteEmployee, action.payload)) as { id: number };
    yield put(deleteEmployeeSuccess(res.id));
  } catch (err: any) {
    yield put(fetchEmployeesFailure(err.message || 'Failed to delete employee'));
  }
}

export function* employeeSaga() {
  // Use debounce for fetchEmployeesRequest to prevent spamming search queries!
  yield debounce(400, fetchEmployeesRequest.type, handleFetchEmployees);
  yield takeLatest(fetchEmployeeByIdRequest.type, handleFetchEmployeeById);
  yield takeLatest(createEmployeeRequest.type, handleCreateEmployee);
  yield takeLatest(updateEmployeeRequest.type, handleUpdateEmployee);
  yield takeLatest(deleteEmployeeRequest.type, handleDeleteEmployee);
}
