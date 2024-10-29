//Inicio Registro Contrato

export interface RegistroContrato {
    assinado: number,
    observacoes: string,
    Orcamento_idOrcamento: number,
    valorNF: number,
    FormaPagamento_idFormaPagamento: number;
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
    orcamento: {referenciaOrcamento:string}
};

//Fim Registro Contrato