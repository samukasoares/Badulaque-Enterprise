<template>
    <div class="backdrop" @click.self="close">
        <form class="modal-form">
            <h4>Editar Item</h4><br>
            <label>Nome:</label>
            <input type="text" required v-model="nome">
            <label>Unidade:</label>
            <select v-model="unidade">
                <option>Gramas</option>
                <option>Litros</option>
                <option>Unidades</option>
            </select>
            <label>Consumo Por Pessoa:</label>
            <input type="number" required v-model="consumoPorPessoa">
            <label>Base Receita:</label>
            <input type="number" required v-model="baseReceita">
            <label>Grupo:</label>
            <select v-model="grupo">
                <option v-for="grupo in grupos" :key="grupo.idGrupo" :value="grupo.idGrupo">{{ grupo.nomeGrupo }}
                </option>
            </select>
            <button type="submit" class="submit-button">Salvar</button>
        </form>
    </div>

</template>

<script lang="ts">
import instance from '@/common/utils/AuthService';
import { Grupo } from '@/common/utils/Interfaces';
import { defineComponent } from 'vue';

export default defineComponent({
    data() {
        return {
            grupos: [] as Grupo[],
            nome: '',
            unidade: '',
            baseReceita: '',
            consumoPorPessoa: '',
            grupo: '' as number | string
        };
    },
    methods: {
        close() {
            this.$emit('close');
        },

    },
}
);
</script>

<style scoped>
@import '../../../../assets/styles/modal-style.css'
</style>