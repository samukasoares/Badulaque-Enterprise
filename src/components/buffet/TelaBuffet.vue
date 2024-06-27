<template>
    <div class="barraOpcoes">
        <button @click="showModal = true">Novo</button>
        <div class="group">
            <label>Visualizando:</label>
            <select v-model="opcoes">
                <option>Cardápios</option>
                <option>Grupos</option>
                <option>Itens</option>
            </select>
        </div>
        <input type="text" placeholder="Pesquisar...">
    </div><br>

    <h3>{{ opcoes }}</h3>

    <div class="containerCards" v-if="opcoes">
        <div class="card">
            <label>Nome do {{ opcoes }}</label>
        </div>
    </div>

    <component :is="getPopupComponent" v-if="showModal" @close="showModal = false" />

</template>



<script lang="ts">
import { defineComponent } from 'vue';
import popupCardapio from './popups/popupCardapio.vue';
import popupGrupo from './popups/popupGrupo.vue'
import popupItem from './popups/popupItem.vue'

export default defineComponent({
    data() {
        return {
            opcoes: '',
            showModal: false
        }
    },
    components: { popupCardapio, popupGrupo, popupItem },
    computed: {
        getPopupComponent() {
            if (this.opcoes === 'Cardápios') {
                return 'popupCardapio';
            } else if (this.opcoes === 'Grupos') {
                return 'popupGrupo';
            } else if (this.opcoes === 'Itens') {
                return 'popupItem';
            } else {
                return null;
            }
        }
    }
})
</script>

<style scoped>
.containerCards {}

.card {
    display: flex;
    flex-direction: column;
    width: 200px;
    padding: 5px;

    height: 35px;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    background-color: #425C4D;
    color: white;
    box-shadow: 2px 2px 1px #888888;
    cursor: pointer;
}

.card:hover {
    background-color: #2F4036;
}
</style>