<template>
    <div class="backdrop" @click.self="close">
        <form class="modal-form">
            <h4>Criar Grupo</h4><br>
            <label>Nome:</label>
            <input type="text" required v-model='nomeGrupo'>
            <button type="submit" class="submit-button" @click="criarGrupo">Criar</button>
        </form>
    </div>

</template>

<script lang="ts">
import instance from '@/common/utils/AuthService';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'PopupOrcamento',
    data() {
        return {
            nomeGrupo: ''
        };
    },
    methods: {
        close() {
            this.$emit('close');
        },
        async criarGrupo() {
            try {
                const data = await instance.post('/buffet/criar-grupo', {
                    nomeGrupo: this.nomeGrupo
                });
                window.location.reload()
            } catch (error) {
                alert('Erro ao criar grupo')
            }
        }
    }
}
);
</script>

<style scoped>
@import '../../../../assets/styles/modal-style.css'
</style>