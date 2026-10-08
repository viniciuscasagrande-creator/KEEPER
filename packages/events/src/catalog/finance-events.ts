import { BaseDomainEvent } from '../domain-event';

export interface TitleCreatedPayload {
  titleId: string;
  titleType: 'PAYABLE' | 'RECEIVABLE';
  amount: number;
  documentNumber: string;
  entityPartyId: string;
  dueDate: string;
}

export class TitleCreatedEvent extends BaseDomainEvent<TitleCreatedPayload> {
  static readonly EVENT_NAME = 'finance.title.created';
  constructor(
    tenantId: string,
    companyId: string,
    branchId: string,
    payload: TitleCreatedPayload,
  ) {
    super(
      TitleCreatedEvent.EVENT_NAME,
      payload.titleId,
      tenantId,
      payload,
      companyId,
      branchId,
    );
  }
}

export interface PaymentConfirmedPayload {
  paymentOrderId: string;
  installmentId: string;
  titleId: string;
  bankAccountId: string;
  amountPaid: number;
  paymentMethod: string;
  paidAt: string;
}

export class PaymentConfirmedEvent extends BaseDomainEvent<PaymentConfirmedPayload> {
  static readonly EVENT_NAME = 'finance.payment.confirmed';
  constructor(
    tenantId: string,
    companyId: string,
    branchId: string,
    payload: PaymentConfirmedPayload,
  ) {
    super(
      PaymentConfirmedEvent.EVENT_NAME,
      payload.paymentOrderId,
      tenantId,
      payload,
      companyId,
      branchId,
    );
  }
}
