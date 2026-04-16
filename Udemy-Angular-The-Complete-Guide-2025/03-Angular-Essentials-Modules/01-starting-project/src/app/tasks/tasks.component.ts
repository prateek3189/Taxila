import { Component, Input } from '@angular/core';
import { TaskComponent } from './task/task.component';
import { dummyTasks } from './dummy-tasks';
import { User } from '../user/user.model';
import { AddTaskComponent } from './add-task/add-task.component';
import { Task } from './task.model';
import { TaskService } from './task.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent {
  @Input({ required: true }) userId!: string;
  @Input({ required: true }) user!: User;
  isAddingTask = false;

  get userTasks() {
    return this.taskService.getUserTasks(this.userId);
  }

  constructor(private taskService: TaskService) {}

  onTaskComplete(taskId: string) {
    this.taskService.completeTask(taskId);
  }

  onAddTaskClick() {
    this.isAddingTask = true;
  }

  onCloseAddTask() {
    this.isAddingTask = false;
  }
}
