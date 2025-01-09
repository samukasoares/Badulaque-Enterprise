<template>
    <div class="backdrop" @click.self="fechar">
        <form class="modal-form">
            <h4>Ficha Técnica</h4><button type="button" @click="adicionarInsumo" class="add-button">+</button>
            <br />
            <table class="insumos-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Quantidade</th>
                        <th>Valor Total</th>
                        <th>Ação</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(insumo, index) in insumos" :key="index">
                        <td>
                            <select v-model="insumo.insumoId" @change="calcularValorTotal(index)">
                                <option disabled value="">Escolha o insumo...</option>
                                <option v-for="insumo in insumosDisponiveis" :key="insumo.idInsumo"
                                    :value="insumo.idInsumo">
                                    {{ insumo.descricaoInsumo }}
                                </option>
                            </select>
                        </td>
                        <td>
                            <input type="number" v-model.number="insumo.quantidade" placeholder="Quantidade"
                                @input="calcularValorTotal(index)" />
                        </td>
                        <td>
                            <input disabled type="number" v-model.number="insumo.valorTotal"
                                placeholder="Valor Total" />
                        </td>
                        <td>
                            <button type="button" @click="removerInsumo(index)" class="botao-remover">
                                Remover
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <br />
            <label>Custo por pessoa:</label>
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

import { Insumo } from '@/common/utils/Interfaces/Buffet/Buffet';
import { formatarValorMonetarioCusto } from '@/common/utils/Helper/Monetario';

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
        formatarValorMonetarioCusto,
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
                this.insumosDisponiveis = response.data.sort((a, b) => {
                    if (a.descricaoInsumo < b.descricaoInsumo) return -1;
                    if (a.descricaoInsumo > b.descricaoInsumo) return 1;
                    return 0;
                });
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


<style scoped src="vue-multiselect/dist/vue-multiselect.css">
@import '../../../assets/styles/modal-style.css';

.insumos-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1em;
}

.insumos-table th,
.insumos-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

.insumos-table th {
    background-color: #f4f4f4;
}

.botao-remover {
    background-color: red;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
}

.add-button {
    margin-top: 10px;
    background-color: green;
    color: white;
    border: none;
    padding: 8px 15px;
    cursor: pointer;
}
</style>
