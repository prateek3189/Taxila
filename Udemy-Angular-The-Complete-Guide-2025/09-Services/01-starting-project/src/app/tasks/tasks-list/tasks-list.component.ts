import { Component, computed, Inject, inject, signal } from '@angular/core';

import { TaskItemComponent } from './task-item/task-item.component';
import { TasksService } from '../tasks.service';
import { TASK_OPTIONS_PROVIDER, TASK_OPTIONS_TOKEN } from '../task.model';
import { TaskServiceToken } from '../../../main';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.css',
  imports: [TaskItemComponent],
  providers: [TASK_OPTIONS_PROVIDER],
})
export class TasksListComponent {
  selectedFilter = signal<string>('all');
  taskStatusOptions = inject(TASK_OPTIONS_TOKEN);

  // private tasksService = inject(TaskServiceToken);
  constructor(@Inject(TaskServiceToken) private tasksService: TasksService) {}

  tasks = computed(() => {
    const filter = this.selectedFilter();
    const allTasks = this.tasksService.allTasks();

    switch (filter) {
      case 'open':
        return allTasks.filter((task) => task.status === 'OPEN');
      case 'in-progress':
        return allTasks.filter((task) => task.status === 'IN_PROGRESS');
      case 'done':
        return allTasks.filter((task) => task.status === 'DONE');
      default:
        return allTasks;
    }
  });

  onChangeTasksFilter(filter: string) {
    this.selectedFilter.set(filter);
  }
}
