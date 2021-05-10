import {
  createStore as createReduxStore,
  applyMiddleware,
  combineReducers,
  compose,
} from 'redux';
import reduxThunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

// TODO: Create an index file, of which contains a function that will do these
// imports automagically.
import { adminReducer, initialState as adminInitialState } from './admin';
import {
  userReducer,
  UserState,
  initialState as userInitialState,
} from './user';
import {
  entityReducer,
  EntityState,
  initialState as entityInitialState,
} from './entity';
import {
  timeReducer,
  TimeState,
  initialState as timeInitialState,
} from './time';
import {
  buildingsReducer,
  BuildingsState,
  initialState as buildingsInitialState,
} from './buildings';
import {
  billingReducer,
  BillingState,
  initialState as billingInitialState,
} from './billing';
import {
  toastNotificationReducer,
  ToastNotificationState,
  initialState as toastNotificationInitialState,
} from './toastNotification';

export interface RootState {
  billing: BillingState;
  user: UserState;
  entity: EntityState;
  time: TimeState;
  toastNotification: ToastNotificationState;
  buildings: BuildingsState;
}

export const composeEnhancers =
  (window && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export const rootReducer = combineReducers({
  billing: billingReducer,
  user: userReducer,
  admin: adminReducer,
  entity: entityReducer,
  time: timeReducer,
  buildings: buildingsReducer,
  toastNotification: toastNotificationReducer,
});

export const initialState = {
  billing: billingInitialState,
  user: userInitialState,
  admin: adminInitialState,
  entity: entityInitialState,
  time: timeInitialState,
  buildings: buildingsInitialState,
  toastNotification: toastNotificationInitialState,
};

const logger = createLogger({ level: 'info', collapsed: true });

export function createStore(state: Partial<RootState> = initialState) {
  state = {
    ...initialState,
    ...state,
  };

  const middlewares = [reduxThunk] as any;

  // Positioning logger at the bottom will only log actions that are going to be
  // applied to the store
  if (process.env.NODE_ENV === 'development') {
    middlewares.push(logger);
  }

  const store = createReduxStore(
    rootReducer,
    state,
    composeEnhancers(applyMiddleware(...middlewares)),
  );

  return store;
}
