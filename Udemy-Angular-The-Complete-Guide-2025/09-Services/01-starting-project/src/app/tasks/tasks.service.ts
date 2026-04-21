import { inject, Injectable, signal } from '@angular/core';
import { Task, TaskStatus } from './task.model';
import { LoggingService } from '../logging.service';

// @Injectable({
//   providedIn: 'root',
// })
export class TasksService {
  private tasks = signal<Task[]>([]);
  private loggingService = inject(LoggingService);

  allTasks = this.tasks.asReadonly();

  addTask(task: { title: string; description: string }) {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substring(2, 9),
      status: 'OPEN',
    };
    this.tasks.update((currentTasks) => [...currentTasks, newTask]);
    this.loggingService.log(`Added new task: ${newTask.title}`);
  }

  updateTaskStatus(id: string, status: TaskStatus) {
    this.tasks.update((currentTasks) =>
      currentTasks.map((task) => (task.id === id ? { ...task, status } : task)),
    );
    this.loggingService.log(`Updated task status: ${id}`);
  }

  deleteTask(id: string) {
    this.tasks.update((currentTasks) =>
      currentTasks.filter((task) => task.id !== id),
    );
    this.loggingService.log(`Deleted task: ${id}`);
  }
}
