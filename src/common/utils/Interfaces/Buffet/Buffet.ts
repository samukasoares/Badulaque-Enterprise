export interface ItemInfo {
    idItem: number;
    nomeItem: string;
    unidade: string;
    consumoPorPessoa: number;
    Grupo_idGrupo: number;
    baseReceita: number;
    custo: number | null;
    valor: number | null;
}

export interface Insumo {
    idInsumo: number;
    descricaoInsumo: string;
    unidadeInsumo: string;
    fornecedor: string;
    quantidadeEmbalagem: number;
    valorEmbalagem: number;
    valorUnitario: number;
    perda: number;
}

export interface ItemTabela {
    idItem: number;
    nomeItem: string;
    unidade: string;
    baseReceita: number;
    consumoPorPessoa: number;
    Grupo_idGrupo: number;
    custo: number;
    Grupo: {
        nomeGrupo: string,
        sequencia: number
    }
}