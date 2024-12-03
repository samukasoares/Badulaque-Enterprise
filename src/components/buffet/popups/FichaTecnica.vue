<template>
    <div class="backdrop" @click.self="fechar">
        <form class="modal-form">
            <h4>Ficha Técnica</h4><br>
            <div v-for="(insumo, index) in insumos" :key="index" class="insumo-group">

                <label>Nome:</label> <button type="button" @click="removerInsumo(index)"
                    class="botao-remover">Remover</button>

                <select v-model="insumo.insumoId" @change="calcularValorTotal(index)">
                    <option disabled value="">Escolha o insumo...</option>
                    <option v-for="insumo in insumosDisponiveis" :key="insumo.idInsumo" :value="insumo.idInsumo">
                        {{ insumo.descri____oInsumo }}
                    </option>
                </select>

                <div class="form-group">
                    <div class="form-item">
                        <label>Quantidade:</label>
                        <input type="number" v-model.number="insumo.quantidade" placeholder="Quantidade"
                            @input="calcularValorTotal(index)" />
                    </div>
                    <div class="form-item">
                        <label>Valor Total:</label>
                        <input disabled type="number" v-model.number="insumo.valorTotal" placeholder="Valor Total" />
                    </div>
                </div>
            </div>
            <button type="button" @click="adicionarInsumo">+</button><br>
            <label>Custo:</label>
            <input type="number" :value="valorTotalGeral" disabled />

            <div class="form-group">
                <button type="submit" class="submit-button" @click.prevent="salvarFichaTecnica">
                    {{ botaoSalvarOuAtualizar }}
                </button>
                <button type="button" class="submit-button" @click="fechar">Cancelar</button>
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import instance from '@/common/utils/AuthService';
import { InsumoFichaTecnica } from '@/common/utils/Interfaces/Buffet/FichaTecnica';

import { Insumo } from '@/common/utils/Interfaces/Buffet';

export default defineComponent({

    props: {
        itemId: {
            type: Number,
            required: true
        },
        baseReceita: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            insumos: [] as InsumoFichaTecnica[],
            insumosDisponiveis: [] as Insumo[]
        };
    },
    methods: {
        fechar() {
            this.$emit('close');
        },

        adicionarInsumo() {
            this.insumos.push({ insumoId: 0, quantidade: 0, valorTotal: 0 });
        },

        removerInsumo(index: number) {
            this.insumos.splice(index, 1);
        },

        async fetchFichaTecnica() {
            try {
                const response = await instance.get(`/buffet/ficha-tecnica/${this.itemId}`);
                this.insumos = response.data.map((insumo: any) => ({
                    insumoId: insumo.Insumo_idInsumo,
                    quantidade: insumo.quantidade,
                    valorTotal: insumo.valorTotal
                }));
            } catch (error) {
                console.error('Erro ao buscar ficha técnica:', error);
            }
        },

        async fetchInsumos() {
            try {
                let response = await instance.get<Insumo[]>('/buffet/insumos');
                this.insumosDisponiveis = response.data;

            } catch (error) {
                console.error('Erro ao encontrar insumos:', error);
            }
        },

        async salvarFichaTecnica() {
            try {
                const endpoint = this.insumos.length > 0
                    ? '/buffet/ficha-tecnica/update'
                    : '/buffet/ficha-tecnica/create';

                const payload = {
                    itemId: this.itemId,
                    insumos: this.insumos,
                    custoTotal: this.valorTotalGeral,
                };

                await instance.post(endpoint, payload);

                const sucessoMensagem = this.insumos.length > 0
                    ? 'Ficha Técnica atualizada com sucesso!'
                    : 'Ficha Técnica salva com sucesso!';

                this.$emit('success', sucessoMensagem);
                this.$emit('update-custo', this.valorTotalGeral); // Emitindo o custo total para o modal pai
                this.fechar();
            } catch (error) {
                this.$emit('error', 'Erro ao salvar ou atualizar ficha técnica!');
            }
        },

        calcularValorTotal(index: number) {
            const insumoSelecionado = this.insumos[index];

            if (!insumoSelecionado.insumoId || !insumoSelecionado.quantidade) {
                insumoSelecionado.valorTotal = 0;
                return;
            }

            const insumoInfo = this.insumosDisponiveis.find(
                (insumo) => insumo.idInsumo === insumoSelecionado.insumoId
            );

            if (insumoInfo) {
                const perda = insumoInfo.perda || 0;
                const quantAjustada = insumoSelecionado.quantidade / (1 - (perda / 100))
                insumoSelecionado.valorTotal = (insumoInfo.valorUnitario * quantAjustada) / this.baseReceita;
            } else {
                console.error(`Insumo com ID ${insumoSelecionado.insumoId} não encontrado`);
                insumoSelecionado.valorTotal = 0;
            }
        }
    },
    async mounted() {
        await this.fetchFichaTecnica();
        await this.fetchInsumos();
    },
    computed: {
        valorTotalGeral(): number {
            return this.insumos.reduce((total, insumo) => total + insumo.valorTotal, 0);
        },
        botaoSalvarOuAtualizar(): string {
            return this.insumos.length > 0 ? 'Atualizar' : 'Salvar';
        },
    },
});
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style scoped>
@import '../../../assets/styles/modal-style.css';
</style>
