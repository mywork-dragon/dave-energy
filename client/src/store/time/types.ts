export const SET_TIME = 'SET_TIME';

export interface TimeState {
  instance: Date;
  isLive: boolean;
}

interface SetTimeAction {
  type: typeof SET_TIME;
  payload: Date;
}

export type TimeActionTypes = SetTimeAction;
