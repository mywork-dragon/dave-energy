import { Utility } from 'types';

import 'styled-components/cssprop';
declare global {
  interface Window {
    __ENTITY_PRELOADED_STATE__: PreloadedEntityState;
  }
}

// The preloaded state represents the window.__PRELOADED_DATA__ object
export interface PreloadedEntityState {
  readonly entity: EntityDocumentSnakeCase;
}

export interface EntityDocumentSnakeCase {
  readonly loading?: boolean | null;
  readonly error?: string;
  readonly id?: number | null;
  readonly key?: string;
  readonly value?: boolean | number;
  readonly instance?: null;
  // readonly instance2?: null;
}

export interface BuildingDocumentSnakeCase {
  readonly address?: string | null;
  readonly client?: string | null;
  readonly devices?: DeviceDocumentSnakeCase[] | null;
  readonly id?: number | null;
  readonly market?: string | null;
  readonly name?: string | null;
  readonly sq_footage?: number | null;
  readonly user?: number | null;
  readonly utility?: Utility | null;
}

export interface DeviceDocumentSnakeCase {
  readonly building?: number | null;
  readonly energy_type?: string | null;
  readonly id?: number | null;
  readonly name?: string | null;
  readonly points?: PointDocumentSnakeCase[] | null;
  readonly unit?: string | null;
}

export interface PointDocumentSnakeCase {
  readonly device?: number | null;
  readonly id?: number | null;
  readonly name?: string | null;
  readonly unit?: string | null;
}
