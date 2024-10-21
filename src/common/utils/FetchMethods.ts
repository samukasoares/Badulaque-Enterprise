import instance from '@/common/utils/AuthService';
import { Cardapio, CardapioBar, Cerveja, Grupo, Opcional } from './Interfaces';
import { AllOrcamentos, Orcamento, OrcamentoBasico } from './Interfaces/Orcamento';
import { Contrato } from './Interfaces/Contrato/ContratoTabela';

export async function fetchCardapios(): Promise<Cardapio[]> {
  try {
    const response = await instance.get<Cardapio[]>('/buffet/cardapios');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar cardápios:', error);
    throw error;
  }
}

export async function fetchCervejas(): Promise<Cerveja[]> {
  try {
    const response = await instance.get<Cerveja[]>('/cerveja/get-all');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar cervejas:', error);
    throw error;
  }
}

export async function fetchCardapioBar(): Promise<CardapioBar[]> {
  try {
    const response = await instance.get<CardapioBar[]>('/bar/get-all');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar cardápio do bar:', error);
    throw error;
  }
}

export async function fetchCidades(): Promise<{ id: number; nome: string }[]> {
  try {
    const response = await instance.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados/35/municipios');
    return response.data.map((cidade: any) => ({
      id: cidade.id,
      nome: cidade.nome,
    }));
  } catch (error) {
    console.error('Erro ao buscar cidades:', error);
    throw error;
  }
}

export async function fetchOpcionais(): Promise<Opcional[]> {
  try {
    const response = await instance.get<Opcional[]>('/opcional/get-all');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar opcionais:', error);
    throw error;
  }
}

export async function fetchGrupos(): Promise<Grupo[]> {
  try {
    const response = await instance.get<Grupo[]>('/buffet/grupos');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar grupos:', error);
    throw error;
  }
}

export async function fetchOrcamentosEnviados(): Promise<OrcamentoBasico[]> {
  try {
    const response = await instance.get<OrcamentoBasico[]>('/orcamento/get-enviados');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar orçamentos:', error);
    throw error;
  }
}

export async function fetchContratos(): Promise<Contrato[]> {
  try {
    const response = await instance.get<Contrato[]>('/contrato/get-all');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar contratos:', error);
    throw error;
  }
}

