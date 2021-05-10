export interface HistoryDocument {
  readonly mode?: string | null;
  readonly quantity?: number | null;
  readonly ts?: string | null;
}

export class HistoryModel {
  public readonly mode?: string | null;
  public readonly quantity: number | null;
  public readonly ts: string | null;

  constructor(historyDocument: HistoryDocument) {
    const { mode, ts, quantity } = historyDocument;
    this.mode = mode ?? null;
    this.quantity = quantity ?? null;
    this.ts = ts ?? null;
  }
}
