import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { GenerateCnabRemessaDto, ParseCnabRetornoDto, CnabPaymentItemDto } from './cnab.dto';

@Injectable()
export class CnabService {
  private readonly logger = new Logger(CnabService.name);

  // Informações bancárias padrão da emissora (DiskIngressos Serviços de Bilheteria Ltda)
  private readonly defaultCompanyBank = {
    bankCode: '341',
    bankName: 'BANCO ITAU S.A.',
    agency: '0422',
    account: '099012',
    accountDigit: '3',
    companyName: 'DISKINGRESSOS SERVICOS DE BILHETERIA LTDA',
    cnpj: '08123456000190',
  };

  /**
   * Utilitários de formatação de campos de tamanho fixo
   */
  private padLeft(value: string | number, length: number, char = '0'): string {
    const str = String(value || '');
    return str.slice(0, length).padStart(length, char);
  }

  private padRight(value: string | number, length: number, char = ' '): string {
    const str = String(value || '').toUpperCase();
    return str.slice(0, length).padEnd(length, char);
  }

  private cleanDoc(doc: string): string {
    return (doc || '').replace(/\D/g, '');
  }

  private formatDateYYYYMMDD(date?: string): string {
    const d = date ? new Date(date) : new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
  }

  private formatDateDDMMAAAA(date?: string): string {
    const d = date ? new Date(date) : new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${dd}${mm}${yyyy}`;
  }

  private formatAmountCents(amount: number, length: number): string {
    const cents = Math.round(Number(amount) * 100);
    return this.padLeft(cents, length, '0');
  }

  /**
   * Geração de Arquivo de Remessa Bancária (CNAB 240 ou CNAB 400)
   */
  async generateRemessa(
    tenantId: string,
    companyId: string,
    dto: GenerateCnabRemessaDto,
  ) {
    this.logger.log(
      `Gerando arquivo de Remessa ${dto.layout} (Banco ${dto.bankCode}) para ${dto.items.length} itens (Tenant: ${tenantId})`,
    );

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('A lista de pagamentos para a remessa não pode estar vazia.');
    }

    if (dto.layout === 'CNAB240') {
      return this.buildCnab240Remessa(dto);
    } else {
      return this.buildCnab400Remessa(dto);
    }
  }

  /**
   * Construção do Layout CNAB 240 (Padrão FEBRABAN para Pagamentos / Repasses)
   */
  private buildCnab240Remessa(dto: GenerateCnabRemessaDto) {
    const bankCode = this.padLeft(dto.bankCode, 3, '0');
    const seq = dto.sequenceNumber || 101;
    const dateNow = this.formatDateDDMMAAAA();
    const timeNow = new Date().toTimeString().slice(0, 8).replace(/:/g, '');

    const lines: string[] = [];

    // 1. HEADER DE ARQUIVO (Registro 0, 240 posições)
    let headerFile = '';
    headerFile += bankCode; // 001 a 003: Código do Banco
    headerFile += '0000'; // 004 a 007: Lote de Serviço (0000 para arquivo)
    headerFile += '0'; // 008 a 008: Tipo de Registro (0 = Header de Arquivo)
    headerFile += this.padRight('', 9, ' '); // 009 a 017: Uso Febraban
    headerFile += '2'; // 018 a 018: Tipo Inscrição Empresa (2 = CNPJ)
    headerFile += this.padLeft(this.cleanDoc(this.defaultCompanyBank.cnpj), 14, '0'); // 019 a 032: CNPJ
    headerFile += this.padRight('', 20, ' '); // 033 a 052: Convênio / Código no Banco
    headerFile += this.padLeft(this.defaultCompanyBank.agency, 5, '0'); // 053 a 057: Agência
    headerFile += ' '; // 058 a 058: DV Agência
    headerFile += this.padLeft(this.defaultCompanyBank.account, 12, '0'); // 059 a 070: Conta Corrente
    headerFile += this.padRight(this.defaultCompanyBank.accountDigit, 1, ' '); // 071 a 071: DV Conta
    headerFile += ' '; // 072 a 072: DV Ag/Conta
    headerFile += this.padRight(this.defaultCompanyBank.companyName, 30, ' '); // 073 a 102: Nome da Empresa
    headerFile += this.padRight(this.defaultCompanyBank.bankName, 30, ' '); // 103 a 132: Nome do Banco
    headerFile += this.padRight('', 10, ' '); // 133 a 142: Uso Febraban
    headerFile += '1'; // 143 a 143: Código Remessa (1 = Remessa)
    headerFile += dateNow; // 144 a 151: Data de Geração DDMMAAAA
    headerFile += timeNow; // 152 a 157: Hora de Geração HHMMSS
    headerFile += this.padLeft(seq, 6, '0'); // 158 a 163: Sequência do Arquivo
    headerFile += '084'; // 164 a 166: Versão do Layout Febraban
    headerFile += this.padLeft(0, 5, '0'); // 167 a 171: Densidade de gravação
    headerFile += this.padRight('', 69, ' '); // 172 a 240: Reservado Banco/Empresa
    lines.push(headerFile.slice(0, 240));

    // 2. HEADER DE LOTE (Registro 1, Serviço 20 = Pagamento a Fornecedores / Repasses)
    let headerLote = '';
    headerLote += bankCode; // 001 a 003
    headerLote += '0001'; // 004 a 007: Lote 1
    headerLote += '1'; // 008 a 008: Tipo de Registro (1 = Header de Lote)
    headerLote += 'C'; // 009 a 009: Tipo de Operação (C = Lançamento a Crédito)
    headerLote += '20'; // 010 a 011: Tipo de Serviço (20 = Pagamento Fornecedores/Repasse)
    headerLote += '45'; // 012 a 013: Forma de Lançamento (45 = PIX Transferência / 01 = TED)
    headerLote += '042'; // 014 a 016: Versão do Layout do Lote
    headerLote += ' '; // 017 a 017: Reservado
    headerLote += '2'; // 018 a 018: Inscrição 2 = CNPJ
    headerLote += this.padLeft(this.cleanDoc(this.defaultCompanyBank.cnpj), 14, '0'); // 019 a 032
    headerLote += this.padRight('KEEPER-CONV-01', 20, ' '); // 033 a 052: Convênio
    headerLote += this.padLeft(this.defaultCompanyBank.agency, 5, '0'); // 053 a 057
    headerLote += ' '; // 058 a 058
    headerLote += this.padLeft(this.defaultCompanyBank.account, 12, '0'); // 059 a 070
    headerLote += this.padRight(this.defaultCompanyBank.accountDigit, 1, ' '); // 071 a 071
    headerLote += ' '; // 072 a 072
    headerLote += this.padRight(this.defaultCompanyBank.companyName, 30, ' '); // 073 a 102
    headerLote += this.padRight('REPASSE BILHETERIA DISK', 40, ' '); // 103 a 142: Informação de finalidade
    headerLote += this.padRight('RUA DR MURICY 750', 30, ' '); // 143 a 172: Endereço
    headerLote += this.padLeft(80020, 5, '0'); // 173 a 177: CEP
    headerLote += '040'; // 178 a 180: Sufixo CEP
    headerLote += this.padRight('CURITIBA', 20, ' '); // 181 a 200: Cidade
    headerLote += 'PR'; // 201 a 202: UF
    headerLote += this.padRight('', 38, ' '); // 203 a 240: Reservado
    lines.push(headerLote.slice(0, 240));

    // 3. DETALHES - SEGMENTO A & B PARA CADA PAGAMENTO
    let recordNumberInLote = 0;
    let totalBatchAmount = 0;

    dto.items.forEach((item, index) => {
      totalBatchAmount += item.amount;

      // --- SEGMENTO A (Dados do Pagamento Bancário) ---
      recordNumberInLote++;
      let segA = '';
      segA += bankCode; // 001 a 003
      segA += '0001'; // 004 a 007: Lote 1
      segA += '3'; // 008 a 008: Detalhe
      segA += this.padLeft(recordNumberInLote, 5, '0'); // 009 a 013: Sequência no Lote
      segA += 'A'; // 014 a 014: Segmento A
      segA += '0'; // 015 a 015: Tipo Movimento (0 = Inclusão)
      segA += '00'; // 016 a 017: Código Instrução (00 = Inclusão de Registro Liberado)
      segA += this.padLeft(item.bankCode || '341', 3, '0'); // 018 a 020: Banco Favorecido
      segA += this.padLeft(item.agency || '0001', 5, '0'); // 021 a 025: Agência Favorecido
      segA += ' '; // 026 a 026: DV Agência
      segA += this.padLeft(item.account || '000000', 12, '0'); // 027 a 038: Conta Favorecido
      segA += this.padRight(item.accountDigit || '0', 1, ' '); // 039 a 039: DV Conta
      segA += ' '; // 040 a 040: DV Ag/Conta
      segA += this.padRight(item.beneficiaryName, 30, ' '); // 041 a 070: Nome Favorecido
      segA += this.padRight(item.documentNumber || `REP-${index + 1}`, 20, ' '); // 071 a 090: Seu Número
      segA += this.formatDateDDMMAAAA(item.paymentDate); // 091 a 098: Data Pagamento DDMMAAAA
      segA += 'BRL'; // 099 a 101: Moeda
      segA += this.padLeft(0, 15, '0'); // 102 a 116: Qtd Moeda
      segA += this.formatAmountCents(item.amount, 15); // 117 a 131: Valor do Pagamento (13 inteiros, 2 decimais)
      segA += this.padRight('', 20, ' '); // 132 a 151: Nosso Número atribuído pelo banco
      segA += this.padLeft(0, 8, '0'); // 152 a 159: Data Real Efetivação
      segA += this.padLeft(0, 15, '0'); // 160 a 174: Valor Real Pago
      segA += this.padRight(item.id, 40, ' '); // 175 a 214: Finalidade / ID Sistema ERP
      segA += this.padRight('', 10, ' '); // 215 a 224: Reservado
      segA += '0'; // 225 a 225: Aviso ao Favorecido (0 = Não emite)
      segA += this.padRight('', 15, ' '); // 226 a 240: Ocorrências de Retorno
      lines.push(segA.slice(0, 240));

      // --- SEGMENTO B (Chave PIX e Documento do Beneficiário) ---
      recordNumberInLote++;
      const docClean = this.cleanDoc(item.beneficiaryDocument);
      const isCnpj = docClean.length > 11;
      let segB = '';
      segB += bankCode; // 001 a 003
      segB += '0001'; // 004 a 007
      segB += '3'; // 008 a 008
      segB += this.padLeft(recordNumberInLote, 5, '0'); // 009 a 013
      segB += 'B'; // 014 a 014: Segmento B
      segB += this.padRight('', 3, ' '); // 015 a 017: Reservado
      segB += isCnpj ? '2' : '1'; // 018 a 018: Inscrição Favorecido (1=CPF, 2=CNPJ)
      segB += this.padLeft(docClean, 14, '0'); // 019 a 032: CPF/CNPJ Favorecido
      segB += this.padRight(item.pixKey || 'CHAVE-PIX-PADRAO', 60, ' '); // 033 a 092: Chave PIX ou Endereço
      segB += this.padLeft(0, 15, '0'); // 093 a 107: Abatimento
      segB += this.padLeft(0, 15, '0'); // 108 a 122: Desconto
      segB += this.padLeft(0, 15, '0'); // 123 a 137: Mora
      segB += this.padLeft(0, 15, '0'); // 138 a 152: Multa
      segB += this.padRight('', 88, ' '); // 153 a 240: Mensagens / Dados Complementares
      lines.push(segB.slice(0, 240));
    });

    // 4. TRAILER DE LOTE (Registro 5)
    const totalLinesInLote = recordNumberInLote + 2; // + Header de lote + Trailer de lote
    let trailerLote = '';
    trailerLote += bankCode; // 001 a 003
    trailerLote += '0001'; // 004 a 007: Lote 1
    trailerLote += '5'; // 008 a 008: Tipo de Registro (5 = Trailer de Lote)
    trailerLote += this.padRight('', 9, ' '); // 009 a 017: Reservado
    trailerLote += this.padLeft(totalLinesInLote, 6, '0'); // 018 a 023: Quantidade Registros do Lote
    trailerLote += this.formatAmountCents(totalBatchAmount, 18); // 024 a 041: Somatório dos Valores
    trailerLote += this.padLeft(0, 18, '0'); // 042 a 059: Somatório Qtd Moedas
    trailerLote += this.padLeft(0, 6, '0'); // 060 a 065: Número do Aviso Débito
    trailerLote += this.padRight('', 165, ' '); // 066 a 230: Reservado
    trailerLote += this.padRight('', 10, ' '); // 231 a 240: Ocorrências
    lines.push(trailerLote.slice(0, 240));

    // 5. TRAILER DE ARQUIVO (Registro 9)
    const totalLinesInFile = lines.length + 1; // + Trailer de arquivo
    let trailerFile = '';
    trailerFile += bankCode; // 001 a 003
    trailerFile += '9999'; // 004 a 007: Lote 9999
    trailerFile += '9'; // 008 a 008: Tipo Registro (9 = Trailer de Arquivo)
    trailerFile += this.padRight('', 9, ' '); // 009 a 017: Reservado
    trailerFile += this.padLeft(1, 6, '0'); // 018 a 023: Qtd de Lotes no Arquivo (1 lote)
    trailerFile += this.padLeft(totalLinesInFile, 6, '0'); // 024 a 029: Total Registros do Arquivo
    trailerFile += this.padLeft(0, 6, '0'); // 030 a 035: Total Contas Conciliação
    trailerFile += this.padRight('', 205, ' '); // 036 a 240: Reservado
    lines.push(trailerFile.slice(0, 240));

    const fileContent = lines.join('\r\n');
    const filename = `REM_${dto.bankCode}_${this.formatDateYYYYMMDD()}_${this.padLeft(seq, 3, '0')}.REM`;

    return {
      success: true,
      layout: 'CNAB240',
      bankCode: dto.bankCode,
      filename,
      totalRecords: totalLinesInFile,
      totalItems: dto.items.length,
      totalAmount: totalBatchAmount,
      fileContent,
      checksum: Buffer.from(fileContent).toString('base64').slice(0, 16),
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Construção do Layout CNAB 400 (Padrão Clássico Bancário)
   */
  private buildCnab400Remessa(dto: GenerateCnabRemessaDto) {
    const bankCode = this.padLeft(dto.bankCode, 3, '0');
    const seq = dto.sequenceNumber || 101;
    const lines: string[] = [];
    const dateDDMMAA = this.formatDateDDMMAAAA().slice(0, 4) + this.formatDateDDMMAAAA().slice(6, 8);

    // 1. HEADER DE ARQUIVO CNAB 400 (400 posições)
    let header = '';
    header += '0'; // 001: Identificação Registro Header
    header += '1'; // 002: Operação (1 = Remessa)
    header += 'REMESSA'; // 003 a 009: Literal Remessa
    header += '01'; // 010 a 011: Código Serviço (01 = Cobrança/Pagamento)
    header += this.padRight('COBRANCA/PAGTO', 15, ' '); // 012 a 026: Literal Serviço
    header += this.padLeft(this.defaultCompanyBank.agency, 4, '0'); // 027 a 030: Agência
    header += '00'; // 031 a 032: Zeros
    header += this.padLeft(this.defaultCompanyBank.account, 5, '0'); // 033 a 037: Conta
    header += this.padRight(this.defaultCompanyBank.accountDigit, 1, ' '); // 038: DV Conta
    header += this.padRight('', 8, ' '); // 039 a 046: Complemento
    header += this.padRight(this.defaultCompanyBank.companyName, 30, ' '); // 047 a 076: Nome Empresa
    header += bankCode; // 077 a 079: Banco
    header += this.padRight(this.defaultCompanyBank.bankName, 15, ' '); // 080 a 094: Nome Banco
    header += dateDDMMAA; // 095 a 100: Data Gravação DDMMAA
    header += this.padRight('', 294, ' '); // 101 a 394: Brancos
    header += this.padLeft(1, 6, '0'); // 395 a 400: Sequencial Registro
    lines.push(header.slice(0, 400));

    // 2. DETALHES DOS TÍTULOS (Registro Tipo 1)
    let totalAmount = 0;
    dto.items.forEach((item, idx) => {
      totalAmount += item.amount;
      const recSeq = idx + 2;
      let det = '';
      det += '1'; // 001: Tipo Registro (1 = Detalhe)
      det += '02'; // 002 a 003: Tipo Inscrição Empresa (02 = CNPJ)
      det += this.padLeft(this.cleanDoc(this.defaultCompanyBank.cnpj), 14, '0'); // 004 a 017
      det += this.padLeft(this.defaultCompanyBank.agency, 4, '0'); // 018 a 021: Agência
      det += '00'; // 022 a 023
      det += this.padLeft(this.defaultCompanyBank.account, 5, '0'); // 024 a 028: Conta
      det += this.padRight(this.defaultCompanyBank.accountDigit, 1, ' '); // 029: DV
      det += this.padRight(item.documentNumber || `DOC-${recSeq}`, 25, ' '); // 030 a 054: Seu Número
      det += this.padLeft(recSeq, 8, '0'); // 055 a 062: Nosso Número
      det += this.padRight('', 45, ' '); // 063 a 107: Complemento
      det += '01'; // 108 a 109: Carteira
      det += '01'; // 110 a 111: Código Ocorrência (01 = Remessa)
      det += this.padRight(item.documentNumber || `TIT-${recSeq}`, 10, ' '); // 112 a 121: Número Título
      det += dateDDMMAA; // 122 a 127: Data Vencimento DDMMAA
      det += this.formatAmountCents(item.amount, 13); // 128 a 140: Valor do Título
      det += bankCode; // 141 a 143: Banco Cobrador
      det += '00000'; // 144 a 148: Agência Cobradora
      det += '01'; // 149 a 150: Espécie do Título
      det += 'N'; // 151: Aceite
      det += dateDDMMAA; // 152 a 157: Data Emissão
      det += '00'; // 158 a 159: Instrução 1
      det += '00'; // 160 a 161: Instrução 2
      det += this.padLeft(0, 13, '0'); // 162 a 174: Juros de Mora
      det += '000000'; // 175 a 180: Data Limite Desconto
      det += this.padLeft(0, 13, '0'); // 181 a 193: Valor Desconto
      det += this.padLeft(0, 13, '0'); // 194 a 206: Valor IOF
      det += this.padLeft(0, 13, '0'); // 207 a 219: Abatimento
      det += '02'; // 220 a 221: Tipo Inscrição Sacado
      det += this.padLeft(this.cleanDoc(item.beneficiaryDocument), 14, '0'); // 222 a 235: Documento Sacado
      det += this.padRight(item.beneficiaryName, 30, ' '); // 236 a 265: Nome Favorecido
      det += this.padRight('', 10, ' '); // 266 a 275: Brancos
      det += this.padRight('AV DR MURICY 750', 40, ' '); // 276 a 315: Endereço
      det += this.padRight('', 12, ' '); // 316 a 327: Bairro
      det += '80020040'; // 328 a 335: CEP
      det += this.padRight('CURITIBA', 15, ' '); // 336 a 350: Cidade
      det += 'PR'; // 351 a 352: UF
      det += this.padRight('', 42, ' '); // 353 a 394: Mensagem / Avalista
      det += this.padLeft(recSeq, 6, '0'); // 395 a 400: Sequencial
      lines.push(det.slice(0, 400));
    });

    // 3. TRAILER CNAB 400 (Registro Tipo 9)
    const finalSeq = lines.length + 1;
    let trailer = '';
    trailer += '9'; // 001: Tipo Registro Trailer
    trailer += this.padRight('', 393, ' '); // 002 a 394: Brancos
    trailer += this.padLeft(finalSeq, 6, '0'); // 395 a 400: Sequencial
    lines.push(trailer.slice(0, 400));

    const fileContent = lines.join('\r\n');
    const filename = `REM400_${dto.bankCode}_${this.formatDateYYYYMMDD()}_${this.padLeft(seq, 3, '0')}.REM`;

    return {
      success: true,
      layout: 'CNAB400',
      bankCode: dto.bankCode,
      filename,
      totalRecords: finalSeq,
      totalItems: dto.items.length,
      totalAmount,
      fileContent,
      checksum: Buffer.from(fileContent).toString('base64').slice(0, 16),
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Processador de Arquivo de Retorno Bancário (CNAB 240 e CNAB 400)
   */
  async parseRetorno(
    tenantId: string,
    companyId: string,
    dto: ParseCnabRetornoDto,
  ) {
    this.logger.log(`Processando arquivo de retorno CNAB para tenant ${tenantId}`);

    if (!dto.fileContent || dto.fileContent.trim().length === 0) {
      throw new BadRequestException('Conteúdo do arquivo de retorno está vazio.');
    }

    const lines = dto.fileContent
      .replace(/\r/g, '')
      .split('\n')
      .map((l) => l.trimEnd())
      .filter((l) => l.length > 0);

    if (lines.length < 2) {
      throw new BadRequestException('Arquivo de retorno inválido: não contém registros suficientes.');
    }

    const firstLineLen = lines[0].length;
    const isCnab240 = firstLineLen >= 230 && firstLineLen <= 250;
    const isCnab400 = firstLineLen >= 390 && firstLineLen <= 410;

    if (!isCnab240 && !isCnab400) {
      this.logger.warn(`Comprimento da primeira linha (${firstLineLen}) não confere com 240 ou 400 caracteres.`);
    }

    const layout = isCnab400 ? 'CNAB400' : 'CNAB240';
    return this.parseCnabLines(lines, layout, dto.bankCode);
  }

  private parseCnabLines(lines: string[], layout: 'CNAB240' | 'CNAB400', bankCodeParam?: string) {
    const headerLine = lines[0];
    let bankCode = bankCodeParam || headerLine.slice(0, 3).trim();
    if (!bankCode || bankCode === '0' || bankCode === '000') {
      bankCode = '341'; // Fallback Itaú
    }

    const entries: any[] = [];
    let settledCount = 0;
    let rejectedCount = 0;
    let pendingCount = 0;
    let settledAmount = 0;
    let rejectedAmount = 0;

    lines.forEach((line, index) => {
      // Pula Header e Trailer
      if (layout === 'CNAB240') {
        const recordType = line.charAt(7); // Posição 8: 0=Header Arq, 1=Header Lote, 3=Detalhe, 5=Trailer Lote, 9=Trailer Arq
        if (recordType !== '3') return;

        const segmentType = line.charAt(13); // Posição 14: Segmento A, B, J, etc.
        if (segmentType === 'A') {
          const documentNumber = line.slice(73, 93).trim();
          const amountCents = parseInt(line.slice(119, 134), 10) || 0;
          const amount = amountCents / 100;
          const occurrenceCode = line.slice(230, 232).trim() || '00';
          const beneficiaryName = line.slice(43, 73).trim();

          const isSettled = occurrenceCode === '00' || occurrenceCode === 'BD';
          const isRejected = occurrenceCode === '03' || occurrenceCode === 'RJ' || occurrenceCode === '10';

          let status = 'SETTLED';
          let message = 'Pagamento efetuado com sucesso pelo banco.';

          if (isRejected) {
            status = 'REJECTED';
            message = `Pagamento rejeitado pelo banco. Código de ocorrência: ${occurrenceCode}`;
            rejectedCount++;
            rejectedAmount += amount;
          } else if (isSettled) {
            status = 'SETTLED';
            settledCount++;
            settledAmount += amount;
          } else {
            status = 'PENDING';
            message = `Em processamento na câmara bancária (Ocorrência ${occurrenceCode}).`;
            pendingCount++;
          }

          entries.push({
            lineNumber: index + 1,
            segment: 'A',
            documentNumber: documentNumber || `PAG-${index}`,
            beneficiaryName: beneficiaryName || 'Favorecido Desconhecido',
            amount,
            occurrenceCode,
            status,
            message,
            paymentDate: new Date().toISOString().split('T')[0],
          });
        }
      } else {
        // CNAB 400 Detalhe (Registro Tipo 1)
        const recordType = line.charAt(0);
        if (recordType === '1') {
          const documentNumber = line.slice(116, 126).trim() || line.slice(37, 62).trim();
          const amountCents = parseInt(line.slice(152, 165), 10) || 0;
          const amount = amountCents / 100;
          const occurrenceCode = line.slice(108, 110).trim() || '02'; // 02 = Entrada Confirmada, 06 = Liquidação

          const isSettled = occurrenceCode === '06' || occurrenceCode === '02';
          const isRejected = occurrenceCode === '03' || occurrenceCode === '15';

          let status = 'SETTLED';
          let message = 'Título baixado/liquidado com sucesso.';

          if (isRejected) {
            status = 'REJECTED';
            message = `Ocorrência de rejeição no banco (Código ${occurrenceCode}).`;
            rejectedCount++;
            rejectedAmount += amount;
          } else if (isSettled) {
            status = 'SETTLED';
            settledCount++;
            settledAmount += amount;
          } else {
            status = 'PENDING';
            pendingCount++;
          }

          entries.push({
            lineNumber: index + 1,
            documentNumber: documentNumber || `TIT-${index}`,
            amount,
            occurrenceCode,
            status,
            message,
            paymentDate: new Date().toISOString().split('T')[0],
          });
        }
      }
    });

    return {
      success: true,
      layout,
      bankCode,
      processedAt: new Date().toISOString(),
      summary: {
        totalLines: lines.length,
        totalEntries: entries.length,
        settledCount,
        rejectedCount,
        pendingCount,
        settledAmount,
        rejectedAmount,
        totalAmount: settledAmount + rejectedAmount,
      },
      entries,
    };
  }
}
