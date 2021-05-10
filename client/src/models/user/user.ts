import { BuildingDocument, BuildingModel } from '..';
import { Utility } from 'types';

export enum UserRole {
  STANDARD = 0,
  ADMIN = 1,
  BUILDING_ENGINEER = 2,
  MANAGEMENT = 3,
}
export interface UserDocument {
  readonly buildings?: BuildingDocument[];
  readonly email?: string | null;
  readonly firstName?: string | null;
  readonly id?: number | null;
  readonly isActive?: boolean | null;
  readonly lastName?: string | null;
  readonly userRole?: UserRole | null;
  readonly company?: number | null;
}

export class UserModel {
  public readonly buildings: BuildingModel[] | null;
  public readonly email: string | null;
  public readonly firstName: string | null;
  public readonly id: number | null;
  public readonly isActive: boolean | null;
  public readonly lastName: string | null;
  public readonly userRole: UserRole | null;
  public readonly company: number | null;

  constructor(userDocument: UserDocument) {
    const {
      buildings,
      email,
      firstName,
      id,
      isActive,
      lastName,
      userRole,
      company,
    } = userDocument;

    this.buildings =
      buildings?.map(building => new BuildingModel(building)) ?? null;
    this.email = email ?? null;
    this.firstName = firstName ?? null;
    this.id = id ?? null;
    this.isActive = isActive ?? null;
    this.lastName = lastName ?? null;
    this.userRole = userRole ?? null;
    this.company = company ?? null;
  }

  public getAvailableEnergyTypes = (buildingId: number): Utility[] => {
    const buildingById = this.buildings?.find(
      building => building.id === buildingId,
    );

    return (
      buildingById?.devices
        ?.map(({ energyType }) => energyType as Utility)
        .sort() ?? []
    );
  };
}
