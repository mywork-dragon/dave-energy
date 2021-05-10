import React from 'react';
import { fireEvent } from '@testing-library/react';

import { DayIncrementer } from './DayIncrementer';
import { renderWithRedux } from 'test';
import { TimeState } from 'store/time';

describe('dayIncrementer component', () => {
  let timeState: TimeState;
  const date = new Date('Tue Jun 23 2020 14:59:26 GMT-0400');

  beforeEach(
    () =>
      (timeState = {
        instance: new Date(date),
        isLive: false,
      }),
  );

  test('Clicking tomorrow updates time store instance', async () => {
    const { findByTestId, store } = renderWithRedux(<DayIncrementer />, {
      initialState: { time: timeState },
    });

    fireEvent(
      await findByTestId('dayIncrementer-tomorrow'),
      new MouseEvent('click', { bubbles: true }),
    );

    expect(store.getState().time.instance.getDate()).toEqual(24);
  });

  test('clicking today updates time store instance', async () => {
    const { findByTestId, store } = renderWithRedux(<DayIncrementer />, {
      initialState: { time: timeState },
    });

    fireEvent(
      await findByTestId('dayIncrementer-today'),
      new MouseEvent('click', { bubbles: true }),
    );

    expect(store.getState().time.instance.getDate()).toEqual(
      new Date().getDate(),
    );
  });

  test('clickng previous updates time store instance', async () => {
    const { findByTestId, store } = renderWithRedux(<DayIncrementer />, {
      initialState: { time: timeState },
    });

    fireEvent(
      await findByTestId('dayIncrementer-yesterday'),
      new MouseEvent('click', { bubbles: true }),
    );

    expect(store.getState().time.instance.getDate()).toEqual(22);
  });
});

// TODO: Write tests for <DatePicker />
