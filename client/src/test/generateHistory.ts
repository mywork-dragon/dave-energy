import { HistoryDocument } from 'models';

function getRandomArbitrary(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export const generateHistoryDocuments = (
  count: number,
  low: number,
  high: number,
): HistoryDocument[] => {
  const history: HistoryDocument[] = [];
  for (let i = 1; i <= count; i += 1) {
    history.push({
      quantity: getRandomArbitrary(low, high),
      ts: 'ts',
    });
  }
  return history;
};
