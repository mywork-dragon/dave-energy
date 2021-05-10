import { EntityDocument, EntityModel } from './entity';

const entityList: EntityDocument[] = [
  {
    key: 'mode1',
    value: true,
    id: 1,
  },
];

describe('Entity Model', () => {
  describe('Constructor ', () => {
    it('Intialises values', () => {
      const tableData = new EntityModel(entityList);
      tableData.tableData?.forEach((data: EntityDocument) => {
        expect(data.key).not.toBeNull();
        expect(data.value).not.toBeNull();
      }, expect(tableData.tableData.length).toEqual(1));
    });
  });
});
