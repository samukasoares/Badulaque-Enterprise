<template>
    <div class="backdrop" @click.self="close">
        <form class="modal-form">
            <h4>Criar Drink</h4><br>
            <label>Nome:</label>
            <input type="text" required v-model='nomeDrink'>
            <button type="submit" class="submit-button" @click="criarGrupo">Criar</button>
        </form>
    </div>
</template>

<script lang="ts">
import instance from '@/common/utils/AuthService';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'PopupCriarDrink',
    data() {
        return {
            nomeDrink: '',
        };
    },
    methods: {
        close() {
            this.$emit('close');
        },
        async criarGrupo() {
            try {
                const data = await instance.post('/bar/drink/create', {
                    nome: this.nomeDrink
                });
                window.location.reload()
            } catch (error) {
                alert('Erro ao criar drink')
            }
        }
    }
}
);
</script>

<style scoped>
@import '../../../../assets/styles/modal-style.css'
</style>