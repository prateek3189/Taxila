import { InjectionToken } from '@angular/core';

export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}
type TaskStatusOptionTypes = {
  value: 'open' | 'in-progress' | 'done';
  text: string;
  taskStatus: string;
};

export const TASK_STATUS_OPTIONS = new InjectionToken<TaskStatusOptionTypes>(
  'task-status-options-token'
);

export const TaskStatusOptions: TaskStatusOptionTypes[] = [
  {
    value: 'open',
    taskStatus: 'OPEN',
    text: 'Open',
  },
  {
    value: 'in-progress',
    taskStatus: 'IN_PROGRESS',
    text: 'In Progress',
  },
  {
    value: 'done',
    taskStatus: 'DONE',
    text: 'Completed',
  },
];

export const taskStatusOptionProvider = {
  provide: TASK_STATUS_OPTIONS,
  useValue: TaskStatusOptions,
};
