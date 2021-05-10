import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Calendar } from './Calendar';
import { renderWithRedux } from 'test';
import { TimeState } from 'store/time';

describe('Calendar component', () => {
  let timeState: TimeState;

  beforeEach(
    () =>
      (timeState = {
        instance: new Date('Tue Jun 23 2020 14:59:26 GMT-0400'),
        isLive: false,
      }),
  );

  describe('Displays formatted date according to props dateDisplayFormat & isUpperCase', () => {
    test('props.dateDisplayFormat = day', async () => {
      const { findByTestId } = renderWithRedux(
        <Calendar dateDisplayFormat="day" />,
        {
          initialState: { time: timeState },
        },
      );

      const display = await findByTestId('calendar-display');
      expect(display.innerHTML).toBe('Jun 23');
    });

    test('props.dateDisplayFormat = dayAndYear', async () => {
      const { findByTestId } = renderWithRedux(
        <Calendar dateDisplayFormat="dayAndYear" />,
        {
          initialState: { time: timeState },
        },
      );

      const display = await findByTestId('calendar-display');
      expect(display.innerHTML).toBe('Jun 23, 2020');
    });

    test('props.isUppercase = true', async () => {
      const { findByTestId } = renderWithRedux(
        <Calendar dateDisplayFormat="dayAndYear" isUppercase />,
        {
          initialState: { time: timeState },
        },
      );

      const display = await findByTestId('calendar-display');
      expect(display.innerHTML).toBe('JUN 23, 2020');
    });
  });

  test('Toggle date picker shows and hides date picker', async () => {
    const { findByTestId, getByTestId } = renderWithRedux(
      <Calendar dateDisplayFormat="day" />,
      {
        initialState: { time: timeState },
      },
    );

    // Toggle show
    fireEvent(
      await findByTestId('calendar-toggle-date-picker'),
      new MouseEvent('click', { bubbles: true }),
    );

    let datePicker;
    await waitFor(() => {
      datePicker = getByTestId('calendar-date-picker');
      expect(datePicker).toBeInTheDocument();
    });

    // Toggle hide
    fireEvent(
      await findByTestId('calendar-toggle-date-picker'),
      new MouseEvent('click', { bubbles: true }),
    );
    expect(datePicker).not.toBeInTheDocument();
  });
});

// TODO: Write tests for <DatePicker />
