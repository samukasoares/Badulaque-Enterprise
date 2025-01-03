export interface Item {
    idItem: number;
    nomeItem: string;
    unidade: string;
    baseReceita: number;
    consumoPorPessoa: number;
    Grupo_idGrupo: number;
    custo: number;
}

export interface Grupo {
    nomeGrupo: string;
    idGrupo: number;
    sequencia: number;
}

export interface Cardapio {
    idCardapio: number,
    nomeCardapio: string,
    precoCardapio: number,
    linkCardapio: string,
    tipo: string,
}

export interface GroupedItem {
    grupo: string;
    itens: Item[];
}

export type CardapioInfo = {
    cardapio: {
        id: number,
        nome: string,
        preco: number,
        link:string,
        itensAgrupados: GroupedItem,
        grupos: Array<{ nomeGrupo: string, qtdItens: number, sequencia:number }>;
    };
    custoTotal: number
};





