<template>
    <div class="backdrop" @click.self="close">
        <form class="modal-form">
            <h4>Editar Insumo</h4><br>
            <label>Nome</label>
            <input type="text" required v-model="insumo.descricaoInsumo">
            <label>Unidade</label>
            <select v-model="insumo.unidadeInsumo">
                <option>Gramas</option>
                <option>Mililitros</option>
                <option>Unidades</option>
            </select>
            <label>Fornecedor</label>
            <select v-model="insumo.fornecedor">
                <option value="3GX">3GX</option>
                <option value="Arosa">Arosa</option>
                <option value="Bebidas Bom Preço">Bebidas Bom Preço</option>
                <option value="Birigui">Birigui</option>
                <option value="Bossi">Bossi</option>
                <option value="Dinhana">Dinhana</option>
                <option value="Edsonia">Edsonia</option>
                <option value="Empório Incasa">Empório Incasa</option>
                <option value="Hortifruti">Hortifruti</option>
                <option value="JS Locações">JS Locações</option>
                <option value="Jotace">Jotace</option>
                <option value="Luflan">Luflan</option>
                <option value="Padaria">Padaria</option>
                <option value="Paraty">Paraty Pescados</option>
                <option value="Tenda">Tenda Atacado</option>
            </select>
            <label>Quantidade Embalagem:</label>
            <input type="number" required v-model="insumo.quantidadeEmbalagem">
            <label>Valor Embalagem:</label>
            <input type="number" required v-model="insumo.valorEmbalagem">
            <label>Valor unitário</label>
            <input disabled type="text" required :value="formatarValorMonetarioCusto(insumo.valorUnitario)"
                step="0.0001">
            <label>Perda (%)</label>
            <input type="number" required v-model="insumo.perda">
            <button type="submit" class="submit-button" @click="atualizarInsumo">Atualizar</button>
        </form>
    </div>

</template>

<script lang="ts">
import instance from '@/common/utils/AuthService';
import { formatarValorMonetarioCusto } from '@/common/utils/Helper/Monetario';
import { Insumo } from '@/common/utils/Interfaces/Buffet/Buffet';
import { defineComponent } from 'vue';


export default defineComponent({
    props: {
        cardId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            insumo: {} as Insumo,
            loading: false,

        };
    },
    methods: {
        formatarValorMonetarioCusto,
        close() {
            this.$emit('close');
        },
        async atualizarInsumo() {
            try {
                const data = await instance.post('/buffet/insumo/update', {
                    idInsumo: this.insumo.idInsumo,
                    descricaoInsumo: this.insumo.descricaoInsumo,
                    unidadeInsumo: this.insumo.unidadeInsumo,
                    fornecedor: this.insumo.fornecedor,
                    quantidadeEmbalagem: this.insumo.quantidadeEmbalagem,
                    valorEmbalagem: this.insumo.valorEmbalagem,
                    perda: this.insumo.perda,
                    valorUnitario: this.insumo.valorUnitario
                });
                this.$emit('success', 'Insumo atualizado com sucesso!');
                this.close(); // Fecha o modal após o sucesso
            } catch (error) {
                alert('Erro ao atualizar insumo!')
            }
        },

        async fetchInsumoDetails(id: number) {
            this.loading = true;
            try {
                const response = await instance.get<Insumo>('/buffet/insumo/' + id);
                this.insumo = response.data;

            } catch (error) {
                console.error('Erro ao buscar insumo:', error);
            } finally {
                this.loading = false;
            }
        },

        calcularValorUnitario() {
            if (this.insumo.quantidadeEmbalagem && this.insumo.valorEmbalagem) {
                this.insumo.valorUnitario = parseFloat(
                    (this.insumo.valorEmbalagem / this.insumo.quantidadeEmbalagem).toFixed(4)
                );
            } else {
                this.insumo.valorUnitario = 0;
            }
        }
    },
    watch: {
        'insumo.quantidadeEmbalagem'(newVal, oldVal) {
            this.calcularValorUnitario();
        },
        'insumo.valorEmbalagem'(newVal, oldVal) {
            this.calcularValorUnitario();
        },
        cardId: {
            immediate: true,
            handler(newId: number) {
                if (newId) {
                    this.fetchInsumoDetails(newId);
                }
            }
        }

    },
}
);
</script>

<style scoped>
@import '../../../../assets/styles/modal-style.css'
</style>