
// Inicio Interfaces Buffet

export interface Item {
    idItem: number;
    nomeItem: string;
    unidade: string;
    baseReceita: number;
    consumoPorPessoa: number;
    Grupo_idGrupo: number;
}

export interface Grupo {
    nomeGrupo: string;
    idGrupo: number;
}

export interface Cardapio {
    idCardapio: number,
    nomeCardapio: string,
    precoCardapio: number,
    tipo: string
}

export interface Cerveja {
    idCerveja: number,
    nome: string,
    valor: number
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
//Fim registro Cardápio

// Fim interfaces Buffet

//Inicio Interface Bar
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
//Fim Interface Bar


//Inicio Interface Orçamento

export interface RegistroLead {
    nomeLead: string;
    celular: string;
    email: string;
    cidade: string;
}

export interface RegistroOrcamentoData {
    referenciaOrcamento: string,
    cadeira: string | null,
    Cardapio_idCardapio: number,
    Cerveja_idCerveja: number,
    numConvidados: number,
    observacoesOrcamento: string | null,
    dataEvento: string,
    ValorEspaco_idValorEspaco: number,
    valorPPBar: number,
    valorPPCardapio:number,
    tipoEvento: string,
    cerimoniaLocal: number,
    fonte: string,
    CardapioBar_idCardapioBar: number
} 

export interface RegistroOrcamento {
    orcamento: RegistroOrcamentoData,
    opcional: number[],
    lead: RegistroLead;
}

export interface OrcamentoTabela {
    id: number;
    referencia: string;
    cliente: string;
    contato: string;
    tipo: string;
    dataCriacao: string;
    dataEnvio: string;
    status: string;
}

//Fim Interfaces Orcamento
export interface Card {
    name: string;
    id: number;
}

export interface ValorEspaco {
    idValorEspaco: number;
    dia: string | null;
    valor: number | null;
}

export interface Opcional {
    idOpcional:number,
    nomeOpcional:string,
    valorAtual:number
}