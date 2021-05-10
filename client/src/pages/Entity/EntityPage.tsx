import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../store';
import {
  getEntity,
  setEntity,
  resetErrorState,
  EntityFields,
} from 'store/entity';
import './entity.less';
import { Spinner } from 'design-system';

interface TableData {
  id: number;
  key: string;
  value: boolean | number;
}

export const EntityPage: React.FC = () => {
  const dispatch = useDispatch();

  const tableDataValues = useSelector(
    ({ entity }: RootState) => entity?.instance?.tableData,
  );

  const [tableState, setTableState] = useState(tableDataValues);

  const isLoading = useSelector(
    ({ entity }: RootState) => entity?.loading ?? false,
  );

  const errorMsg = useSelector(({ entity }: RootState) => entity?.error);
  useEffect(() => {
    dispatch(getEntity());
  }, []);

  useEffect(() => {
    if (tableDataValues) {
      setTableState(tableDataValues);
    }
  }, [tableDataValues]);

  useEffect(() => {
    if (errorMsg) {
      setTimeout(() => {
        dispatch(resetErrorState());
      }, 3000);
    }
  }, [errorMsg]);

  const handleToggle: Function = (
    event: React.ChangeEvent<HTMLInputElement>,
    data: TableData,
  ) => {
    const tempArray: EntityFields[] =
      tableState?.map(row =>
        row.id === data.id ? { ...row, value: event.target.checked } : row,
      ) ?? [];
    setTableState(tempArray);

    const tempData = { ...data, value: !data.value };
    dispatch(setEntity(tempData, tempArray));
  };

  const handleChange: Function = (
    event: React.ChangeEvent<HTMLInputElement>,
    data: TableData,
  ) => {
    const tempArray: EntityFields[] =
      tableState?.map(row =>
        row.key === data.key
          ? { ...row, value: Number(event.target.value) }
          : row,
      ) ?? [];
    setTableState(tempArray);
  };

  const handleSubmit: Function = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();
    // const { key } = data;
    //dispatch(setEntity(tempData));
  };

  return (
    <div className={isLoading ? 'parentDisable' : ''}>
      <div className="overlay-box">
        <Spinner loading={isLoading} />
      </div>
      <>
        {tableState ? (
          <table className="table-container">
            <tbody>
              <tr className="table-row">
                <td className="table-cell text-bold">Entity</td>
                <td className="table-cell text-bold">Value</td>
              </tr>
              {tableState.length === 0 ? (
                <tr className="table-row ">
                  <td className="table-cell">
                    <div className="cell-content">No Data Found</div>
                  </td>
                  <td className="table-cell">
                    <div className="cell-content">No Data Found</div>
                  </td>
                </tr>
              ) : (
                <>
                  {tableState.map((data: TableData) => (
                    <tr key={data.id} className="table-row ">
                      <td className="table-cell">
                        <div className="cell-content">{data.key}</div>
                      </td>
                      <td className="table-cell div-center">
                        <div className="cell-content">
                          {typeof data.value === 'boolean' ? (
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={data.value}
                                onChange={(
                                  e,
                                ): React.ChangeEvent<HTMLInputElement> =>
                                  handleToggle(e, data)
                                }
                              />
                              <span className="slider round"></span>
                            </label>
                          ) : (
                            <form
                              onSubmit={(
                                e,
                              ): React.ChangeEvent<HTMLInputElement> =>
                                handleSubmit(e)
                              }
                            >
                              <input
                                type="text"
                                value={data.value}
                                onChange={(
                                  e,
                                ): React.ChangeEvent<HTMLInputElement> =>
                                  handleChange(e, data)
                                }
                              />
                              <input type="submit" value="Submit" />
                            </form>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        ) : (
          ''
        )}
        {errorMsg && <div className="err-msg text-bold">{errorMsg}</div>}
      </>
    </div>
  );
};
