import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando Seed do Banco de Dados Keeper ERP...');

  const tenantId = '00000000-0000-0000-0000-000000000001';
  const companyId = '00000000-0000-0000-0000-000000000001';

  // 1. Tenant Padrão
  const tenant = await prisma.tenant.upsert({
    where: { id: tenantId },
    update: {},
    create: {
      id: tenantId,
      name: 'DiskIngressos Corporativo',
      slug: 'diskingressos',
      status: 'ACTIVE',
    },
  });
  console.log(`✅ Tenant criado/verificado: ${tenant.name}`);

  // 2. Empresa Padrão (DiskIngressos Serviços de Bilheteria S.A.)
  const company = await prisma.company.upsert({
    where: { id: companyId },
    update: {},
    create: {
      id: companyId,
      tenantId,
      legalName: 'DiskIngressos Servicos de Bilheteria S.A.',
      tradeName: 'DiskIngressos',
      document: '08123456000190',
      status: 'ACTIVE',
      currency: 'BRL',
    },
  });
  console.log(`✅ Empresa criada/verificada: ${company.tradeName}`);

  // 3. Produtores Parceiros Oficiais
  const prod01 = await prisma.producer.upsert({
    where: { document: '12345678000190' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000101',
      tenantId,
      companyId,
      name: 'ABC Produções & Eventos Ltda',
      tradeName: 'ABC Produções',
      document: '12345678000190',
      code: 'PROD-001',
      status: 'ACTIVE',
      email: 'financeiro@abcproducoes.com.br',
      phone: '(41) 3322-8800',
      bankName: 'Itaú Unibanco S.A. (341)',
      agency: '0422',
      account: '88120-1',
      pixKey: 'financeiro@abcproducoes.com.br',
      defaultDiskFeeRate: 10.0,
      defaultSpreadRate: 2.5,
    },
  });

  const prod02 = await prisma.producer.upsert({
    where: { document: '98765432000111' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000102',
      tenantId,
      companyId,
      name: 'Live Nation Brasil Produções S.A.',
      tradeName: 'Live Nation Brasil',
      document: '98765432000111',
      code: 'PROD-002',
      status: 'ACTIVE',
      email: 'settlement@livenation.com.br',
      phone: '(11) 4003-9000',
      bankName: 'Banco Bradesco S.A. (237)',
      agency: '1024',
      account: '44520-9',
      pixKey: 'pix@livenation.com.br',
      defaultDiskFeeRate: 8.5,
      defaultSpreadRate: 2.2,
    },
  });
  console.log(`✅ Produtores cadastrados: ${prod01.tradeName}, ${prod02.tradeName}`);

  // 4. Carteira de Evento (EventWallet)
  const wallet = await prisma.eventWallet.upsert({
    where: { id: '00000000-0000-0000-0000-000000000201' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000201',
      tenantId,
      companyId,
      eventId: '00000000-0000-0000-0000-000000000301',
      eventName: 'Festival de Primavera 2026 - Pedreira Paulo Leminski',
      producerId: prod01.id,
      producerName: prod01.name,
      grossTicketSales: 890000.0,
      diskFeeTotal: 89000.0,
      spreadFeeTotal: 22250.0,
      advanceFeeTotal: 1250.0,
      expensesTotal: 80000.0,
      repaymentsPaidTotal: 100000.0,
      repaymentsScheduledTotal: 30000.0,
      balanceAvailable: 153000.0,
      blockedBalance: 50000.0,
      projectedBalance: 1240000.0,
      advancesPaidTotal: 50000.0,
      salesTargetAmount: 1000000.0,
      minSalesMilestonePct: 50.0,
      maxReleasePct: 20.0,
      contingencyReservePct: 10.0,
      status: 'OPEN',
    },
  });
  console.log(`✅ Carteira de evento criada: ${wallet.eventName}`);

  console.log('🌱 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
