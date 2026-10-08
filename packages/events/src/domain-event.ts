import { randomUUID } from 'crypto';

export interface DomainEvent<T = unknown> {
  readonly id: string;
  readonly eventName: string;
  readonly aggregateId: string;
  readonly tenantId: string;
  readonly companyId?: string;
  readonly branchId?: string;
  readonly occurredAt: Date;
  readonly payload: T;
  readonly metadata?: Record<string, unknown>;
}

export abstract class BaseDomainEvent<T = unknown> implements DomainEvent<T> {
  public readonly id: string;
  public readonly occurredAt: Date;

  constructor(
    public readonly eventName: string,
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly payload: T,
    public readonly companyId?: string,
    public readonly branchId?: string,
    public readonly metadata?: Record<string, unknown>,
  ) {
    this.id = randomUUID();
    this.occurredAt = new Date();
  }
}
