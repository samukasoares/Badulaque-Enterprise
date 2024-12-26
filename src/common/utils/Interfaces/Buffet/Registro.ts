// Registro Cardapio
export interface CardapioGrupos {
    idGrupo: number;
    qtdItens: number;
}

export interface RegistroCardapio {
    nomeCardapio: string,
    precoCardapio: number,
    tipo: string,
    linkCardapio: string
    items: number[],
    grupos: CardapioGrupos[],
}

export interface UpdateCardapio {
    idCardapio: number,
    nomeCardapio: string,
    precoCardapio: number,
    tipo: string,
    linkCardapio: string
    items: number[],
    grupos: CardapioGrupos[],
}