<template>
    <div class="backdrop" @click.self="fechar">
        <form class="modal-form">
            <h4>Definir Cardápio</h4>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Custo</th>
                        <th>Ação</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(item, idx) in sortedItensEscolhidos" :key="item.idItem">
                        <!-- cabeçalho de grupo sempre que for o primeiro do grupo -->
                        <tr v-if="idx === 0 || sortedItensEscolhidos[idx - 1].Grupo_idGrupo !== item.Grupo_idGrupo"
                            class="group-header">
                            <td colspan="3">
                                {{grupos.find(g => g.idGrupo === item.Grupo_idGrupo)?.nomeGrupo || 'Sem Grupo'}}
                            </td>
                        </tr>
                        <!-- linha normal do item -->
                        <tr>
                            <td>
                                <select v-model="item.idItem" @change="atualizarCusto(idx)" required>
                                    <option v-for="itemOpcao in itens" :key="itemOpcao.idItem"
                                        :value="itemOpcao.idItem">
                                        {{ itemOpcao.nomeItem }}
                                    </option>
                                </select>
                            </td>
                            <td>
                                <input type="text" disabled :value="formatarValorMonetario(item.custo)">
                            </td>
                            <td>
                                <button type="button" @click="removerItem(idx)" class="botao-remover">
                                    Remover
                                </button>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
            <button type="button" @click="adicionarItem">Adicionar Item</button><br>


            <div class="form-group">
                <div class="form-item">
                    <label>Convidados para Lista de compra:</label>
                    <input type="number" v-model="convidados">
                </div>
                <div class="form-item">
                    <label>Custo Total Por Pessoa:</label>
                    <input type="text" disabled :value="formatarValorMonetario(custoTotal)">
                </div>
            </div>
            <div class="form-group">
                <div class="form-item">
                    <button type="submit" class="submit-button" @click="visualizarListaDeCompras">Lista de
                        Compras</button>
                </div>
                <div class="form-item">
                    <button type="submit" class="submit-button" @click="visualizarFichaTecnica">Ficha Técnica</button>
                </div>
                <div class="form-item">
                    <button type="submit" class="submit-button" @click="salvarCardapio">Salvar</button>
                </div>

            </div>


        </form>
    </div>
</template>

<script lang="ts">
import instance from '@/common/utils/AuthService';
import { formatarData } from '@/common/utils/Helper/Data';
import { fetchGrupos } from '@/common/utils/Helper/FetchMethods';
import { formatarValorMonetario } from '@/common/utils/Helper/Monetario';
import { Insumo } from '@/common/utils/Interfaces/Buffet/Buffet';
import { Grupo, Item } from '@/common/utils/Interfaces/Buffet/Cardapio';
import { gerarPDFDoHtml } from '@/common/utils/pdfService';
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        contratoId: {
            type: Number,
            required: false,
        },
        convidadosContrato: {
            type: Number,
            required: false
        },
        dataContrato: {
            type: String,
            required: false
        }

    },
    data() {
        return {
            itens: [] as Item[],
            itensEscolhidos: [] as Item[],
            convidados: this.convidadosContrato || 0,
            grupos: [] as Grupo[],
        };
    },
    methods: {
        formatarValorMonetario,
        fechar() {
            this.$emit('close');
        },

        async fetchItens() {
            try {
                let response = await instance.get<Item[]>('/buffet/itens');
                this.itens = response.data;
                this.itens = response.data.sort((a, b) => a.nomeItem.localeCompare(b.nomeItem));
            } catch (error) {
                console.error('Erro ao achar itens:', error);
            }
        },
        adicionarItem() {
            this.itensEscolhidos.push({
                idItem: 0,
                nomeItem: "",
                unidade: "",
                baseReceita: 0,
                consumoPorPessoa: 0,
                Grupo_idGrupo: 0,
                custo: 0,
            });
        },

        removerItem(index: number) {
            this.itensEscolhidos.splice(index, 1);
        },

        atualizarCusto(index: number) {
            const idItem = this.itensEscolhidos[index].idItem;
            const itemSelecionado = this.itens.find(item => item.idItem === idItem);
            if (itemSelecionado) {
                this.itensEscolhidos[index].custo = itemSelecionado.custo;
            }
        },

        async salvarCardapio() {
            try {
                // Define o endpoint com base nos itens já definidos
                const endpoint = this.itensEscolhidos.length > 0
                    ? '/contrato/updateItens' // Atualizar itens no cardápio
                    : '/contrato/insertItens'; // Criar novo cardápio

                // Prepara o payload com os itens escolhidos
                const payload = {
                    idContrato: this.contratoId,
                    idItens: this.itensEscolhidos.map(item => item.idItem),
                };

                // Envia a requisição para o backend
                await instance.post(endpoint, payload);

                // Define a mensagem de sucesso com base no tipo de operação
                const sucessoMensagem = this.itensEscolhidos.length > 0
                    ? 'Cardápio atualizado com sucesso!'
                    : 'Cardápio salvo com sucesso!';

                // Emite o evento de sucesso e fecha o modal
                this.$emit('success', sucessoMensagem);
                this.fechar();
            } catch (error) {
                this.$emit('error', 'Erro ao salvar ou atualizar o cardápio!');
            }
        },

        async fetchCardapioDefinido() {
            try {
                const response = await instance.get(`/contrato/itensContrato/${this.contratoId}`);
                this.itensEscolhidos = response.data.map((item: any) => ({
                    idItem: item.Item_idItem,
                    nomeItem: item.Item.nomeItem,
                    unidade: item.Item.unidade,
                    baseReceita: item.Item.baseReceita,
                    consumoPorPessoa: item.Item.consumoPorPessoa,
                    Grupo_idGrupo: item.Item.Grupo_idGrupo,
                    custo: item.Item.custo,
                }));
            } catch (error) {
                console.error('Erro ao buscar ficha técnica:', error);
            }
        },

        async visualizarListaDeCompras() {
            try {
                // Realiza a requisição para obter os dados de compras
                const payload = {
                    idContrato: this.contratoId,
                    numeroConvidados: this.convidados,
                };

                const response = await instance.post('/contrato/lista-de-compras', payload);

                // Verificar se a resposta contém dados válidos
                const listaFinal = response.data.listaFinal;
                const custoTotalGeralFormatado = response.data.custoTotalGeralFormatado;

                // Verificar se a resposta contém dados válidos
                if (!Array.isArray(listaFinal) || listaFinal.length === 0) {
                    throw new Error('Dados de compras não encontrados ou estão no formato errado.');
                }

                // Agrupar os insumos por fornecedor
                const insumosPorFornecedor = listaFinal.reduce((acc: any, insumo: Insumo) => {
                    const fornecedor = insumo.fornecedor || 'Sem Fornecedor'; // Usar 'Sem Fornecedor' caso não exista fornecedor
                    if (!acc[fornecedor]) {
                        acc[fornecedor] = [];
                    }
                    acc[fornecedor].push(insumo);
                    return acc;
                }, {});

                // Gerar o conteúdo HTML para os insumos, separando por fornecedor
                let insumosHtml = '';
                for (const fornecedor in insumosPorFornecedor) {
                    const itensDoFornecedor = insumosPorFornecedor[fornecedor];
                    const tabelaDoFornecedor = itensDoFornecedor
                        .sort((a: any, b: any) => a.nome.localeCompare(b.nome)) // Ordena os insumos por nome
                        .map((insumo: any) => {
                            return `
                        <tr>
                            <td>${insumo.nome}</td>
                            <td>${insumo.quantidadeFormatada}</td>
                            <td>${insumo.embalagensNecessarias} embalagens de ${insumo.embalagemFormatada}</td>
                            <td>${insumo.custoFormatado}</td>
                        </tr>
                    `;
                        })
                        .join('');

                    insumosHtml += `
                <h3>${fornecedor}</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Quantidade</th>
                            <th>Embalagem</th>
                            <th>Custo Previsto</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tabelaDoFornecedor}
                    </tbody>
                </table>
            `;
                }

                const dataFormatada = this.dataContrato ? formatarData(this.dataContrato) : 'Data não disponível';

                // Obter o template HTML
                const templatePath = '/template-listacompras.html'; // Caminho do arquivo HTML
                const responseTemplate = await fetch(templatePath);
                let template = await responseTemplate.text();

                // Substituir a tag {{grupos}} no template pelo HTML gerado com os insumos por fornecedor
                template = template
                    .replace('{{grupos}}', insumosHtml)
                    .replace('{{dataContrato}}', dataFormatada)
                    .replace('{{numConvidados}}', this.convidados.toString())
                    .replace('{{custoGeral}}', custoTotalGeralFormatado)

                // Gerar o PDF com o template preenchido
                await gerarPDFDoHtml(template, `Lista de Compras - Evento ${dataFormatada}`);
            } catch (error) {
                console.error('Erro ao gerar a lista de compras:', error);
                this.$emit('error', 'Erro ao gerar a lista de compras.');
            }
        },


        async visualizarFichaTecnica() {
            try {
                // Requisição ao backend para gerar a ficha técnica
                const payload = {
                    idContrato: this.contratoId,
                    numeroConvidados: this.convidados,
                };
                const response = await instance.post('/contrato/ficha-tecnica', payload);

                // Verificar se a resposta contém dados válidos
                const fichasTecnicas = response.data;

                if (!fichasTecnicas || Object.keys(fichasTecnicas).length === 0) {
                    throw new Error('Dados de ficha técnica não encontrados ou estão no formato errado.');
                }

                // Obter o template HTML
                const templatePath = '/template-fichatecnica.html'; // Caminho do arquivo HTML
                const responseTemplate = await fetch(templatePath);
                let template = await responseTemplate.text();

                // Processar os dados de ficha técnica agrupados por grupo
                const gruposHtml = Object.entries(fichasTecnicas)
                    .map(([grupo, itens]) => {
                        const itensHtml = (itens as any[])
                            .map(item => {
                                const insumosHtml = item.fichaTecnica
                                    .map((insumo: any) => `
                                <p>• ${insumo.nomeInsumo}: <strong>${insumo.quantidade}</strong></p>
                            `)
                                    .join('');
                                return `
                            <div class="item">
                                <h4>${item.nomeItem}</h4>
                                <div>${insumosHtml}</div>
                            </div>
                        `;
                            })
                            .join('');

                        return `
                    <div class="grupo">
                        <h3>${grupo}</h3>
                        <div>${itensHtml}</div>
                    </div>
                `;
                    })
                    .join('');

                const dataFormatada = this.dataContrato ? formatarData(this.dataContrato) : 'Data não disponível';

                // Substituir os placeholders no template
                template = template
                    .replace('{{itens}}', gruposHtml)
                    .replace('{{dataContrato}}', dataFormatada)
                    .replace('{{numConvidados}}', this.convidados.toString());

                // Gerar o PDF com o template preenchido
                await gerarPDFDoHtml(template, `Ficha Técnica - Evento ${dataFormatada}`);
            } catch (error) {
                console.error('Erro ao gerar a ficha técnica:', error);
                this.$emit('error', 'Erro ao gerar a ficha técnica.');
            }
        }

    },
    async mounted() {
        this.grupos = await fetchGrupos()
        this.fetchItens()
        this.fetchCardapioDefinido()
    },

    computed: {
        custoTotal(): number {
            return this.itensEscolhidos.reduce((total, item) => total + item.custo, 0);
        },

        // novo: monta um dicionário idGrupo → sequencia
        groupOrderMap(): Record<number, number> {
            return this.grupos.reduce((map, g) => {
                map[g.idGrupo] = g.sequencia;
                return map;
            }, {} as Record<number, number>);
        },

        // novo: itensEscolhidos ordenados pela sequencia do grupo
        sortedItensEscolhidos(): Item[] {
            const orderMap = this.groupOrderMap;
            return [...this.itensEscolhidos].sort((a, b) => {
                const seqA = orderMap[a.Grupo_idGrupo] ?? Number.MAX_SAFE_INTEGER;
                const seqB = orderMap[b.Grupo_idGrupo] ?? Number.MAX_SAFE_INTEGER;
                return seqA - seqB; // crescente: menor sequencia primeiro
            });
        },

        groupedItens(): { grupo: Grupo; items: Item[] }[] {
            // primeiro, um map pra acumular items por idGrupo
            const map = this.grupos.reduce((acc, g) => {
                acc[g.idGrupo] = { grupo: g, items: [] as Item[] };
                return acc;
            }, {} as Record<number, { grupo: Grupo; items: Item[] }>);

            // distribui cada item em seu grupo
            for (const item of this.itensEscolhidos) {
                const bucket = map[item.Grupo_idGrupo];
                if (bucket) {
                    bucket.items.push(item);
                } else {
                    // se quiser, trate items sem grupo conhecido
                }
            }

            // transforma o map em array e ordena pela sequência do grupo
            return Object.values(map).sort(
                (a, b) => a.grupo.sequencia - b.grupo.sequencia
            );
        }
    },
});
</script>

<style scoped>
.group-header {
    background-color: #425C4D;
    font-weight: bold;
    color: white
}
</style>