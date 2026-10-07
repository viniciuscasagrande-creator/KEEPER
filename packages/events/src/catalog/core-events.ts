import { BaseDomainEvent } from '../domain-event';

export interface TenantCreatedPayload {
  tenantId: string;
  slug: string;
  name: string;
}

export class TenantCreatedEvent extends BaseDomainEvent<TenantCreatedPayload> {
  static readonly EVENT_NAME = 'core.tenant.created';
  constructor(payload: TenantCreatedPayload) {
    super(TenantCreatedEvent.EVENT_NAME, payload.tenantId, payload.tenantId, payload);
  }
}

export interface UserRegisteredPayload {
  userId: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export class UserRegisteredEvent extends BaseDomainEvent<UserRegisteredPayload> {
  static readonly EVENT_NAME = 'core.user.registered';
  constructor(payload: UserRegisteredPayload) {
    super(UserRegisteredEvent.EVENT_NAME, payload.userId, payload.tenantId, payload);
  }
}
