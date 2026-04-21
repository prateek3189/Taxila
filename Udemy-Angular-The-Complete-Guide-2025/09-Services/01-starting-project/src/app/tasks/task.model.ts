import { InjectionToken } from '@angular/core';

export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

export type TaskStatusOption = {
  value: 'open' | 'in-progress' | 'done';
  taskStatus: TaskStatus;
  label: string;
};

export const TASK_OPTIONS_TOKEN = new InjectionToken<TaskStatusOption[]>(
  'task-status-options',
);

export const TASK_OPTIONS = [
  { value: 'open', taskStatus: 'OPEN', label: 'Open' },
  { value: 'in-progress', taskStatus: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'done', taskStatus: 'DONE', label: 'Done' },
];

export const TASK_OPTIONS_PROVIDER = {
  provide: TASK_OPTIONS_TOKEN,
  useValue: TASK_OPTIONS,
};
