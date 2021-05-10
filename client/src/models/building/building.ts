import { DeviceDocument, DeviceModel } from '..';
import { Utility } from 'types';

export interface BuildingDocument {
  readonly address?: string | null;
  readonly client?: string | null;
  readonly devices?: DeviceDocument[] | null;
  readonly id?: number | null;
  readonly market?: string | null;
  readonly name?: string | null;
  readonly sqFootage?: number | null;
  readonly user?: number | null;
  readonly utility?: Utility | null;
}

export class BuildingModel {
  public readonly address: string | null;
  public readonly client: string | null;
  public readonly devices: DeviceModel[] | null;
  public readonly id: number | null;
  public readonly market: string | null;
  public readonly name: string | null;
  public readonly sqFootage: number | null;
  public readonly user: number | null;
  public readonly utility: Utility | null;

  constructor(buildingDocument: BuildingDocument) {
    const {
      address,
      client,
      devices,
      id,
      market,
      name,
      sqFootage,
      user,
      utility,
    } = buildingDocument;

    this.address = address ?? null;
    this.client = client ?? null;
    this.devices = devices?.map(device => new DeviceModel(device)) ?? null;
    this.id = id ?? null;
    this.market = market ?? null;
    this.name = name ?? null;
    this.sqFootage = sqFootage ?? null;
    this.user = user ?? null;
    this.utility = utility ?? null;
  }
}
