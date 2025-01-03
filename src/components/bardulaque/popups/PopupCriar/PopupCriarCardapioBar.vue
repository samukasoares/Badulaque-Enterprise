<template>
    <div class="backdrop" @click.self="close">
        <form class="modal-form">
            <h4>Criar Cardápio</h4><br>
            <label>Nome:</label>
            <input type="text" required class="especial" v-model="nomeCardapio">
            <label>Preço:</label>
            <input type="number" required class="especial" v-model="precoCardapio">


            <label>Itens:</label>
            <VueMultiselect v-model="drinksSelecionados" :options="drinks" :multiple="true" :close-on-select="false"
                :show-labels="false" :preserve-search="true" placeholder="Escolha os drinks..." label="nome"
                track-by="idDrink" :preselect-first="false" :max-height="250"></VueMultiselect>

            <button type="submit" class="submit-button" @click.prevent="criarCardapio">Criar</button>
        </form>
    </div>
</template>

<script lang="ts">
import instance from '@/common/utils/AuthService';
import { Drink, RegistroCardapioBar } from '@/common/utils/Interfaces/Bardulaque/Registro';
import { defineComponent } from 'vue';
import VueMultiselect from 'vue-multiselect';

export default defineComponent({
    name: 'PopupOrcamento',
    components: { VueMultiselect },
    data() {
        return {
            nomeCardapio: '',
            precoCardapio: 0,
            drinksSelecionados: [] as Drink[],
            drinks: [] as Drink[],

            selectedDrinksIds: [] as number[],

        };
    },
    methods: {
        close() {
            this.$emit('close');
        },
        async criarCardapio() {
            try {
                // Construir o array de IDs dos itens selecionados
                this.selectedDrinksIds = this.drinksSelecionados.map((drink: Drink) => drink.idDrink);

                // Criar o objeto cardapio usando a interface RegistroCardapioBar
                const cardapioBar: RegistroCardapioBar = {
                    nomeCardapioBar: this.nomeCardapio,
                    precoCardapio: this.precoCardapio,
                    drinks: this.selectedDrinksIds,
                };
                const response = await instance.post('/bar/create', cardapioBar);

                window.location.reload()
            } catch (error) {
                alert('Erro ao criar cardápio!');
            }

        },
        async fetchItens() {
            let response = await instance.get<Drink[]>('/bar/drink/get-all');
            this.drinks = response.data;
        },
    },
    mounted() {
        this.fetchItens();
    }
});
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style scoped>
@import '../../.././../assets/styles/modal-style.css'
</style>