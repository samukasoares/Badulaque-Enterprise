
//Inicio Registro Contrato

export interface RegistroContrato {
    assinado: number,
    observacoes: string,
    Orcamento_idOrcamento: number,
    valorNF: number
}


export interface RegistroCliente {
    cep: string,
    cidade: string,
    cpf: string,
    nome: string,
    rg: string
    rua: string,
}

export type ContratoFullData = {
    contrato: RegistroContrato,
    clientes: RegistroCliente[];
};

//Fim Registro Contrato

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
};

export interface Contrato {
    idContrato: number;
    Orcamento_idOrcamento: number;
    observacoes: string;
    valorNF: number;
    assinado: number;
    Orcamento: Orcamento;
};