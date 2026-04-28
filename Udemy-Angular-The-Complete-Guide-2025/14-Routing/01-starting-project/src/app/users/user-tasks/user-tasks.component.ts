import { Component, inject, input, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import {
  RouterOutlet,
  RouterLink,
  ResolveFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  ActivatedRoute,
} from '@angular/router';

@Component({
  selector: 'app-user-tasks',
  standalone: true,
  templateUrl: './user-tasks.component.html',
  styleUrl: './user-tasks.component.css',
  imports: [RouterOutlet, RouterLink],
})
export class UserTasksComponent implements OnInit {
  username = input.required<string>();
  message = input.required<string>();
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe({
      next: (data) => {
        // console.log(data); // Get static and dynamic data
      },
    });
  }
}

export const resolveUsername: ResolveFn<string> = (
  activatedRoute: ActivatedRouteSnapshot,
  routerState: RouterStateSnapshot,
) => {
  const userService = inject(UsersService);
  const username =
    userService.users.find((u) => {
      return u.id === activatedRoute.paramMap.get('userId');
    })?.name || 'test';

  return username;
};

export const resolveTitle: ResolveFn<string> = (
  activatedRoute: ActivatedRouteSnapshot,
  routerState: RouterStateSnapshot,
) => {
  const userService = inject(UsersService);
  const username =
    userService.users.find((u) => {
      return u.id === activatedRoute.paramMap.get('userId');
    })?.name || 'test';

  return username + "'s Tasks";
};
