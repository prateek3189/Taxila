import { Injectable, inject, signal } from '@angular/core';
import { Task, TaskStatus } from './task.model';
import { LoggingService } from '../logging.service';

// @Injectable({
//   providedIn: 'root',
// })
export class TasksService {
  private tasks = signal<Task[]>([]);
  private logService = inject(LoggingService);

  allTasks = this.tasks.asReadonly();

  addTask(taskData: { title: string; description: string }) {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(),
      status: 'OPEN',
    };
    this.logService.log(' Added task ' + taskData.title);
    this.tasks.update((oldTask) => [...oldTask, newTask]);
  }

  updateTaskStatus(id: string, status: TaskStatus) {
    this.tasks.update((oldTasks) =>
      oldTasks.map((task) => (task.id === id ? { ...task, status } : task))
    );
    this.logService.log(
      ' Updated task with ID' + id + ' with status ' + status
    );
  }
}
