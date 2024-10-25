import { RegistroLead } from "../../Interfaces";

// Interface para Orcamento
interface OrcamentoFullData {
    idOrcamento: number;
    referenciaOrcamento: string;
    Cardapio_idCardapio: number;
    CardapioBar_idCardapioBar: number;
    Cerveja_idCerveja: number;
    numConvidados: number;
    observacoesOrcamento?: string;
    dataEvento: string;
    ValorEspaco_idValorEspaco: number;
    valorPPBar: number;
    valorPPCardapio: number;
    tipoEvento: string;
    cerimoniaLocal: number;
    fonte: string;
    Lead_idLead: number;
    valorEspacoFinal: number;
    valorOpcionais: number;
    valorPPCerveja: number;
  }
  
  // Interface para UpdateFormaPagamento
  interface UpdateFormaPagamento {
    nParcelas: number;
    type: string;
    valorParcela: number;
    valorSinal: number;
  }
  
  // Interface para UpdateOpcionais
  interface UpdateOpcionais {
    Opcional_idOpcional: number;
    valorOrcamento: number;
  }
  

  // Interface para UpdateOrcamento
  export interface UpdateOrcamento {
    orcamento: OrcamentoFullData;
    formasPagamento: UpdateFormaPagamento[];
    lead: RegistroLead; // Defina RegistroLead conforme o SchemaRegistroLead
    opcionais: UpdateOpcionais[];
  }

  export interface OpcionaisFormatados {
    Opcional_idOpcional: number,
    nomeOpcional: string,
    valor: string
  }