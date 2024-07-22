<template>
    <div class="barraOpcoes">
        <button @click="showModal = true">Novo</button>
        <div class="group">
            <label>Visualizando:</label>
            <select v-model="opcoes" @change="fetchData">
                <option>Cardápios</option>
                <option>Grupos</option>
                <option>Itens</option>
                <option>Produtos</option>
                <option>Bebidas</option>
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
import popupCardapio from './popups/popupCriar/popupCriarCardapio.vue';
import popupGrupo from './popups/popupCriar/popupCriarGrupo.vue'
import popupItem from './popups/popupCriar/popupCriarItem.vue'
import axios from 'axios';
import instance from '@/common/utils/AuthService';
import { Card, Cardapio, Grupo, Item } from '@/common/utils/Interfaces';


export default defineComponent({
    data() {
        return {
            opcoes: localStorage.getItem('selectedOption'),
            showModal: false,
            cards: [] as Card[],
            searchText: ''
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
                    response = await instance.get<Cardapio[]>('/buffet/cardapios');
                    this.cards = response.data.map((cardapio: Cardapio) => ({ name: cardapio.nomeCardapio }))
                } else if (this.opcoes === 'Grupos') {
                    response = await instance.get<Grupo[]>('/buffet/grupos');
                    this.cards = response.data.map((grupo: Grupo) => ({ name: grupo.nomeGrupo }));
                } else if (this.opcoes === 'Itens') {
                    response = await instance.get<Item[]>('/buffet/itens');
                    this.cards = response.data.map((item: Item) => ({ name: item.nomeItem }));
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
        }
    },
    watch: {
        opcoes(newVal) {
            localStorage.setItem('selectedOption', newVal);
        }
    },
    mounted() {
        this.fetchData();
    }
})
</script>

<style scoped>
.containerCards {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    /* Ajuste o valor conforme necessário */
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

input,
select {
    border-radius: 5px;
    padding: 10px;
    border: none;
    font-family: MontSerrat;
}

input:focus {
    outline: none;
    border-color: #2F4036;
    box-shadow: 0 0 10px #2F4036;
}

select:focus {
    outline: none;
    border-color: #2F4036;
    box-shadow: 0 0 10px #2F4036;
}
</style>
