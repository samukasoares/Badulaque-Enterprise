<template>
    <div class="barraOpcoes">
        <button @click="showCreateModal">Novo</button>
        <div class="group">
            <label>Visualizando:</label>
            <select v-model="opcoes" @change="fetchData">
                <option>Cardápios</option>
                <option>Grupos</option>
                <option>Itens</option>
                <option>Cervejas</option>
                <option>Insumos</option>
            </select>
        </div>
        <input type="text" placeholder="Pesquisar..." v-model="searchText">
    </div><br>

    <!--Container para os cards-->
    <div class="containerCards" v-if="opcoes">
        <div class="card" v-for="(card, id) in filteredCards" :key="id" @click="showCard(card.id)">
            <label>{{ card.name }}</label>
        </div>
    </div>

    <!--Componente Popup de Criar Cardapios, Itens ou Grupos-->
    <component :is="getPopupComponent" v-if="showModal" @close="showModal = false" :card-id="selectedCardId"
        @success="handleSuccessMessage" @edit-cardapio="editCardapio" :cardapioData="cardapioData"
        :isEditMode="isEditMode" />

    <NotificationMessage :message="message" />

</template>



<script lang="ts">
import { defineComponent } from 'vue';
import popupCardapio from './popups/popupCriar/popupCriarCardapio.vue';
import popupGrupo from './popups/popupCriar/popupCriarGrupo.vue';
import popupItem from './popups/popupCriar/popupCriarItem.vue'
import popupCerveja from './popups/popupCriar/PopupCriarCerveja.vue';
import popupDetalhesCardapio from '../buffet/popups/PopupDetalhes/PopupDetalhesCardapio.vue'
import popupEditarItem from '../buffet/popups/PopupEdit/PopupEditItem.vue'
import popupEditarGrupo from '../buffet/popups/PopupEdit/PopupEditGrupo.vue'
import popupEditarCerveja from '../buffet/popups/PopupEdit/PopupEditCerveja.vue'
import popupEditarInsumo from '../buffet/popups/PopupEdit/PopupEditInsumo.vue'
import popupInsumo from './popups/popupCriar/popupCriarInsumo.vue'
import NotificationMessage from '@/views/NotificationMessage.vue';
import axios from 'axios';
import instance from '@/common/utils/AuthService';
import { Insumo } from '@/common/utils/Interfaces/Buffet/Buffet';
import { Cardapio, Grupo, Item } from '@/common/utils/Interfaces/Buffet/Cardapio';
import { Cerveja } from '@/common/utils/Interfaces/Cerveja/Cerveja';
import { Card } from '@/common/utils/Interfaces/Helper';


export default defineComponent({
    data() {
        return {
            opcoes: localStorage.getItem('selectedOption'),
            showModal: false,
            cards: [] as Card[],
            searchText: '',
            isViewingDetails: false,
            selectedCardId: null as number | null,
            message: '',
            isEditMode: false,

            cardapioData: null as Cardapio | null
        }
    },
    components: { popupCardapio, popupGrupo, popupItem, popupCerveja, popupDetalhesCardapio, popupEditarItem, popupEditarGrupo, NotificationMessage, popupEditarCerveja, popupInsumo, popupEditarInsumo },
    computed: {
        getPopupComponent() {
            if (this.isViewingDetails) {
                // Retorna o popup de detalhes dependendo do tipo selecionado
                if (this.opcoes === 'Cardápios') {
                    return 'popupDetalhesCardapio';
                } else if (this.opcoes === 'Itens') {
                    return 'popupEditarItem';
                } else if (this.opcoes === 'Grupos') {
                    return 'popupEditarGrupo';
                } else if (this.opcoes === 'Cervejas') {
                    return 'popupEditarCerveja';
                } else if (this.opcoes === 'Insumos') {
                    return 'popupEditarInsumo';
                }



            } else {
                // Retorna o popup de criação
                if (this.opcoes === 'Cardápios') {
                    return 'popupCardapio';
                } else if (this.opcoes === 'Grupos') {
                    return 'popupGrupo';
                } else if (this.opcoes === 'Itens') {
                    return 'popupItem';
                } else if (this.opcoes === 'Cervejas') {
                    return 'popupCerveja';
                } else if (this.opcoes === 'Insumos') {
                    return 'popupInsumo';
                }
            }
            return null;
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
                    this.cards = response.data
                        .map((cardapio: Cardapio) => ({ name: cardapio.nomeCardapio, id: cardapio.idCardapio }))
                        .sort((a, b) => a.name.localeCompare(b.name));
                } else if (this.opcoes === 'Grupos') {
                    response = await instance.get<Grupo[]>('/buffet/grupos');
                    this.cards = response.data
                        .map((grupo: Grupo) => ({ name: grupo.nomeGrupo, id: grupo.idGrupo }))
                        .sort((a, b) => a.name.localeCompare(b.name));
                } else if (this.opcoes === 'Itens') {
                    response = await instance.get<Item[]>('/buffet/itens');
                    this.cards = response.data
                        .map((item: Item) => ({ name: item.nomeItem, id: item.idItem }))
                        .sort((a, b) => a.name.localeCompare(b.name));
                } else if (this.opcoes === 'Cervejas') {
                    response = await instance.get<Cerveja[]>('/cerveja/get-all');
                    this.cards = response.data
                        .map((cerveja: Cerveja) => ({ name: cerveja.nome, id: cerveja.idCerveja }))
                        .sort((a, b) => a.name.localeCompare(b.name));
                } else if (this.opcoes === 'Insumos') {
                    response = await instance.get<Insumo[]>('/buffet/insumos');
                    this.cards = response.data
                        .map((item: Insumo) => ({ name: item.descricaoInsumo, id: item.idInsumo }))
                        .sort((a, b) => a.name.localeCompare(b.name));
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

        handleSuccessMessage(message: string) {
            this.message = message;
            this.fetchData();
            setTimeout(() => {
                this.message = '';
            }, 3000);
        },

        editCardapio(cardapio: Cardapio) {
            this.isViewingDetails = false; // Fecha o modal de detalhes
            this.showModal = true; // Abre o modal de criação
            this.cardapioData = cardapio; // Passa os dados do cardápio para edição
            this.isEditMode = true;
        },

        showCard(id: number) {
            this.isViewingDetails = true;
            this.selectedCardId = id; // Passa apenas o ID para o modal
            this.showModal = true;
        },
        showCreateModal() {
            this.isViewingDetails = false; // Define que estamos criando um novo item
            this.selectedCardId = null;
            this.showModal = true;
            this.cardapioData = null;
            this.isEditMode = false
        },
        closeModal() {
            this.showModal = false;
            this.selectedCardId = null;
            this.cardapioData = null;
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
