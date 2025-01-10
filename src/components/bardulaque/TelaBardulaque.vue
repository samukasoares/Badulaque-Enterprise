<template>
    <div class="barraOpcoes">
        <button @click="showModal = true">Novo</button>
        <div class="group">
            <label>Visualizando:</label>
            <select v-model="opcoes" @change="fetchData">
                <option>Cardápios</option>
                <option>Drinks</option>
            </select>
        </div>
        <input type="text" placeholder="Pesquisar..." v-model="searchText">
    </div><br>

    <!--Container para os cards-->
    <div class="containerCards" v-if="opcoes">
        <div class="card" v-for="(card, id) in filteredCards" :key="id">
            <label>{{ card.name }}</label>
        </div>
    </div>

    <!--Componente Popup de Criar Cardapios, Itens ou Grupos-->
    <component :is="getPopupComponent" v-if="showModal" @close="showModal = false" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import instance from '@/common/utils/AuthService';
import PopupCriarCardapioBar from './popups/PopupCriar/PopupCriarCardapioBar.vue';
import PopupCriarDrink from './popups/PopupCriar/PopupCriarDrink.vue'
import { CardapioBar, Drink } from '@/common/utils/Interfaces/Bardulaque/Registro';
import { Card } from '@/common/utils/Interfaces/Helper';


export default defineComponent({
    data() {
        return {
            opcoes: localStorage.getItem('selectedOptionBar'),
            showModal: false,
            cards: [] as Card[],
            searchText: ''
        }
    },
    components: { PopupCriarCardapioBar, PopupCriarDrink },
    computed: {
        getPopupComponent() {
            if (this.opcoes === 'Cardápios') {
                return 'PopupCriarCardapioBar';
            } else if (this.opcoes === 'Drinks') {
                return 'PopupCriarDrink';
            } else {
                return null;
            }
        },
        filteredCards(): Card[] {
            return this.cards.filter(card => card.name.toLowerCase().includes(this.searchText.toLowerCase()));
        }
    },
    methods: {
        async fetchData() {
            try {
                let response;
                if (this.opcoes === 'Cardápios') {
                    response = await instance.get<CardapioBar[]>('/bar/get-all');
                    this.cards = response.data.map((cardapioBar: CardapioBar) => ({ name: cardapioBar.nomeCardapioBar, id: cardapioBar.idCardapioBar, grupo: null }))
                } else if (this.opcoes === 'Drinks') {
                    response = await instance.get<Drink[]>('/bar/drink/get-all');
                    this.cards = response.data.map((drink: Drink) => ({ name: drink.nome, id: drink.idDrink, grupo: null }))
                }
            } catch (error) {
                this.handleError(error);
            }
        },
        handleError(error: unknown) {
            if (axios.isAxiosError(error)) {
                console.log(error.response?.data || error.message);
            } else {
                console.log(String(error));
            }
        },
    },
    watch: {
        opcoes(newVal) {
            localStorage.setItem('selectedOptionBar', newVal);
        }
    },
    mounted() {
        this.fetchData();
    }
})
</script>
