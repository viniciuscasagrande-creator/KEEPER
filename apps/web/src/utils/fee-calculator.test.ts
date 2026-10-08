import { describe, expect, it } from 'vitest';
import { simulateFee } from './fee-calculator';

describe('simulador puro, sem lançamentos', () => {
  it('separa taxa 8% do MDR 2,8% sobre R$1000', () => {
    expect(simulateFee({ saleCents: 100000, chargedBps: 800, acquiringMdrBps: 280 })).toEqual({
      chargedFeeCents: 8000,
      mdrCostCents: 2800,
      grossSpreadCents: 5200,
      netMarginCents: 5200,
      grossSpreadBps: 520,
    });
  });

  it('considera custos fixos separadamente', () => {
    expect(
      simulateFee({
        saleCents: 100000,
        chargedBps: 800,
        acquiringMdrBps: 280,
        acquiringFixedCents: 80,
        additionalCostCents: 20,
      }).netMarginCents,
    ).toBe(5100);
  });

  it('rejeita entrada negativa', () => {
    expect(() => simulateFee({ saleCents: -1, chargedBps: 800, acquiringMdrBps: 280 })).toThrow();
  });
});
