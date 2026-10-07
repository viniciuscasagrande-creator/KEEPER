export interface OutboxMessage {
  id: string;
  tenantId: string;
  eventType: string;
  aggregateId: string;
  payload: Record<string, unknown>;
  status: 'PENDING' | 'PUBLISHED' | 'FAILED';
  retryCount: number;
  errorMessage?: string | null;
  createdAt: Date;
  processedAt?: Date | null;
}
