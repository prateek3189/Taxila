import { Action, createAction, props } from '@ngrx/store';

export const INCREMENT = '[COUNTER] INCREMENT';
export const DECREMENT = '[COUNTER] DECREMENT';

export const increment = createAction(INCREMENT, props<{ value: number }>());
export const decrement = createAction(DECREMENT, props<{ value: number }>());

export class IncrementAction implements Action {
  readonly type = INCREMENT;

  constructor(public value: number) {}
}

export class DecrementAction implements Action {
  readonly type = DECREMENT;

  constructor(public value: number) {}
}

export type CounterActions = IncrementAction | DecrementAction;
