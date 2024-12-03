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