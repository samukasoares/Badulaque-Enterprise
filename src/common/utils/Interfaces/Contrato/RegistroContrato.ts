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