
// Inicio Interfaces Buffet

export interface Item {
    idItem: number;
    nomeItem: string;
    unidade: string;
    baseReceita: number;
    consumoPorPessoa: number;
    Grupo_idGrupo: number;
}

export interface GroupedItem {
    grupo: string;
    itens: Item[];
}

export type CardapioInfo = {
    cardapio: {
        nome: string,
        preco: number,
        itensAgrupados: GroupedItem,
        grupos: Array<{ nomeGrupo: string, qtdItens: number; }>;
    };
};

export interface Cardapio {
    idCardapio: number,
    nomeCardapio: string,
    precoCardapio: number,
    tipo: string
}

export interface Grupo {
    nomeGrupo: string;
    idGrupo: number;
}

// Registro Cardapio
export interface CardapioGrupos {
    idGrupo: number;
    qtdItens: number;
}

export interface RegistroCardapio {
    nomeCardapio: string,
    precoCardapio: number,
    tipo: string,
    items: number[],
    grupos: CardapioGrupos[],
}

// Fim interfaces Buffet

export interface Card {
    name: string;
    id: number;
}