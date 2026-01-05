import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { TasksService } from './app/tasks/tasks.service';
import { InjectionToken } from '@angular/core';
import { TaskStatusOptions } from './app/tasks/task.model';

export const TaskServiceToken = new InjectionToken<TasksService>(
  'task-service-token'
);

bootstrapApplication(AppComponent, {
  providers: [TaskStatusOptions],
}).catch((err) => console.error(err));

// bootstrapApplication(AppComponent, {
//   providers: [TasksService],
// }).catch((err) => console.error(err));

// bootstrapApplication(AppComponent).catch((err) => console.error(err));
