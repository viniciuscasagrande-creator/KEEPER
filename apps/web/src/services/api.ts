const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000/api/v1';

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
};
