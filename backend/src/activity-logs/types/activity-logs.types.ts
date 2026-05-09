export enum ActivityAction {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  RESTORED = 'RESTORED',
  ASSIGNED = 'ASSIGNED',
}

export type ActivityEntity = 'CUSTOMER' | 'NOTE';
