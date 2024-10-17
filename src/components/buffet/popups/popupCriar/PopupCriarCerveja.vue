<template>
    <div class="backdrop" @click.self="close">
        <form class="modal-form">
            <h4>Criar Cerveja</h4><br>
            <label>Nome:</label>
            <input type="text" required v-model='nomeCerveja'>
            <label>Valor:</label>
            <input type="number" required v-model='valorCerveja'>
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
            nomeCerveja: '',
            valorCerveja: ''
        };
    },
    methods: {
        close() {
            this.$emit('close');
        },
        async criarGrupo() {
            try {
                const data = await instance.post('/cerveja/create', {
                    valor: this.valorCerveja,
                    nome: this.nomeCerveja
                });
                window.location.reload()
            } catch (error) {
                alert('Erro ao criar cerveja')
            }
        }
    }
}
);
</script>

<style scoped>
@import '../../../../assets/styles/modal-style.css'
</style>