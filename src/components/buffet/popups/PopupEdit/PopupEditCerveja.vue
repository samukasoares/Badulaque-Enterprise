<template>
    <div class="backdrop" @click.self="close">
        <form class="modal-form" @submit.prevent="atualizarCerveja">
            <h4>{{ nomeCervejaAnterior }}</h4><br>

            <div class="valores-container">
                <div class="valor-item">
                    <label>{{ currentYear }}:</label>
                    <h4> R$ {{ reajuste.atual }},00</h4>
                </div>
                <div class="valor-item">
                    <label>{{ currentYear + 1 }}:</label>
                    <h4>R$ {{ reajuste.ano1 }},00</h4>
                </div>
                <div class="valor-item">
                    <label>{{ currentYear + 2 }}:</label>
                    <h4>R$ {{ reajuste.ano2 }},00</h4>
                </div>
            </div>

            <label>Id:</label>
            <input type="number" disabled v-model="cerveja.idCerveja">

            <label>Nome:</label>
            <input type="text" required v-model="cerveja.nome">

            <label>Valor:</label>
            <input type="number" required v-model="cerveja.valor">


            <button type="submit" class="submit-button">Atualizar</button>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Cerveja } from '@/common/utils/Interfaces';
import instance from '@/common/utils/AuthService';
import { Reajuste } from '@/common/utils/Interfaces/Helper';
import { formatarValorMonetario } from '@/common/utils/Helper';

export default defineComponent({
    props: {
        cardId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            cerveja: {} as Cerveja,
            loading: false,

            nomeCervejaAnterior: '',

            currentYear: new Date().getFullYear(),
            reajuste: {} as Reajuste
        };
    },
    methods: {
        formatarValorMonetario,
        close() {
            this.$emit('close');
        },

        async fetchCervejaDetails(id: number) {
            this.loading = true;
            try {
                const response = await instance.get<Cerveja>('/cerveja/get/' + id);
                this.cerveja = response.data;

                this.nomeCervejaAnterior = response.data.nome;
            } catch (error) {
                console.error('Erro ao buscar cerveja:', error);
            } finally {
                this.loading = false;
            }
        },

        async fetchValoresCerveja(id: number) {
            try {
                const response = await instance.get<Reajuste>('cerveja/reajuste/' + id);
                this.reajuste = response.data;
            } catch (error) {
                console.error('Erro ao buscar reajustes da cerveja:', error);
            } finally {
                this.loading = false;
            }
        },

        async atualizarCerveja() {
            const cervejaAtualizado: Cerveja = {
                idCerveja: this.cerveja.idCerveja,
                nome: this.cerveja.nome,
                valor: this.cerveja.valor
            }

            try {
                const data = await instance.post('cerveja/update', cervejaAtualizado)
                this.$emit('success', 'Cerveja atualizada com sucesso!');
                this.close(); // Fecha o modal após o sucesso
            } catch (error) {
                this.$emit('error', 'Erro ao atualizar cerveja!');
            }
        }


    },

    watch: {
        cardId: {
            immediate: true,
            handler(newId: number) {
                if (newId) {
                    this.fetchCervejaDetails(newId);
                    this.fetchValoresCerveja(newId);
                }
            }
        }
    }
});
</script>

<style scoped>
@import '../../../../assets/styles/modal-style.css'
</style>