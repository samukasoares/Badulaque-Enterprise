
// Inicio Interfaces Buffet

export interface Item {
    idItem: number;
    nomeItem: string;
    tipo: string;
    preco: number;
    Grupo_idGrupo: number;
    baseReceita: number;
}

export interface Cardapio {
    nomeCardapio: string,
    precoCardapio: number,
    items: string[]
}

export interface Grupo {
    nomeGrupo: string;
    idGrupo: number;
}

// Fim interfaces Buffet