import { Request } from 'express';

export type AuthUser = {
  id: number;
  email: string;
  role: 'admin' | 'member';
  organizationId: number;
};

export interface AuthenticatedRequest extends Request {
  user: AuthUser;
}
