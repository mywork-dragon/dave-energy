import {
  EntityFields,
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

import { api } from 'api';
import { EntityDocument } from 'models/entity/entity';
import { EntitySetDocument } from 'models/entity/entitySet';
import { getEventSchedule } from 'store/buildings';
import { formatDatetime } from 'utils';

export function getEntity() {
  return function(dispatch: Function): Promise<void> {
    dispatch({ type: FETCH_ENTITY });
    return api
      .get<EntityDocument>('/entities')
      .then(res => {
        dispatch({
          type: FETCH_ENTITY_SUCCESS,
          payload: res,
        });
      })
      .catch(err => {
        dispatch({
          type: FETCH_ENTITY_ERROR,
          payload: err,
        });
      });
  };
}

export function setEntity(
  fields: EntityFields,
  table: EntityFields[],
): Function {
  const { key, value, id } = fields;
  const tempData = { id: id, value: value };
  let successTable: EntityFields[] = [];

  return function(dispatch: Function): Promise<void> {
    dispatch({ type: SET_ENTITY });
    return api
      .patch<EntitySetDocument>(`/entities/${key}`, tempData)
      .then(res => {
        let successFields = {};
        table.map(row => {
          if (row.id === res?.id) {
            successFields = row;
          }
        });
        successTable = table.map(row => (row.id === res?.id ? fields : row));
        dispatch({
          type: SET_ENTITY_SUCCESS,
          payload: {
            fields: successFields,
            table: successTable,
          },
        });
      })
      .catch(err => {
        let errFields = {};
        table.map(row => {
          if (row.id === err.id) {
            errFields = { ...row, value: !value };
          }
        });
        const errorTable = table.map(row =>
          row.id === err.id ? { ...row, value: !row.value } : row,
        );
        dispatch({
          type: SET_ENTITY_ERROR,
          payload: {
            error: err.error,
            fields: errFields,
            table: errorTable,
          },
        });
      });
  };
}

export function resetErrorState() {
  return function(dispatch: Function): void {
    dispatch({
      type: RESET_ERROR,
    });
  };
}

export function extractPreloadedData() {
  return function(dispatch: Function): void {
    dispatch({
      type: ENTITY_HYDRATE_PRELOADED_DATA,
      payload: {
        preloadedData: window.__ENTITY_PRELOADED_STATE__,
      },
    });
  };
}

export function revertPoint(buildingId: number, revertPointId: number, dispatchId: number, date: Date) {
  return function(dispatch: Function): Promise<void> {
    dispatch({ type: REVERT_POINT, loadingIds: { buildingId, revertPointId, dispatchId }});
    return api
      .post(`/revert_point?building_id=${buildingId}&revert_point_id=${revertPointId}&dispatch_id=${dispatchId}`)
      .then(res => {
        dispatch({
          type: REVERT_POINT_SUCCESS,
          payload: res,
        });
        const fromTime = formatDatetime(date);
        dispatch(getEventSchedule(buildingId, fromTime));
      })
      .catch(err => {
        dispatch({
          type: REVERT_POINT_ERROR,
          payload: err,
        });
      });
  };
}
