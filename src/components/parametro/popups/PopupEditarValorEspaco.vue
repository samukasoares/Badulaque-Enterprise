<template>
    <div class="backdrop" @click.self="close">
        <form class="modal-form" @submit.prevent="atualizarEspaco">
            <h4>{{ espaco.dia }}</h4><br>
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

            <label>Valor:</label>
            <input type="number" required v-model="espaco.valor">


            <button type="submit" class="submit-button">Atualizar</button>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import instance from '@/common/utils/AuthService';
import { Reajuste } from '@/common/utils/Interfaces/Helper';
import { ValorEspaco } from '@/common/utils/Interfaces/Espaco/Espaço';
import { formatarValorMonetario } from '@/common/utils/Helper/Monetario';

export default defineComponent({
    props: {
        cardId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            espaco: {} as ValorEspaco,
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

        async fetchEspacoDetails(id: number) {
            this.loading = true;
            try {
                const response = await instance.get<ValorEspaco>('/espaco/get/' + id);
                this.espaco = response.data;

            } catch (error) {
                console.error('Erro ao buscar dia da semana:', error);
            } finally {
                this.loading = false;
            }
        },

        async fetchValoresEspaco(id: number) {
            try {
                const response = await instance.get<Reajuste>('espaco/reajuste/' + id);
                this.reajuste = response.data;
            } catch (error) {
                console.error('Erro ao buscar reajustes do espaço:', error);
            } finally {
                this.loading = false;
            }
        },

        async atualizarEspaco() {
            const valorEspacotualizado: ValorEspaco = {
                idValorEspaco: this.espaco.idValorEspaco,
                dia: this.espaco.dia,
                valor: this.espaco.valor
            }

            try {
                const data = await instance.post('espaco/update', valorEspacotualizado)
                this.$emit('success', 'Valor do espaço atualizado com sucesso!');
                this.close(); // Fecha o modal após o sucesso
            } catch (error) {
                this.$emit('error', 'Erro ao atualizar valor do espaço!');
            }
        }


    },

    watch: {
        cardId: {
            immediate: true,
            handler(newId: number) {
                if (newId) {
                    this.fetchEspacoDetails(newId);
                    this.fetchValoresEspaco(newId);
                }
            }
        }
    }
});
</script>

<style scoped>
@import '../../../assets/styles/modal-style.css'
</style>