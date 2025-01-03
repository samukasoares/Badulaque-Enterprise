export interface Drink{
    idDrink: number,
    nome: string,
    custo: number,
    valor: number
}

export interface CardapioBar{
    idCardapioBar: number,
    nomeCardapioBar: string,
    precoCardapio: number,
}

export interface RegistroCardapioBar{
    nomeCardapioBar: string,
    precoCardapio: number,
    drinks: number[],
}