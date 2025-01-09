<template>
    <div class="backdrop" @click.self="close">
        <form class="modal-form">
            <h4>Criar Insumo</h4><br>
            <label>Nome</label>
            <input type="text" required v-model="descricaoInsumo">
            <label>Unidade</label>
            <select v-model="unidadeInsumo">
                <option>Gramas</option>
                <option>Mililitros</option>
                <option>Unidades</option>
            </select>
            <label>Fornecedor</label>
            <select v-model="fornecedor">
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
                <option value="Paraty">Paraty</option>
                <option value="Tenda">Tenda</option>
            </select>
            <label>Quantidade Embalagem:</label>
            <input type="number" required v-model="quantidadeEmbalagem">
            <label>Valor Embalagem:</label>
            <input type="number" required v-model="valorEmbalagem">
            <label>Valor unitário</label>
            <input type="number" disabled required v-model="valorUnitario" step="0.0001">
            <label>Perda (%)</label>
            <input type="number" required v-model="perda">
            <button type="submit" class="submit-button" @click="criarInsumo">Criar</button>
        </form>
    </div>

</template>

<script lang="ts">
import instance from '@/common/utils/AuthService';
import { primeiraLetraMaiscula } from '@/common/utils/Helper/Outros';
import { defineComponent } from 'vue';


export default defineComponent({
    data() {
        return {
            descricaoInsumo: '',
            unidadeInsumo: '',
            fornecedor: '',
            quantidadeEmbalagem: '',
            valorEmbalagem: '',
            valorUnitario: 0,
            perda: '',
        };
    },
    methods: {
        primeiraLetraMaiscula,
        close() {
            this.$emit('close');
        },
        async criarInsumo() {
            try {
                const data = await instance.post('/buffet/insumo/criar-insumo', {
                    descricaoInsumo: this.descricaoInsumo,
                    unidadeInsumo: this.unidadeInsumo,
                    fornecedor: this.fornecedor,
                    quantidadeEmbalagem: this.quantidadeEmbalagem,
                    valorEmbalagem: this.valorEmbalagem,
                    perda: this.perda,
                    valorUnitario: this.valorUnitario
                });
                window.location.reload()
            } catch (error) {
                alert('Erro ao criar insumo!')
            }
        },

        calcularValorUnitario() {
            if (this.quantidadeEmbalagem && this.valorEmbalagem) {
                this.valorUnitario = parseFloat((parseFloat(this.valorEmbalagem) / parseFloat(this.quantidadeEmbalagem)).toFixed(4));
            } else {
                this.valorUnitario = 0;
            }
        },

    },
    watch: {
        descricaoInsumo(newVal) {
            this.descricaoInsumo = primeiraLetraMaiscula(newVal);
        },
        quantidadeEmbalagem(newVal, oldVal) {
            this.calcularValorUnitario();
        },
        valorEmbalagem(newVal, oldVal) {
            this.calcularValorUnitario();
        }
    },
}
);
</script>

<style scoped>
@import '../../../../assets/styles/modal-style.css'
</style>