// import { createReducer, on } from '@ngrx/store';
// import { decrement, increment } from './counter.actions';

import { Action } from '@ngrx/store';
import {
  CounterActions,
  DECREMENT,
  DecrementAction,
  INCREMENT,
  IncrementAction,
} from './counter.actions';

const initialState = 0;

// export const counterReducer = createReducer(
//   initialState,
//   on(increment, (state, action) => state + action.value),
//   on(decrement, (state, action) => state - action.value),
// );

export function counterReducer(
  state = initialState,
  action: CounterActions | Action,
) {
  switch (action.type) {
    case INCREMENT:
      return state + (action as IncrementAction).value;
    case DECREMENT:
      return state - (action as DecrementAction).value;
  }
  return state;
}
