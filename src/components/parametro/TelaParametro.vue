<template>
    <div class="barraOpcoes">
        <button @click="showModal = true">Novo Opcional</button>
        <div class="group">
        </div>
    </div><br>

    <h4>Espaço</h4>
    <div class="containerCards">

        <div v-for="card in cardsDiaSemana" :key="card.id" class="card" @click="modalValorEspaco(card.id, card.name)">
            {{ card.name }}
        </div>

    </div>

    <h4>Opcionais</h4>
    <div class=" containerCards">

        <!--
            <div class="card" v-for="(card, id) in filteredCards" :key="id">
            <label>{{ card.name }}</label>
        </div>
        -->

        <div class="card">Espaço da Noiva</div>

    </div>

    <PopupCriarOpcional v-if="showModal" @close="showModal = false" />
    <PopupEditarValorEspaco v-if="showModalEspaco" @close="showModalEspaco = false" :dia-da-semana="currentCardName"
        :id-dia-da-semana="currentCardID" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PopupCriarOpcional from './popups/PopupCriarOpcional.vue';
import PopupEditarValorEspaco from './popups/PopupEditarValorEspaco.vue';

export default defineComponent({
    components: { PopupCriarOpcional, PopupEditarValorEspaco },
    data() {
        return {
            showModal: false,
            showModalEspaco: false,
            currentCardID: '',
            currentCardName: '',
            cardsDiaSemana: [
                { id: '1', name: 'Sábado' },
                { id: '2', name: 'Sexta-Feira' },
                { id: '3', name: 'Domingo' },
                { id: '4', name: 'Outros' }
            ]
        };
    },
    methods: {
        modalValorEspaco(cardId: string, cardName: string) {
            this.currentCardID = cardId;
            this.currentCardName = cardName;
            this.showModalEspaco = true;
        }
    }
});
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