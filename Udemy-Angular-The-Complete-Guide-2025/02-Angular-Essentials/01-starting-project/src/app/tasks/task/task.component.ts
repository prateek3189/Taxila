import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../task.model';
import { CardComponent } from '../../components/card/card.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CardComponent, DatePipe],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent {
  @Input() task!: Task;
  @Output() complete = new EventEmitter<string>();

  onCompleteClick() {
    this.complete.emit(this.task.id);
  }
}
