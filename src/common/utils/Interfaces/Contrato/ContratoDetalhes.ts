export interface Cliente {
    idCliente: number;
    nome: string;
    rg: string;
    cpf: string;
    rua: string;
    cidade: string;
    numero: string;
    cep: string;
    Contrato_idContrato: number;
}

interface Cardapio {
    nomeCardapio: string;
}

interface Cerveja {
    nome: string;
}

interface Bar {
    nomeCardapioBar: string
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
    porPessoa: number
}

interface Lead {
    idLead: number,
    nomeLead: string,
    celular: string,
    email: string,
    cidade: string
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
    Lead: Lead;
    Cerveja: Cerveja,
    CardapioBar: Bar,
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
    valorTotalOrcamento: number;
    patrocinado: number;
}

export interface Contrato {
    idContrato: number;
    Orcamento_idOrcamento: number;
    observacoes: string;
    valorNF: number;
    assinado: number;
    Cliente: Cliente[];
    Orcamento: Orcamento;
    FormaPagamento_idFormaPagamento:number
}
