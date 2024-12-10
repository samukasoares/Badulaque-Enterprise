import { CardapioGrupos } from "../../Interfaces";

export interface UpdateCardapio {
    idCardapio: number,
    nomeCardapio: string,
    precoCardapio: number,
    tipo: string,
    linkCardapio: string
    items: number[],
    grupos: CardapioGrupos[],
}