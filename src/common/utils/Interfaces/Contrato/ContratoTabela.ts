interface Opcional {
    Opcional_idOpcional: number;
    Orcamento_idOrcamento: number;
    valorOrcamento: number;
};

interface FormaPagamento {
    valorTotal: number;
};

interface Lead {
    nomeLead: string;
    celular: string;
};

interface Cardapio {
    nomeCardapio: string;
};

interface Orcamento {
    numConvidados: number;
    dataEvento: string;
    valorEspacoFinal: number;
    valorPPBar: number;
    tipoEvento: string;
    valorPPCardapio: number;
    valorPPCerveja: number;
    Orcamento_Opcional: Opcional[];
    FormaPagamento: FormaPagamento[];
    Lead: Lead;
    Cardapio: Cardapio;
    valorTotalOrcamento: number;
};

export interface Contrato {
    idContrato: number;
    Orcamento_idOrcamento: number;
    observacoes: string;
    valorNF: number;
    assinado: number;
    Orcamento: Orcamento;
};