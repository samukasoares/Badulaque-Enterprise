<template>
    <div class="barraOpcoes">
        <button @click="showCreateModal">Novo</button>
        <div class="group">
            <label>Visualizando:</label>
            <select v-model="opcoes" @change="fetchData">
                <option>Espaço</option>
                <option>Opcionais</option>
                <option>Parâmetros</option>
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
        @success="handleSuccessMessage" />

    <NotificationMessage :message="message" />

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PopupCriarOpcional from './popups/PopupCriarOpcional.vue';
import PopupEditarValorEspaco from './popups/PopupEditarValorEspaco.vue';
import PopupEditarOpcional from './popups/PopupEditarOpcional.vue';
import PopupEditarParametro from './popups/PopupEditParametro.vue';
import NotificationMessage from '@/views/NotificationMessage.vue';
import instance from '@/common/utils/AuthService';

import { Parametro } from '@/common/utils/Interfaces/Parametro'
import { Card } from '@/common/utils/Interfaces/Helper';
import { ValorEspaco } from '@/common/utils/Interfaces/Espaco/Espaço';
import { Opcional } from '@/common/utils/Interfaces/Opcional/Opcional';

export default defineComponent({
    components: { PopupCriarOpcional, PopupEditarValorEspaco, PopupEditarOpcional, PopupEditarParametro, NotificationMessage },
    data() {
        return {
            opcoes: 'Opcionais',
            showModal: false,
            cards: [] as { name: string, id: number }[],
            searchText: '',
            selectedCardId: null as number | null,
            isViewingDetails: false,
            message: '',
        };
    },
    computed: {
        getPopupComponent() {
            if (this.isViewingDetails) {
                if (this.opcoes === 'Espaço') {
                    return 'PopupEditarValorEspaco';
                } else if (this.opcoes === 'Opcionais') {
                    return 'PopupEditarOpcional';
                } else if (this.opcoes === 'Parâmetros') {
                    return 'PopupEditarParametro';
                }
            } else {
                // Retorna o popup de criação para "Opcionais"
                if (this.opcoes === 'Opcionais') {
                    return 'PopupCriarOpcional';
                }
            }
            // Retorna null como fallback para garantir um retorno
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
                if (this.opcoes === 'Espaço') {
                    response = await instance.get<ValorEspaco[]>('/espaco/get-all');
                    this.cards = response.data.map((valorEspaco: ValorEspaco) => ({ name: valorEspaco.dia, id: valorEspaco.idValorEspaco }));
                } else if (this.opcoes === 'Opcionais') {
                    response = await instance.get<Opcional[]>('/opcional/get-all');
                    this.cards = response.data.map((item: Opcional) => ({ name: item.nomeOpcional, id: item.idOpcional }));
                } else if (this.opcoes === 'Parâmetros') {
                    response = await instance.get<Parametro[]>('/parametro/get-all');
                    this.cards = response.data.map((item: Parametro) => ({ name: item.nomeParametro, id: item.idParametro }));
                }
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
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
        },
        closeModal() {
            this.showModal = false;
            this.selectedCardId = null;
        },
        handleSuccessMessage(message: string) {
            this.message = message;
            this.fetchData();
            setTimeout(() => {
                this.message = '';
            }, 3000);
        }
    },
    mounted() {
        this.fetchData();
    }
});
</script>
