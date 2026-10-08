const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL || '/api/v1';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('auth_token') || 'demo-token';
  const tenantId = localStorage.getItem('tenant_id') || '00000000-0000-0000-0000-000000000001';
  const companyId = localStorage.getItem('company_id') || '00000000-0000-0000-0000-000000000001';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    'x-tenant-id': tenantId,
    'x-company-id': companyId,
    ...((options.headers as Record<string, string>) || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = 'Erro na requisição';
    try {
      const errJson = await response.json();
      errorDetail = errJson.message || errJson.detail || errorDetail;
    } catch {
      errorDetail = response.statusText;
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

export const api = {
  // Financeiro
  getFinancialSummary: async () => {
    return request<any>('/financeiro/sumario');
  },

  getFinancialAccounts: async () => {
    return request<any[]>('/financeiro/contas');
  },

  getPayableTitles: async (params?: { status?: string; search?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return request<any[]>(`/financeiro/titulos-pagar${query ? `?${query}` : ''}`);
  },

  getPayableById: async (id: string) => {
    return request<any>(`/financeiro/titulos-pagar/${id}`);
  },

  getAgingSummary: async () => {
    return request<any>('/financeiro/aging');
  },

  createTransfer: async (data: {
    sourceAccountId: string;
    destinationAccountId: string;
    amount: number;
    transferDate: string;
    description?: string;
  }) => {
    return request<any>('/financeiro/transferencias', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  createPayableTitle: async (data: {
    description: string;
    documentNumber?: string;
    supplierName?: string;
    issueDate: string;
    dueDate: string;
    totalAmount: number;
    installmentsCount?: number;
    categoryId?: string;
    costCenterId?: string;
    expenseAccountId?: string;
  }) => {
    return request<any>('/financeiro/titulos-pagar', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  liquidatePayableInstallment: async (
    installmentId: string,
    data: {
      financialAccountId: string;
      paymentDate: string;
      amountPaid: number;
      interestAmount?: number;
      fineAmount?: number;
      discountAmount?: number;
      description?: string;
    },
  ) => {
    return request<any>(`/financeiro/parcelas-pagar/${installmentId}/liquidar`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getReceivableTitles: async (params?: { status?: string; search?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return request<any[]>(`/financeiro/titulos-receber${query ? `?${query}` : ''}`);
  },

  createReceivableTitle: async (data: {
    description: string;
    documentNumber?: string;
    customerName?: string;
    issueDate: string;
    dueDate: string;
    totalAmount: number;
    installmentsCount?: number;
    categoryId?: string;
    costCenterId?: string;
    revenueAccountId?: string;
  }) => {
    return request<any>('/financeiro/titulos-receber', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Contábil
  getChartOfAccounts: async () => {
    return request<any[]>('/contabil/plano-contas');
  },

  getDRE: async (startDate?: string, endDate?: string) => {
    const query = new URLSearchParams({ ...(startDate && { startDate }), ...(endDate && { endDate }) }).toString();
    return request<any>(`/contabil/dre${query ? `?${query}` : ''}`);
  },

  getTrialBalance: async (startDate?: string, endDate?: string) => {
    const query = new URLSearchParams({ ...(startDate && { startDate }), ...(endDate && { endDate }) }).toString();
    return request<any>(`/contabil/balancete${query ? `?${query}` : ''}`);
  },

  // Câmara de Liquidação DiskIngressos & Central Financeira do Produtor
  getProducers: async () => {
    return request<any[]>('/financeiro/settlement/producers');
  },

  getProducerFinancialOverview: async (producerId: string) => {
    return request<any>(`/financeiro/settlement/producers/${producerId}/overview`);
  },

  getEventFinancialDetail: async (eventId: string) => {
    return request<any>(`/financeiro/settlement/events/${eventId}/financial-detail`);
  },

  saveEventFeeRule: async (eventId: string, data: any) => {
    return request<any>(`/financeiro/settlement/events/${eventId}/fees`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  requestAdvance: async (producerId: string, eventId: string, data: any) => {
    return request<any>(`/financeiro/settlement/producers/${producerId}/advances?eventId=${eventId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  scheduleProducerRepayment: async (producerId: string, eventId: string, data: any) => {
    return request<any>(`/financeiro/settlement/producers/${producerId}/repayments?eventId=${eventId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getClearingOverview: async () => {
    return request<any>('/financeiro/settlement/overview');
  },

  getEventWallets: async () => {
    return request<any[]>('/financeiro/settlement/wallets');
  },

  getEventStatement: async (walletId: string) => {
    return request<any>(`/financeiro/settlement/wallets/${walletId}/statement`);
  },

  getFeeDefinitions: async () => {
    return request<any[]>('/financeiro/settlement/fees');
  },

  simulateSplit: async (input: {
    ticketAmount: number;
    diskFeeRate?: number;
    spreadRate?: number;
    fixedSpread?: number;
    advanceRate?: number;
    spreadPayer?: 'CUSTOMER' | 'PRODUCER';
  }) => {
    return request<any>('/financeiro/settlement/simulate-split', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  getEventExpenses: async (walletId?: string) => {
    const query = walletId ? `?walletId=${walletId}` : '';
    return request<any[]>(`/financeiro/settlement/expenses${query}`);
  },

  getSettlementSchedules: async () => {
    return request<any[]>('/financeiro/settlement/schedules');
  },

  executeRepayment: async (scheduleId: string) => {
    return request<any>(`/financeiro/settlement/schedules/${scheduleId}/execute`, {
      method: 'POST',
    });
  },

  saveEventRepaymentRule: async (eventId: string, ruleData: any) => {
    return request<any>(`/financeiro/settlement/events/${eventId}/repayment-rule`, {
      method: 'POST',
      body: JSON.stringify(ruleData),
    });
  },

  getFinancialLedger: async (options?: { producerId?: string; eventId?: string; entryType?: string }) => {
    const params = new URLSearchParams();
    if (options?.producerId) params.append('producerId', options.producerId);
    if (options?.eventId) params.append('eventId', options.eventId);
    if (options?.entryType) params.append('entryType', options.entryType);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return request<any[]>(`/financeiro/settlement/ledger${qs}`);
  },

  sendSaleWebhook: async (payload: any) => {
    return request<any>('/financeiro/settlement/webhook/sale-approved', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  sendRefundWebhook: async (payload: any) => {
    return request<any>('/financeiro/settlement/webhook/sale-refunded', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getRefundsOverview: async () => {
    return request<any>('/financeiro/settlement/refunds/overview');
  },

  getEventObligations: async (eventId?: string) => {
    const qs = eventId ? `?eventId=${eventId}` : '';
    return request<any[]>(`/financeiro/settlement/obligations${qs}`);
  },

  saveEventObligation: async (data: any) => {
    return request<any>('/financeiro/settlement/obligations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getEventCancellations: async () => {
    return request<any[]>('/financeiro/settlement/cancellations');
  },

  simulateEventCancellation: async (eventId: string) => {
    return request<any>(`/financeiro/settlement/cancellations/simulate/${eventId}`);
  },

  registerEventCancellation: async (payload: any) => {
    return request<any>('/financeiro/settlement/cancellations', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getSaleRefundRequests: async (filters?: { eventId?: string; status?: string }) => {
    const params = new URLSearchParams();
    if (filters?.eventId) params.append('eventId', filters.eventId);
    if (filters?.status) params.append('status', filters.status);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return request<any[]>(`/financeiro/settlement/refunds/requests${qs}`);
  },

  executeBatchRefunds: async (cancellationId: string, requestIds?: string[]) => {
    return request<any>(`/financeiro/settlement/cancellations/${cancellationId}/execute-refunds`, {
      method: 'POST',
      body: JSON.stringify({ requestIds }),
    });
  },

  saveRecompositionPlan: async (cancellationId: string, planData: any) => {
    return request<any>(`/financeiro/settlement/cancellations/${cancellationId}/recomposition-plan`, {
      method: 'POST',
      body: JSON.stringify(planData),
    });
  },

  // Taxas & Regras Comerciais
  getCommercialRules: async (filters?: {
    scope?: string;
    producerId?: string;
    eventId?: string;
    status?: string;
    acquirer?: string;
    search?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.scope) params.append('scope', filters.scope);
    if (filters?.producerId) params.append('producerId', filters.producerId);
    if (filters?.eventId) params.append('eventId', filters.eventId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.acquirer) params.append('acquirer', filters.acquirer);
    if (filters?.search) params.append('search', filters.search);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return request<any[]>(`/financeiro/commercial-rules${qs}`);
  },

  getCommercialRulesSummary: async () => {
    return request<any>('/financeiro/commercial-rules/summary');
  },

  getEffectiveCommercialRule: async (params?: {
    eventId?: string;
    producerId?: string;
    paymentMethod?: string;
  }) => {
    const qs = new URLSearchParams(params as any).toString();
    return request<any>(`/financeiro/commercial-rules/effective${qs ? `?${qs}` : ''}`);
  },

  getCommercialRuleById: async (id: string) => {
    return request<any>(`/financeiro/commercial-rules/${id}`);
  },

  getCommercialRuleHistory: async (id: string) => {
    return request<any>(`/financeiro/commercial-rules/${id}/history`);
  },

  createCommercialRule: async (data: any) => {
    return request<any>('/financeiro/commercial-rules', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  createCommercialRuleVersion: async (id: string, data: any) => {
    return request<any>(`/financeiro/commercial-rules/${id}/version`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  publishCommercialRule: async (id: string, approvedBy?: string) => {
    return request<any>(`/financeiro/commercial-rules/${id}/publish`, {
      method: 'POST',
      body: JSON.stringify({ approvedBy }),
    });
  },

  toggleCommercialRuleStatus: async (id: string) => {
    return request<any>(`/financeiro/commercial-rules/${id}/toggle-status`, {
      method: 'PATCH',
    });
  },

  duplicateCommercialRule: async (id: string) => {
    return request<any>(`/financeiro/commercial-rules/${id}/duplicate`, {
      method: 'POST',
    });
  },

  simulateCommercialRule: async (input: any) => {
    return request<any>('/financeiro/commercial-rules/simulate', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
};
