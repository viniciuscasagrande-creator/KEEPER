/**
 * Cálculo puro de taxas para simulador e matriz comercial.
 * NÃO cria lançamentos e NÃO altera o Ledger.
 * Todos os valores monetários são em centavos inteiros. Percentuais são em basis points:
 * 800 = 8,00%; 280 = 2,80%; 10000 = 100,00%.
 */
export interface FeeSimulationInput {
  saleCents: number;
  chargedBps: number;
  acquiringMdrBps: number;
  acquiringFixedCents?: number;
  additionalCostCents?: number;
  fixedCommercialRevenueCents?: number;
}

export interface FeeSimulationResult {
  chargedFeeCents: number;
  mdrCostCents: number;
  grossSpreadCents: number;
  netMarginCents: number;
  grossSpreadBps: number;
}

export function simulateFee(input: FeeSimulationInput): FeeSimulationResult {
  const fields = [
    input.saleCents,
    input.chargedBps,
    input.acquiringMdrBps,
    input.acquiringFixedCents ?? 0,
    input.additionalCostCents ?? 0,
    input.fixedCommercialRevenueCents ?? 0,
  ];

  if (fields.some((v) => !Number.isSafeInteger(v) || v < 0)) {
    throw new Error('Campos devem ser inteiros não negativos');
  }

  if (input.saleCents <= 0 || input.chargedBps > 10000 || input.acquiringMdrBps > 10000) {
    throw new Error('Valor ou percentual fora da faixa permitida');
  }

  const chargedFeeCents = Math.round((input.saleCents * input.chargedBps) / 10000);
  const mdrCostCents = Math.round((input.saleCents * input.acquiringMdrBps) / 10000);
  const grossSpreadCents = chargedFeeCents - mdrCostCents;
  const netMarginCents =
    grossSpreadCents -
    (input.acquiringFixedCents ?? 0) -
    (input.additionalCostCents ?? 0) +
    (input.fixedCommercialRevenueCents ?? 0);

  return {
    chargedFeeCents,
    mdrCostCents,
    grossSpreadCents,
    netMarginCents,
    grossSpreadBps: input.chargedBps - input.acquiringMdrBps,
  };
}
