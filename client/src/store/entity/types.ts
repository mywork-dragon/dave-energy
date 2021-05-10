import {
  EntityModel,
  EntitySetModel,
  EntitySetDocument,
  EntityDocument,
  EntityWrapper,
} from 'models';
import { PreloadedEntityState } from 'types';

export const FETCH_ENTITY = 'FETCH_ENTITY';
export const FETCH_ENTITY_SUCCESS = 'FETCH_ENTITY_SUCCESS';
export const FETCH_ENTITY_ERROR = 'FETCH_ENTITY_ERROR';

export const SET_ENTITY = 'SET_ENTITY';
export const SET_ENTITY_SUCCESS = 'SET_ENTITY_SUCCESS';
export const SET_ENTITY_ERROR = 'SET_ENTITY_ERROR';

export const ENTITY_HYDRATE_PRELOADED_DATA = 'ENTITY_HYDRATE_PRELOADED_DATA';
export const RESET_ERROR = 'RESET_ERROR';

export const REVERT_POINT = 'REVERT_POINT';
export const REVERT_POINT_SUCCESS = 'REVERT_POINT_SUCCESS';
export const REVERT_POINT_ERROR = 'REVERT_POINT_ERROR';

export interface EntityFields {
  id: number;
  key: string;
  value: boolean | number;
}

export interface EntityState {
  loading?: boolean;
  loadingIds?: any;
  error?: string;
  instance?: EntityModel | null;
  instance2?: EntitySetModel | null;
}
export interface EntityHydatePreloadedData {
  type: typeof ENTITY_HYDRATE_PRELOADED_DATA;
  payload: {
    preloadedData: PreloadedEntityState;
  };
}

export const EntityInitialState: EntityState = {
  loading: false,
  error: '',
  instance: null,
  instance2: null,
};

interface ResetErrorAction {
  type: typeof RESET_ERROR;
}

interface FetchEntityAction {
  type: typeof FETCH_ENTITY;
  payload: {
    loading: true;
  };
}

interface FetchEntitySuccess {
  type: typeof FETCH_ENTITY_SUCCESS;
  payload: EntityWrapper;
}

interface FetchEntityError {
  type: typeof FETCH_ENTITY_ERROR;
  payload: {
    loading: false;
    error: string;
  };
}

interface SetEntityAction {
  type: typeof SET_ENTITY;
  payload: {
    loading: true;
  };
}

interface SetEntitySuccess {
  type: typeof SET_ENTITY_SUCCESS;
  payload: {
    fields: EntitySetDocument;
    table: EntityDocument[];
  };
}
interface SetEntityError {
  type: typeof SET_ENTITY_ERROR;
  payload: {
    loading: false;
    error: string;
    fields: EntitySetDocument;
    table: EntityDocument[];
  };
}

interface RevertPoint {
  loadingIds?: any;
  type: typeof REVERT_POINT;
  payload: {
    pointId: number;
  };
}

interface RevertPointSuccess {
  type: typeof REVERT_POINT_SUCCESS;
}

interface RevertPointError {
  type: typeof REVERT_POINT_ERROR;
}

export type EntityActionTypes =
  | EntityHydatePreloadedData
  | FetchEntityAction
  | FetchEntitySuccess
  | FetchEntityError
  | SetEntityAction
  | SetEntitySuccess
  | SetEntityError
  | ResetErrorAction
  | RevertPoint
  | RevertPointSuccess
  | RevertPointError;
