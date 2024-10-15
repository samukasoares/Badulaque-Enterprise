export interface ReajusteCardapio {
    atual: number,
    ano1: number,
    ano2: number
}

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