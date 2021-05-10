import { monthIndexMap, parseTime } from 'utils';

export type DispatchStatus = 'Completed' | 'In Action' | 'Next' | 'ACTIVE';
export type EventType = 'Demand Management' | 'Demand Response' | 'ICAP';

interface Reduction {
  unit?: string | null;
  value?: number | null;
}

export interface SetPoint {
  readonly defaultSetPoint: Reduction;
  readonly eventSetPoint: Reduction;
  readonly pointId?: number | null;
  readonly pointName?: string | null;
  readonly revertEnabled?: boolean | null;
  readonly revertPointId?: number | null;
}

export interface EventScheduleDocument {
  readonly asset?: string | null;
  readonly dispatchId: number;
  readonly startDate?: string | null;
  readonly endDate?: string | null;
  readonly status?: DispatchStatus | null;
  readonly event?: EventType | null;
  readonly realTimeReduction?: Reduction | null;
  readonly targetReduction?: Reduction | null;
  readonly settingPoints?: SetPoint[] | null;
}

export class EventScheduleModel {
  public readonly asset: string | null;
  public readonly dispatchId: number;
  public readonly startDate: Date | null;
  public readonly endDate: Date | null;
  public readonly settingPoints: SetPoint[] | null;
  public readonly status: DispatchStatus | null;
  public readonly event: EventType | null;
  public readonly realTimeReduction: Reduction | null;
  public readonly targetReduction: Reduction | null;

  constructor(eventScheduleDocument: EventScheduleDocument) {
    const {
      asset,
      dispatchId,
      startDate,
      endDate,
      status,
      event,
      realTimeReduction,
      targetReduction,
      settingPoints,
    } = eventScheduleDocument;
    this.asset = asset ?? null;
    this.dispatchId = dispatchId;
    this.startDate = startDate ? new Date(startDate) : null;
    this.endDate = endDate ? new Date(endDate) : null;
    this.settingPoints = settingPoints ?? null;
    this.status = status ?? null;
    this.event = event ?? null;
    this.realTimeReduction = realTimeReduction ?? null;
    this.targetReduction = targetReduction ?? null;
  }

  public getDateDisplay = (date: Date | null): string => {
    if (!date) {
      return '';
    }

    const month = monthIndexMap[date.getMonth()].toUpperCase();
    const calDate = date.getDate();
    const [hours, minutes, AMPM] = parseTime(date);

    if (this.status === 'In Action') {
      return `Today, ${hours}:${minutes} ${AMPM}`;
    } else {
      return `${month} ${calDate}, ${hours}:${minutes} ${AMPM}`;
    }
  };

  public getReductionDisplay = (reduction: Reduction | null): string => {
    if (!reduction) {
      return '';
    }
    const { unit, value } = reduction;

    return `${value === null ? '' : value} ${unit === null ? '' : unit}`;
  };
}
