import { ADMIN } from '.';

export const initialState = {};

export function adminReducer(state = initialState, action: any) {
  const { type } = action;
  switch (type) {
    case ADMIN:
      return {
        ...state,
      };
    default:
      return state;
  }
}
