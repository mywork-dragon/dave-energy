import { extractPreloadedData } from '.';
import { createStore } from 'store';
import { EntityDocument } from 'models';
interface EntityStore {
  dispatch: Function;
  getState: Function;
}
describe('Entity store', () => {
  describe('ENTITY_HYDRATE_PRELOADED_DATA action', () => {
    let store: EntityStore;

    beforeEach(() => {
      window.__ENTITY_PRELOADED_STATE__ = {
        entity: {
          loading: false,
          id: 1,
          key: 'batteryMode',
          value: true,
          instance: null,
          // instance2 :null,
        },
      };
      store = createStore();
      store.dispatch(extractPreloadedData());
    });

    it('Store Should be defined', () => {
      expect(store).toBeDefined();
    });

    it('should set entityInstance with preloaded window data', () => {
      const { id, key, value } = store.getState().entity.instance2.entityValues;

      const { loading } = store.getState().entity;
      const tableData = store.getState().entity?.instance;
      tableData?.forEach((data: EntityDocument[]) => {
        expect(data.keys).not.toBeNull(), expect(data.values).not.toBeNull();
      }),
        expect(store).toBeDefined(),
        expect(key).not.toBeNull(),
        expect(value).not.toBeNull(),
        expect(loading).toBeFalsy();
      expect({
        id,
        key,
        value,
      }).toStrictEqual({
        // Emphasize snake to camel case
        id: 1,
        key: 'batteryMode',
        value: true,
      });
    });
  });
});
