import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Time } from './Time';
import { renderWithRedux } from 'test';
import { TimeState } from 'store/time';

describe('TimeDropdown component', () => {
  let timeState: TimeState;

  beforeEach(
    () =>
      (timeState = {
        instance: new Date('Tue Jun 21 2020 14:59:26 GMT-0400'),
        isLive: false,
      }),
  );

  test('Show/hide when time call to action button is clicked', async () => {
    const { findByTestId, getByTestId } = renderWithRedux(<Time />, {
      initialState: { time: timeState },
    });

    fireEvent(
      await findByTestId('time-toggle-dropdown'),
      new MouseEvent('click', { bubbles: true }),
    );

    let timeDropdown;
    await waitFor(() => {
      timeDropdown = getByTestId('time-dropdown');
      expect(timeDropdown).toBeInTheDocument();
    });

    fireEvent(
      await findByTestId('time-toggle-dropdown'),
      new MouseEvent('click', { bubbles: true }),
    );

    expect(timeDropdown).not.toBeInTheDocument();
  });

  // Finish up this test once the monolithic commit lands
  test.skip('Shows 15 minute ticks from midnight up to date that is in Redux store', async () => {
    const { findByTestId, getAllByTestId } = renderWithRedux(<Time />, {
      initialState: { time: timeState },
    });

    fireEvent(
      await findByTestId('time-toggle-dropdown'),
      new MouseEvent('click', { bubbles: true }),
    );

    let ticks: HTMLElement[] = [];
    await waitFor(() => {
      ticks = getAllByTestId('time-dropdown-tick');
      expect(ticks.length).toBeGreaterThan(0);
    });

    const expectedTicks = [
      '12:00 AM',
      '12:15 AM',
      '12:30 AM',
      '12:45 AM',
      '1:00 AM',
      '1:15 AM',
      '1:30 AM',
      '1:45 AM',
      '2:00 AM',
      '2:15 AM',
      '2:30 AM',
      '2:45 AM',
      '3:00 AM',
      '3:15 AM',
      '3:30 AM',
      '3:45 AM',
      '4:00 AM',
      '4:15 AM',
      '4:30 AM',
      '4:45 AM',
      '5:00 AM',
      '5:15 AM',
      '5:30 AM',
      '5:45 AM',
      '6:00 AM',
      '6:15 AM',
      '6:30 AM',
      '6:45 AM',
      '7:00 AM',
      '7:15 AM',
      '7:30 AM',
      '7:45 AM',
      '8:00 AM',
      '8:15 AM',
      '8:30 AM',
      '8:45 AM',
      '9:00 AM',
      '9:15 AM',
      '9:30 AM',
      '9:45 AM',
      '10:00 AM',
      '10:15 AM',
      '10:30 AM',
      '10:45 AM',
      '11:00 AM',
      '11:15 AM',
      '11:30 AM',
      '11:45 AM',
      '12:00 PM',
      '12:15 PM',
      '12:30 PM',
      '12:45 PM',
      '1:00 PM',
      '1:15 PM',
      '1:30 PM',
      '1:45 PM',
      '2:00 PM',
      '2:15 PM',
      '2:30 PM',
      '2:45 PM',
    ];

    const tickDisplays: string[] = ticks.map(tick => tick.innerHTML);
    expect(tickDisplays).toStrictEqual(expectedTicks);
  });
});
