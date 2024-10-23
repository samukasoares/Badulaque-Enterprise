interface Cliente {
    idCliente: number;
    nome: string;
    rg: string;
    cpf: string;
    rua: string;
    cidade: string;
    cep: string;
    Contrato_idContrato: number;
}

interface Cardapio {
    nomeCardapio: string;
}

interface FormaPagamento {
    idFormaPagamento: number;
    valorSinal: number;
    valorEntrada: number;
    valorParcela: number;
    numeroParcelas: number;
    valorTotal: number;
    numeroParcelasEntrada: number;
    Orcamento_idOrcamento: number;
}

interface Opcional {
    nomeOpcional: string;
}

interface OrcamentoOpcional {
    Opcional_idOpcional: number;
    Orcamento_idOrcamento: number;
    valorOrcamento: number;
    Opcional: Opcional;
}

interface Orcamento {
    idOrcamento: number;
    referenciaOrcamento: string;
    status: string;
    dataEvento: string;
    tipoEvento: string;
    numConvidados: number;
    fonte: string;
    Cardapio_idCardapio: number;
    Cerveja_idCerveja: number;
    CardapioBar_idCardapioBar: number;
    Lead_idLead: number;
    cerimoniaLocal: number;
    cadeira: string;
    enviado: number;
    createdAt: string;
    enviadoEm: string | null;
    observacoesOrcamento: string;
    ValorEspaco_idValorEspaco: number;
    valorPPCardapio: number;
    valorPPBar: number;
    valorEspacoFinal: number;
    valorPPCerveja: number;
    Cardapio: Cardapio;
    FormaPagamento: FormaPagamento[];
    Orcamento_Opcional: OrcamentoOpcional[];
}

export interface Contrato {
    idContrato: number;
    Orcamento_idOrcamento: number;
    observacoes: string;
    valorNF: number;
    assinado: number;
    Cliente: Cliente[];
    Orcamento: Orcamento;
}
