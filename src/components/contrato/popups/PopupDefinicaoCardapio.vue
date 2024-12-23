<template>
    <div class="backdrop" @click.self="fechar">
        <form class="modal-form">
            <h4>Definir Cardápio</h4><br>

            <div v-for="(item, index) in itensEscolhidos" :key="index">
                <div class="form-group">
                    <div class="form-item">
                        <label>Item:</label> <button type="button" @click="removerItem(index)"
                            class="botao-remover">Remover</button>

                        <select v-model="item.idItem" @change="atualizarCusto(index)" required>
                            <option v-for="item in itens" :key="item.idItem" :value="item.idItem">
                                {{ item.nomeItem }}
                            </option>
                        </select>

                    </div>
                    <div class="form-item">
                        <label>Custo:</label>
                        <input type="text" disabled :value="formatarValorMonetario(item.custo)">
                    </div>
                </div>
            </div>
            <button type="button" @click="adicionarItem">+</button><br>

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
                    <button type="submit" class="submit-button" @click="visualizarListaDeCompras">Visualizar Lista de
                        Compras</button>
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
import { formatarValorMonetario } from '@/common/utils/Helper';
import { formatarData } from '@/common/utils/Helper/Data';
import { Item } from '@/common/utils/Interfaces';
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
                if (!Array.isArray(response.data) || response.data.length === 0) {
                    throw new Error('Dados de compras não encontrados ou estão no formato errado.');
                }

                // Obter o template HTML
                const templatePath = '/template-listacompras.html'; // Caminho do arquivo HTML
                const responseTemplate = await fetch(templatePath);
                let template = await responseTemplate.text();

                // Processar os dados de insumos para gerar o conteúdo HTML
                const insumosHtml = response.data.map((insumo: any) => {
                    return `
                    <div class="insumo">
                    <h4>${insumo.nome}</h4>
                        <p>Quantidade: <strong>${insumo.quantidadeFormatada}</strong></p>
                        <p>Embalagens: <strong>${insumo.embalagensNecessarias}</strong> embalagens de ${insumo.embalagemFormatada}</p>
                        <p>Custo Previsto: <strong>${insumo.custoFormatado}</strong></p>
                    <hr>
                    </div>
                    `;
                }).join('');

                const dataFormatada = this.dataContrato ? formatarData(this.dataContrato) : 'Data não disponível';
                // Substituir a tag {{grupos}} no template pelo HTML gerado com os insumos
                template = template
                    .replace('{{grupos}}', insumosHtml)
                    .replace('{{dataContrato}}', dataFormatada)
                    .replace('{{numConvidados}}', this.convidados.toString());

                // Gerar o PDF com o template preenchido
                await gerarPDFDoHtml(template, `Lista de Compras - Evento ${dataFormatada}`);
            } catch (error) {
                console.error('Erro ao gerar a lista de compras:', error);
                this.$emit('error', 'Erro ao gerar a lista de compras.');
            }
        }
    },
    mounted() {
        this.fetchItens()
        this.fetchCardapioDefinido()
    },

    computed: {
        custoTotal(): number {
            return this.itensEscolhidos.reduce((total, item) => total + item.custo, 0);
        },
    },
});
</script>

<style scoped></style>