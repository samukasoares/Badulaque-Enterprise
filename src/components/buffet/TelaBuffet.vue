<template>
    <div class="barraOpcoes">
        <button>Novo</button>
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
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    data() {
        return {
            opcoes: ''
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