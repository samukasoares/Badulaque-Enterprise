<template>
    <div class="backdrop" @click.self="close">
        <form class="modal-form" @submit.prevent="atualizarGrupo">
            <h4>{{ nomeGrupoAnterior }}</h4><br>
            <label>Id:</label>
            <input type="number" disabled v-model="grupo.idGrupo">

            <label>Novo Nome:</label>
            <input type="text" required v-model="grupo.nomeGrupo">

            <label>Sequência:</label>
            <input type="number" required v-model="grupo.sequencia">

            <button type="submit" class="submit-button">Atualizar</button>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import instance from '@/common/utils/AuthService';
import { Grupo } from '@/common/utils/Interfaces/Buffet/Cardapio';

export default defineComponent({
    props: {
        cardId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            grupo: {} as Grupo,
            loading: false,

            nomeGrupoAnterior: ''
        };
    },
    methods: {
        close() {
            this.$emit('close');
        },

        async fetchGrupoDetails(id: number) {
            this.loading = true;
            try {
                const response = await instance.get<Grupo>('/buffet/grupo/' + id);
                this.grupo = response.data;

                this.nomeGrupoAnterior = response.data.nomeGrupo;
            } catch (error) {
                console.error('Erro ao buscar grupo:', error);
            } finally {
                this.loading = false;
            }
        },


        async atualizarGrupo() {
            const grupoAtualizado: Grupo = {
                idGrupo: this.grupo.idGrupo,
                nomeGrupo: this.grupo.nomeGrupo,
                sequencia: this.grupo.sequencia
            }

            try {
                const data = await instance.post('buffet/grupo/update', grupoAtualizado)
                this.$emit('success', 'Grupo atualizado com sucesso!');
                this.close(); // Fecha o modal após o sucesso
            } catch (error) {
                this.$emit('error', 'Erro ao editar grupo!');
            }
        }


    },

    watch: {
        cardId: {
            immediate: true,
            handler(newId: number) {
                if (newId) {
                    this.fetchGrupoDetails(newId);
                }
            }
        }
    }
});
</script>

<style scoped>
@import '../../../../assets/styles/modal-style.css'
</style>