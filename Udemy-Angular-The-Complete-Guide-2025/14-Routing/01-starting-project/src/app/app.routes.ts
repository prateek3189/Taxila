import { CanMatchFn, Routes } from '@angular/router';

import { NoTaskComponent } from './tasks/no-task/no-task.component';
import {
  resolveTitle,
  resolveUsername,
  UserTasksComponent,
} from './users/user-tasks/user-tasks.component';
import { NotFountComponent } from './not-fount/not-fount.component';
import { userCanMatch, userRoutes } from './users/user.routes';

export const routes: Routes = [
  { path: '', component: NoTaskComponent, title: 'Task Management' },
  {
    path: 'users/:userId',
    component: UserTasksComponent,
    children: userRoutes,
    canMatch: [userCanMatch],
    data: {
      message: 'Hello',
    },
    resolve: {
      username: resolveUsername,
    },
    title: resolveTitle,
  },
  { path: '**', component: NotFountComponent },
];
