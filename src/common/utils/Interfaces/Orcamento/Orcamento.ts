export interface FormaPagamento {
    idFormaPagamento: number;
    valorSinal: number;
    valorEntrada: number;
    valorParcela: number;
    numeroParcelas: number;
    valorTotal: number;
    numeroParcelasEntrada: number;
    Orcamento_idOrcamento: number;
    tipo: string;
  };
  
interface Opcional {
    idOpcional: number;
    nomeOpcional: string;
    valorAtual: number;
    porPessoa: number;
  };
  
  export interface OrcamentoOpcional {
    Opcional_idOpcional: number;
    Orcamento_idOrcamento: number;
    Opcional: Opcional;
    valorOrcamento: number;
    porPessoa:number;
  };
  
  interface Lead  {
    idLead: number;
    nomeLead: string;
    celular: string;
    email: string;
    cidade: string;
  };
  
  interface Cardapio  {
    idCardapio: number;
    nomeCardapio: string;
    precoCardapio: number;
    linkCardapio: string;
    tipo: string;
  };
  
  interface CardapioBar  {
    idCardapioBar: number;
    nomeCardapioBar: string;
    precoCardapio: number;
  };
  
  interface Cerveja  {
    idCerveja: number;
    nome: string;
    valor: number;
  };
  
  export interface Orcamento  {
    idOrcamento: number;
    referenciaOrcamento: string;
    status: string;
    dataEvento: string; // Date format string
    tipoEvento: string;
    numConvidados: number;
    fonte: string;
    Cardapio_idCardapio: number;
    Cerveja_idCerveja: number;
    CardapioBar_idCardapioBar: number;
    Lead_idLead: number;
    cerimoniaLocal: number;
    cadeira: string;
    enviado: number;
    createdAt: string; // Date format string
    enviadoEm: string | null; // Nullable date
    observacoesOrcamento: string;
    ValorEspaco_idValorEspaco: number;
    valorPPCardapio: number;
    valorPPBar: number;
    valorEspacoFinal: number;
    FormaPagamento: FormaPagamento[];
    Orcamento_Opcional: OrcamentoOpcional[];
    Lead: Lead;
    Cardapio: Cardapio;
    CardapioBar: CardapioBar;
    Cerveja: Cerveja;
    valorPPCerveja: number;
    valorOpcionais: number,
    valorTotalOrcamento: number
  };

  export interface OrcamentoBasico {
    idOrcamento: number;
    referenciaOrcamento: string;
    createdAt: Date;
    status: string;
    tipoEvento: string;
    enviadoEm: Date | null;
    Lead: {
        nomeLead: string;
        celular: string;
    };
}

export interface AllOrcamentos {
    pendentes: OrcamentoBasico[];
    enviados: OrcamentoBasico[];
    descartados: OrcamentoBasico[];
} 