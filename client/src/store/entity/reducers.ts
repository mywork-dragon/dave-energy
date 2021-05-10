import camelcaseKeys from 'camelcase-keys';

import {
  EntityActionTypes,
  EntityState,
  FETCH_ENTITY,
  FETCH_ENTITY_SUCCESS,
  FETCH_ENTITY_ERROR,
  SET_ENTITY,
  SET_ENTITY_SUCCESS,
  SET_ENTITY_ERROR,
  ENTITY_HYDRATE_PRELOADED_DATA,
  RESET_ERROR,
  REVERT_POINT,
  REVERT_POINT_SUCCESS,
  REVERT_POINT_ERROR,
} from '.';
import { EntityModel } from 'models/entity/entity';
import { EntitySetModel, EntitySetDocument } from 'models/entity/entitySet';

export const initialState: EntityState = {};

export function entityReducer(
  state = initialState,
  action: EntityActionTypes,
): EntityState {
  switch (action.type) {
    case RESET_ERROR:
      return {
        ...state,
        error: '',
      };

    case FETCH_ENTITY_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        instance: new EntityModel(action.payload.data),
      };

    case FETCH_ENTITY_ERROR:
      return {
        ...state,
        error: action.payload.error,
        loading: false,
      };

    case FETCH_ENTITY:
      return {
        ...state,
        loading: true,
      };

    case SET_ENTITY:
      return {
        ...state,
        loading: true,
      };

    case SET_ENTITY_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        instance: new EntityModel(action.payload.table),
        instance2: new EntitySetModel(action.payload.fields),
      };

    case SET_ENTITY_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        instance: new EntityModel(action.payload.table),
        instance2: new EntitySetModel(action.payload.fields),
      };

    case ENTITY_HYDRATE_PRELOADED_DATA:
      const entityInstance = new EntitySetModel(
        camelcaseKeys(action.payload.preloadedData.entity, {
          deep: true,
        }) as EntitySetDocument,
      );
      return {
        ...state,
        error: '',
        instance2: entityInstance,
      };

    case REVERT_POINT:
      return {
        ...state,
        loading: true,
        loadingIds: action.loadingIds,
      };

    case REVERT_POINT_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case REVERT_POINT_ERROR:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}
