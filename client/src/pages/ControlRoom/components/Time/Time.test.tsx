import React from 'react';
import { waitFor } from '@testing-library/react';

import { Time } from './Time';
import { renderWithRedux } from 'test';
import { TimeState } from 'store/time';

describe('Time component', () => {
  let timeState: TimeState;

  beforeEach(
    () =>
      (timeState = {
        instance: new Date('Tue Jun 21 2020 14:59:26 GMT-0400'),
        isLive: false,
      }),
  );

  test('Displays the hour/minute time in store.time', async () => {
    const { getByTestId } = renderWithRedux(<Time />, {
      initialState: { time: timeState },
    });

    await waitFor(() =>
      expect(getByTestId('time-hour-minute').innerHTML).toEqual('2:59'),
    );
  });

  test('Toggle TimeDropdown when clicking call to action', () => {});

  describe('Displays AM/PM', () => {
    test('PM', async () => {
      const { getByTestId } = renderWithRedux(<Time />, {
        initialState: { time: timeState },
      });

      await waitFor(() =>
        expect(getByTestId('time-am-pm').innerHTML).toEqual('PM'),
      );
    });

    test('AM', async () => {
      timeState = {
        instance: new Date('Tue Jun 21 2020 08:59:26 GMT-0400'),
        isLive: false,
      };

      const { getByTestId } = renderWithRedux(<Time />, {
        initialState: { time: timeState },
      });

      await waitFor(() =>
        expect(getByTestId('time-am-pm').innerHTML).toEqual('AM'),
      );
    });
  });
});
