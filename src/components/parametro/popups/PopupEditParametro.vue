<template>
    <div class="backdrop" @click.self="close">
        <form class="modal-form" @submit.prevent="atualizarParametro">
            <h4>{{ parametro.nomeParametro }}</h4><br>
            <label>Valor:</label>
            <input type="number" required v-model="parametro.valorParametro">


            <button type="submit" class="submit-button">Atualizar</button>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import instance from '@/common/utils/AuthService';
import { formatarValorMonetario } from '@/common/utils/Helper';
import { Parametro } from '@/common/utils/Interfaces/Parametro';

export default defineComponent({
    props: {
        cardId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            parametro: {} as Parametro,
            loading: false,
        };
    },
    methods: {
        formatarValorMonetario,
        close() {
            this.$emit('close');
        },

        async fetchParametroDetails(id: number) {
            this.loading = true;
            try {
                const response = await instance.get<Parametro>('/parametro/get/' + id);
                this.parametro = response.data;

            } catch (error) {
                console.error('Erro ao buscar parametro:', error);
            } finally {
                this.loading = false;
            }
        },


        async atualizarParametro() {
            const parametroAtualizado: Parametro = {
                idParametro: this.parametro.idParametro,
                valorParametro: this.parametro.valorParametro,
                nomeParametro: this.parametro.nomeParametro
            }

            try {
                const data = await instance.post('parametro/update', parametroAtualizado)
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
                    this.fetchParametroDetails(newId);
                }
            }
        }
    }
});
</script>

<style scoped>
@import '../../../assets/styles/modal-style.css'
</style>