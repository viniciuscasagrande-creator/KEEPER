import { DomainEvent } from './domain-event';

export interface IEventBus {
  publish<T>(event: DomainEvent<T>): Promise<void>;
  publishAll(events: DomainEvent[]): Promise<void>;
}
