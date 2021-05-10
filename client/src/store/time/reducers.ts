import { SET_TIME, TimeActionTypes, TimeState } from '.';

export const initialState: TimeState = {
  instance: new Date(),
  isLive: true,
};

export function timeReducer(
  state = initialState,
  action: TimeActionTypes,
): TimeState {
  switch (action.type) {
    case SET_TIME:
      return {
        instance: action.payload,
        isLive: true,
      };
    default:
      return state;
  }
}
