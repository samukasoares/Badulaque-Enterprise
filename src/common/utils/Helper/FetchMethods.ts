import instance from '@/common/utils/AuthService';
import { CardapioBar } from '../Interfaces/Bardulaque/Registro';
import { Cardapio, Grupo } from '../Interfaces/Buffet/Cardapio';
import { Cerveja } from '../Interfaces/Cerveja/Cerveja';
import { Contrato } from '../Interfaces/Contrato/ContratoTabela';
import { ValorEspaco } from '../Interfaces/Espaco/Espaço';
import { Opcional } from '../Interfaces/Opcional/Opcional';
import { OrcamentoBasico } from '../Interfaces/Orcamento/Orcamento';


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

export async function fetchCidades(id: number): Promise<{ id: number; nome: string }[]> {
  try {
    const response = await instance.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${id}/municipios`);
    return response.data.map((cidade: any) => ({
      id: cidade.id,
      nome: cidade.nome,
    }));
  } catch (error) {
    console.error('Erro ao buscar cidades:', error);
    throw error;
  }
}

export async function fetchEstados(): Promise<{ id: number; nome: string, sigla:string}[]> {
  try {
    const response = await instance.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
    return response.data.map((uf: any) => ({
      id: uf.id,
      nome: uf.nome,
      sigla: uf.sigla
    }));
  } catch (error) {
    console.error('Erro ao buscar estados:', error);
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

export async function fetchValoresEspaco(): Promise<ValorEspaco[]> {
  try {
    const response = await instance.get<ValorEspaco[]>('/espaco/get-all');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar contratos:', error);
    throw error;
  }
}


