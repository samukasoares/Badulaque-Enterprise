<template>
    <div class="barraOpcoes">
        <button @click="showModal = true">Novo Opcional</button>
        <div class="group">
        </div>
    </div><br>

    <h4>Espaço</h4>
    <div class="containerCards">

        <div class="card">Sábado</div>
        <div class="card">Sexta-Feira</div>
        <div class="card">Domingo</div>
        <div class="card">Outros</div>

    </div>

    <h4>Opcionais</h4>
    <div class="containerCards">

        <!--
            <div class="card" v-for="(card, id) in filteredCards" :key="id">
            <label>{{ card.name }}</label>
        </div>
        -->

        <div class="card">Espaço da Noiva</div>

    </div>

    <criarOpcional v-if="showModal" @close="showModal = false" />
</template>

<script lang="ts">
import criarOpcional from './popups/criarOpcional.vue'

export default ({
    data() {
        return {
            showModal: false,
        }
    },
    components: { criarOpcional },
})

</script>

<style>
.containerCards {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    height: 200px;
}

.card {
    display: flex;
    flex-direction: column;
    width: 200px;
    padding: 5px;
    height: 35px;
    align-items: center;
    justify-content: center;
    text-align: center;
    border-radius: 5px;
    background-color: #425C4D;
    color: white;
    box-shadow: 2px 2px 1px #888888;
    cursor: pointer;
}

.card label {
    cursor: pointer;
}

.card:hover {
    background-color: #2F4036;
}
</style>