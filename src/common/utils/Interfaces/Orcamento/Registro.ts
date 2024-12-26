import { RegistroLead } from "../Lead/Lead";

export interface RegistroOrcamentoData {
    referenciaOrcamento: string,
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
    CardapioBar_idCardapioBar: number | null,
    patrocinado: number
} 

export interface RegistroOrcamento {
    orcamento: RegistroOrcamentoData,
    opcional: number[],
    lead: RegistroLead;
}