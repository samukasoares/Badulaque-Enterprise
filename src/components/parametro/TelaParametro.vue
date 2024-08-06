<template>
    <div class="barraOpcoes">
        <button @click="showModal = true">Novo Opcional</button>
        <div class="group">
        </div>
    </div><br>

    <h4>Espaço</h4>
    <div class="containerCards">
        <div v-for="dia in diasDaSemana" :key="dia.idValorEspaco" class="card" @click="openEditModal(dia)">
            {{ dia.dia }}
        </div>
    </div>

    <h4>Opcionais</h4>
    <div class="containerCards">
        <div class="card">Espaço da Noiva</div>
    </div>

    <PopupCriarOpcional v-if="showModal" @close="showModal = false" />
    <PopupEditarValorEspaco v-if="showModalEspaco" @close="showModalEspaco = false" :dia-da-semana="currentDia"
        :valor-espaco="currentValorEspaco" @update="updateValorEspaco" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PopupCriarOpcional from './popups/PopupCriarOpcional.vue';
import PopupEditarValorEspaco from './popups/PopupEditarValorEspaco.vue';
import { ValorEspaco } from '@/common/utils/Interfaces';
import instance from '@/common/utils/AuthService';

export default defineComponent({
    components: { PopupCriarOpcional, PopupEditarValorEspaco },
    data() {
        return {
            showModal: false,
            showModalEspaco: false,
            diasDaSemana: [] as ValorEspaco[],
            currentDia: '',
            currentValorEspaco: {} as ValorEspaco
        };
    },
    methods: {
        openEditModal(dia: ValorEspaco) {
            this.currentDia = dia.dia ?? 'Desconhecido';
            this.currentValorEspaco = { ...dia };
            this.showModalEspaco = true;
        },
        async updateValorEspaco(updatedData: ValorEspaco) {
            try {
                const response = await instance.post('/espaco/update', updatedData);
                console.log('Atualização bem-sucedida:', response.data);

                const index = this.diasDaSemana.findIndex(d => d.idValorEspaco === updatedData.idValorEspaco);
                if (index !== -1) {
                    this.diasDaSemana[index] = { ...response.data };
                }

                this.showModalEspaco = false;
            } catch (error) {
                console.error('Erro ao atualizar o valor do espaço:', error);
            }
        },

        async fetchValorEspaco() {
            try {
                const response = await instance.get<ValorEspaco[]>('/espaco/get-all');
                this.diasDaSemana = response.data;
            } catch (error) {
                console.error('Erro ao buscar dias da semana:', error);
            }
        }
    },
    mounted() {
        this.fetchValorEspaco();
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