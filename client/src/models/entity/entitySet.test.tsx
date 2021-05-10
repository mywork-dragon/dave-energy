import { EntitySetDocument, EntitySetModel } from './entitySet';

const entitySetDocument: EntitySetDocument = {
  key: 'mode1',
  value: true,
  id: 1,
};

describe('Entity Set Model', () => {
  describe('Constructor ', () => {
    it('Intialises values', () => {
      const entityValues = new EntitySetModel(entitySetDocument);

      expect(entityValues.entityValues.key).not.toBeNull(),
        expect(entityValues.entityValues.value).not.toBeNull();
    });
  });
});
