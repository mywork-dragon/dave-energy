import { HistoryModel, HistoryDocument } from 'models';

describe('HistoryModel', () => {
  it('initializes with a HistoryDocument', () => {
    const historyDocument: HistoryDocument = {
      mode: 'mocked-mode',
      quantity: 1,
      ts: 'mocked-ts',
    };

    const historyModel = new HistoryModel(historyDocument);
    const { mode, ts, quantity } = historyModel;
    expect(mode).toBe('mocked-mode');
    expect(quantity).toBe(1);
    expect(ts).toBe('mocked-ts');
  });
  it('initializes with HistoryDocument fields qual null', () => {
    const historyDocument: HistoryDocument = {
      mode: null,
      quantity: null,
      ts: null,
    };

    const historyModel = new HistoryModel(historyDocument);
    const { mode, ts, quantity } = historyModel;
    expect(mode).toBeNull();
    expect(quantity).toBeNull();
    expect(ts).toBeNull();
  });
});
