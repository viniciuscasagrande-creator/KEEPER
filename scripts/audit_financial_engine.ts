/**
 * KEEPER ERP — SCRIPT DE AUDITORIA FORMAL DO MOTOR FINANCEIRO
 * 
 * Executa verificação matemática e operacional dos 4 pilares auditados:
 * 1. Financeiro Disk (Taxas, Spreads, Splits e Receita Própria)
 * 2. Financeiro dos Produtores (Carteiras, Saldos, Despesas, Repasses e Antecipações)
 * 3. Tesouraria (Segregação dos Três Caixas: Custódia, Caixa Próprio e Reservas)
 * 4. Estornos & Cancelamentos (Cobertura, Déficit, Bloqueios de Repasse e Reversão no Ledger)
 */

import { SettlementService } from '../apps/api/src/financeiro/settlement/settlement.service';

// Mock dependencies for pure standalone service execution
const mockPrisma: any = {};
const mockContabil: any = {};

const settlementService = new SettlementService(mockPrisma, mockContabil);

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FALHA NA AUDITORIA: ${message}`);
    process.exit(1);
  }
  console.log(`  ✅ ${message}`);
}

async function runAudit() {
  console.log('================================================================');
  console.log('🚀 INICIANDO AUDITORIA FORMAL DO MOTOR FINANCEIRO KEEPER ERP');
  console.log('================================================================\n');

  // -------------------------------------------------------------
  // PILAR 1: FINANCEIRO DISK (CLASSIFICAÇÃO AUTOMÁTICA DE TAXAS)
  // -------------------------------------------------------------
  console.log('📌 [PILAR 1] Auditando Financeiro Disk (Splits, Taxas e Apropriação)...');
  
  // Teste 1.1: Split com Taxa de Conveniência (10%) paga pelo cliente
  const split1 = settlementService.simulateSplit({
    ticketAmount: 100.0,
    diskFeeRate: 10.0,
    spreadRate: 0.0,
    advanceRate: 0.0,
    spreadPayer: 'CUSTOMER',
  });
  assert(split1.splitResult.totalCustomerPaid === 110.0, 'Cliente paga R$ 110,00 (R$ 100 ingresso + R$ 10 taxa Disk)');
  assert(split1.splitResult.diskIngressosRevenue === 10.0, 'Receita DiskIngressos é R$ 10,00');
  assert(split1.splitResult.producerNet === 100.0, 'Produtor recebe R$ 100,00 líquido na carteira');

  // Teste 1.2: Split com Spread (2,5%) pago pelo produtor
  const split2 = settlementService.simulateSplit({
    ticketAmount: 200.0,
    diskFeeRate: 10.0,
    spreadRate: 2.5,
    advanceRate: 0.0,
    spreadPayer: 'PRODUCER',
  });
  assert(split2.splitResult.totalCustomerPaid === 220.0, 'Cliente paga R$ 220,00 (R$ 200 + R$ 20 taxa Disk)');
  assert(split2.splitResult.diskIngressosRevenue === 25.0, 'Disk recebe R$ 25,00 (R$ 20 taxa + R$ 5 spread produtor)');
  assert(split2.splitResult.producerNet === 195.0, 'Produtor recebe R$ 195,00 líquido (R$ 200 - R$ 5 spread)');

  // Teste 1.3: Webhook de Venda e Geração de Livro Financeiro
  const saleWebhook = await settlementService.processSaleWebhook('tenant-1', {
    event: 'SALE_APPROVED',
    saleId: 'PED-9901',
    producerId: 'prod-01',
    eventId: 'ev-101',
    grossAmount: 110.0,
    ticketAmount: 100.0,
    fees: 10.0,
    paymentMethod: 'PIX',
    occurredAt: '2026-10-08T10:00:00Z',
  });
  assert(saleWebhook.success === true, 'Webhook de venda processado com sucesso');
  assert(saleWebhook.ledgerEntriesCreated.length === 2, '2 lançamentos imutáveis gerados no FinancialLedger (Venda e Taxa Disk)');
  assert(saleWebhook.status === 'PROCESSED_AND_SETTLED', 'Status liquidado e registrado na Conta de Custódia');
  console.log('✅ [PILAR 1] Aprovado com 100% de conformidade técnica.\n');

  // -------------------------------------------------------------
  // PILAR 2: FINANCEIRO DOS PRODUTORES (CARTEIRAS, DESPESAS E REPASSES)
  // -------------------------------------------------------------
  console.log('📌 [PILAR 2] Auditando Financeiro dos Produtores (Carteiras e Saldos)...');
  
  const producerOverview = await settlementService.getProducerFinancialOverview('tenant-1', 'prod-01');
  assert(producerOverview.producer.id === 'prod-01', 'Produtor ABC Produções identificado');
  assert(producerOverview.events.length === 3, 'Produtor possui 3 eventos parametrizados com regras individuais');
  
  const eventDetail = await settlementService.getEventFinancialDetail('tenant-1', 'ev-101');
  assert(eventDetail.vendasBrutas === 500000.0, 'Vendas brutas apuradas: R$ 500.000,00');
  assert(eventDetail.taxas.totalTaxas === 72000.0, 'Total de taxas Disk/Spread/Advance: R$ 72.000,00');
  assert(eventDetail.despesas.totalDespesas === 100000.0, 'Despesas descontadas do evento (Segurança, Som, Cachê): R$ 100.000,00');
  assert(eventDetail.saldoEconomico === 328000.0, 'Saldo econômico = 500k - 72k taxas - 100k despesas = R$ 328.000,00');
  assert(eventDetail.saldoDisponivel === 148000.0, 'Saldo disponível para repasse = R$ 148.000,00');

  // Trava de Repasse: Não permitir repasse acima do disponível
  let blocked = false;
  try {
    await settlementService.scheduleRepayment('tenant-1', 'prod-01', 'ev-101', {
      amount: 200000.0, // Maior que os 148k disponíveis
      scheduledDate: '2026-10-25',
      destinationBank: 'Itaú Ag 0422 CC 88120-1',
    });
  } catch (err: any) {
    blocked = true;
    assert(err.message.includes('maior que o saldo disponível'), 'Repasse excedente bloqueado por governança');
  }
  assert(blocked === true, 'Trava de segurança financeira impediu repasse a descoberto');

  // Simulação de Antecipação
  const advance = await settlementService.requestAdvance('tenant-1', 'prod-01', 'ev-101', {
    requestedAmount: 100000.0,
    advanceFeeRate: 2.5,
  });
  assert(advance.advance.advanceFeeCost === 2500.0, 'Custo de antecipação de 2,5% calculado: R$ 2.500,00');
  assert(advance.advance.netAmount === 97500.0, 'Líquido liberado ao produtor: R$ 97.500,00');
  console.log('✅ [PILAR 2] Aprovado com 100% de conformidade técnica.\n');

  // -------------------------------------------------------------
  // PILAR 3: TESOURARIA (SEGREGAÇÃO MANDATÓRIA DOS TRÊS CAIXAS)
  // -------------------------------------------------------------
  console.log('📌 [PILAR 3] Auditando Tesouraria (Segregação Patrimonial dos Três Caixas)...');
  
  const clearing = await settlementService.getClearingOverview('tenant-1', 'comp-1');
  const refundsOverview = await settlementService.getRefundsAndCancellationsOverview('tenant-1');
  
  const totalBancos = refundsOverview.kpis.totalEscrowBalance; // R$ 4.250.450,00
  const receitaPropriaDisk = refundsOverview.kpis.totalDiskOwnRevenue; // R$ 425.045,00
  const reservaContingencia = refundsOverview.kpis.totalContingencyReserve; // R$ 637.567,50
  const retencoesObrigacoes = refundsOverview.kpis.totalObligationsReserved; // R$ 390.000,00
  const totalReservasEObrigacoes = reservaContingencia + retencoesObrigacoes; // R$ 1.027.567,50
  const custodiaTerceiros = totalBancos - receitaPropriaDisk - totalReservasEObrigacoes; // R$ 2.797.837,50
  
  assert(totalBancos === 4250450.0, 'Saldo bancário total consolidado apurado: R$ 4.250.450,00');
  assert(receitaPropriaDisk === 425045.0, 'Caixa Próprio da DiskIngressos isolado: R$ 425.045,00 (10% receita de taxas)');
  assert(reservaContingencia === 637567.5, 'Reserva de contingência técnica (15% colchão de estornos): R$ 637.567,50');
  assert(custodiaTerceiros > 0, 'Caixa de custódia exclusivo dos produtores apurado sem contaminação patrimonial');
  console.log('✅ [PILAR 3] Aprovado com 100% de conformidade técnica.\n');

  // -------------------------------------------------------------
  // PILAR 4: ESTORNOS, CANCELAMENTOS E DEFESA DO COMPRADOR
  // -------------------------------------------------------------
  console.log('📌 [PILAR 4] Auditando Cancelamento de Eventos, Estornos e Reversões...');
  
  const cancellationSim = await settlementService.simulateEventCancellation('tenant-1', 'ev-01');
  assert(cancellationSim.totalSales === 200000.0, 'Vendas totais do evento: R$ 200.000,00');
  assert(cancellationSim.totalRefundRequired === 200000.0, 'Devolução integral exigida: R$ 200.000,00');
  assert(cancellationSim.committedTotal === 90000.0, 'Comprometido: R$ 40k teatro pago + R$ 50k repasses produtor = R$ 90.000,00');
  assert(cancellationSim.fundsAvailableAtCancellation === 110000.0, 'Disponível na conta de custódia: R$ 110.000,00');
  assert(cancellationSim.shortfallAmount === 90000.0, 'Insuficiência/Déficit calculado: R$ 90.000,00');
  assert(cancellationSim.coveragePct === 55.0, 'Índice de cobertura exato: 55,00%');
  assert(cancellationSim.shortfallPct === 45.0, 'Índice de insuficiência exato: 45,00%');

  // Registro formal com trava de repasses ativada
  const formalCancellation = await settlementService.registerEventCancellation('tenant-1', {
    eventId: 'ev-01',
    reason: 'Interdição judicial do espaço do evento',
  });
  assert(formalCancellation.cancellation.repaymentsBlocked === true, 'Trava ativada: Repasses aos produtores IMEDIATAMENTE BLOQUEADOS');
  assert(formalCancellation.cancellation.status === 'RECOMPOSITION_PENDING', 'Status: Aguardando Plano de Recomposição de R$ 90.000,00');

  // Execução de lote de estornos com reversão imutável no ledger
  const batchRefunds = await settlementService.executeBatchRefunds('tenant-1', formalCancellation.cancellation.id);
  assert(batchRefunds.refundsExecutedCount === 2, '2 estornos executados no lote com sucesso');
  assert(batchRefunds.ledgerEntriesCreated.every((e: any) => e.entryType === 'ESTORNO'), 'Todos os lançamentos geraram partidas imutáveis ESTORNO no FinancialLedger');
  console.log('✅ [PILAR 4] Aprovado com 100% de conformidade técnica.\n');

  console.log('================================================================');
  console.log('🎉 AUDITORIA CONCLUÍDA: TODOS OS 4 PILARES APROVADOS COM 100% DE ÊXITO!');
  console.log('================================================================');
}

runAudit().catch((err) => {
  console.error('ERRO FATAL NA EXECUÇÃO DA AUDITORIA:', err);
  process.exit(1);
});
