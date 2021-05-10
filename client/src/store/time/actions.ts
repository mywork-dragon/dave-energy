import { SET_TIME, TimeActionTypes } from '.';

export function setTime(date: Date): TimeActionTypes {
  return { type: SET_TIME, payload: date };
}
