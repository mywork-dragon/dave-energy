import React from 'react';
import '@testing-library/jest-dom/extend-expect';

import { Slider } from './Slider';
import { renderWithRedux } from 'test';

// TODO: Re-rewrite these tests. They no longer rely on input values for
// snapping on graph ticks. The react-draggable library uses css property
// transform: translate(px) to set position. This poses a challenge because for
// a full test suite we'd need to set browser dimensions. Maybe we should just
// attach the range tick as a data-tn and call it a day

describe('Slider', () => {
  it.skip('input value should be 0 if the time is under 12:15AM', async () => {
    const date = new Date();
    date.setHours(0);
    date.setMinutes(8);
    const { findByTestId } = renderWithRedux(<Slider />, {
      initialState: { time: { instance: date } },
    });

    const slider = (await findByTestId('slider-input')) as HTMLInputElement;
    expect(slider.value).toEqual('0');
  });

  it.skip('input value should be 51 if the time is 12:35PM', async () => {
    const date = new Date();
    date.setHours(12);
    date.setMinutes(35);
    const { findByTestId } = renderWithRedux(<Slider />, {
      initialState: { time: { instance: date } },
    });

    const slider = (await findByTestId('slider-input')) as HTMLInputElement;
    expect(slider.value).toEqual('51');
  });

  it.skip('input value should be 95 if the time is 11:45pm', async () => {
    const date = new Date();
    date.setHours(23);
    date.setMinutes(45);
    const { findByTestId } = renderWithRedux(<Slider />, {
      initialState: { time: { instance: date } },
    });

    const slider = (await findByTestId('slider-input')) as HTMLInputElement;
    expect(slider.value).toEqual('95');
  });
});
