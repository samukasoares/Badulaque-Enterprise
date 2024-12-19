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
            <label>Custo Total Por Pessoa:</label>
            <input type="text" disabled :value="formatarValorMonetario(custoTotal)">

            <div class="form-group">
                <div class="form-item">
                    <button type="submit" class="submit-button" @click="salvarCardapio">Salvar</button>
                </div>
                <div class="form-item">
                    <button type="submit" class="submit-button">Visualizar Lista de Compras</button>
                </div>
            </div>


        </form>
    </div>
</template>

<script lang="ts">
import instance from '@/common/utils/AuthService';
import { formatarValorMonetario } from '@/common/utils/Helper';
import { Item } from '@/common/utils/Interfaces';
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        contratoId: {
            type: Number,
            required: false,
        },
    },
    data() {
        return {
            itens: [] as Item[],
            itensEscolhidos: [] as Item[]
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