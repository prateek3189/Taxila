import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { TaskInterface } from './task.model';
import { CardComponent } from '../../shared/card/card.component';
import { DatePipe } from '@angular/common';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent {
  @Input({ required: true }) task!: TaskInterface;
  private tasksService = inject(TasksService);

  onCompleteTask() {
    this.tasksService.completeTask(this.task.id!);
  }
}
