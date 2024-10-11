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
        <div v-for="opcional in opcionais" :key="opcional.idOpcional" class="card"
            @click="openEditModalOpcional(opcional)">
            {{ opcional.nomeOpcional }}
        </div>
    </div>

    <h4>Parâmetros</h4>
    <div class="containerCards">
        <div v-for="parametro in parametros" :key="parametro.idParametro" class="card"
            @click="openEditModalParametro(parametro)">
            {{ parametro.nomeParametro }}
        </div>
    </div>

    <PopupCriarOpcional v-if="showModal" @close="showModal = false" />

    <PopupEditarValorEspaco v-if="showModalEspaco" @close="showModalEspaco = false" :dia-da-semana="currentDia"
        :valor-espaco="currentValorEspaco" @update="updateValorEspaco" />

    <PopupEditarOpcional v-if="showModalOpcional" @close="showModalOpcional = false" :Opcional="currentOpcional"
        @update="updateOpcional" />

    <PopupEditarParametro v-if="showModalParametro" @close="showModalParametro = false" :Parametro="currentParametro"
        @update="updateParametro" />

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PopupCriarOpcional from './popups/PopupCriarOpcional.vue';
import PopupEditarValorEspaco from './popups/PopupEditarValorEspaco.vue';
import { Opcional, ValorEspaco } from '@/common/utils/Interfaces';
import instance from '@/common/utils/AuthService';
import PopupEditarOpcional from './popups/PopupEditarOpcional.vue';
import { Parametro } from '@/common/utils/Interfaces/Parametro';
import PopupEditarParametro from './popups/PopupEditParametro.vue'

export default defineComponent({
    components: { PopupCriarOpcional, PopupEditarValorEspaco, PopupEditarOpcional, PopupEditarParametro },
    data() {
        return {
            showModal: false,
            showModalEspaco: false,

            diasDaSemana: [] as ValorEspaco[],
            currentDia: '',
            currentValorEspaco: {} as ValorEspaco,

            showModalOpcional: false,
            currentOpcional: {} as Opcional,

            showModalParametro: false,
            currentParametro: {} as Parametro,

            opcionais: [] as Opcional[],
            parametros: [] as Parametro[],
        };
    },
    methods: {
        openEditModal(dia: ValorEspaco) {
            this.currentDia = dia.dia ?? 'Desconhecido';
            this.currentValorEspaco = { ...dia };
            this.showModalEspaco = true;
        },
        openEditModalOpcional(opcional: Opcional) {
            this.currentOpcional = { ...opcional };
            this.showModalOpcional = true;
        },
        openEditModalParametro(parametro: Parametro) {
            this.currentParametro = { ...parametro };
            this.showModalParametro = true;
        },


        async updateValorEspaco(updatedData: ValorEspaco) {
            try {
                const response = await instance.post('/espaco/update', updatedData);

                const index = this.diasDaSemana.findIndex(d => d.idValorEspaco === updatedData.idValorEspaco);
                if (index !== -1) {
                    this.diasDaSemana[index] = { ...response.data };
                }

                this.showModalEspaco = false;
            } catch (error) {
                console.error('Erro ao atualizar o valor do espaço:', error);
            }
        },
        async updateOpcional(updatedOpcional: Opcional) {
            try {
                const response = await instance.post('/opcional/update', updatedOpcional);

                const index = this.opcionais.findIndex(o => o.idOpcional === updatedOpcional.idOpcional);
                if (index !== -1) {
                    this.opcionais[index] = { ...response.data };
                }

                this.showModalOpcional = false;
            } catch (error) {
                console.error('Erro ao atualizar o opcional:', error);
            }
        },
        async updateParametro(updatedParametro: Parametro) {
            try {
                const response = await instance.post('/parametro/update', updatedParametro);

                const index = this.parametros.findIndex(p => p.idParametro === updatedParametro.idParametro);
                if (index !== -1) {
                    this.opcionais[index] = { ...response.data };
                }

                this.showModalParametro = false;
            } catch (error) {
                console.error('Erro ao atualizar o parâmetro:', error);
            }
        },

        async fetchValorEspaco() {
            try {
                const response = await instance.get<ValorEspaco[]>('/espaco/get-all');
                this.diasDaSemana = response.data;
            } catch (error) {
                console.error('Erro ao buscar dias da semana:', error);
            }
        },
        async fetchOpcionais() {
            try {
                const response = await instance.get<Opcional[]>('/opcional/get-all');
                this.opcionais = response.data;
            } catch (error) {
                console.error('Erro ao buscar opcionais:', error);
            }
        },
        async fetchParametros() {
            try {
                const response = await instance.get<Parametro[]>('/parametro/get-all');
                this.parametros = response.data;
            } catch (error) {
                console.error('Erro ao buscar parametros:', error);
            }
        },
    },
    mounted() {
        this.fetchValorEspaco();
        this.fetchOpcionais();
        this.fetchParametros();
    }
});
</script>
