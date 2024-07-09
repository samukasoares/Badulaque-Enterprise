<template>
    <div class="backdrop" @click.self="close">
        <form>
            <h4>Criar Cardápio</h4><br>
            <label>Nome:</label>
            <input type="text" required class="especial" v-model="nomeCardapio">
            <label>Preço:</label>
            <input type="number" required class="especial" v-model=precoCardapio>
            <label>Itens:</label>
            <VueMultiselect v-model="items" :options="options" :multiple="true" :close-on-select="false"
                :clear-on-select="false" :preserve-search="true" placeholder="Escolha os itens..." label="nomeItem"
                track-by="idItem" :preselect-first="false"></VueMultiselect>
            <button type="submit" class="submit-button" @click="criarCardapio">Criar</button>

        </form>

    </div>

</template>

<script lang="ts">
import instance from '@/common/utils/AuthService';
import { Item } from '@/common/utils/Interfaces';
import { defineComponent } from 'vue';
import VueMultiselect from 'vue-multiselect'


export default defineComponent({
    name: 'PopupOrcamento',
    components: { VueMultiselect },
    data() {
        return {
            options: [] as Item[],
            nomeCardapio: '',
            precoCardapio: '',
            items: [] as Item[]
        }
    },
    methods: {
        close() {
            this.$emit('close');
        },
        async fetchItens() {
            try {
                let response = await instance.get<Item[]>('/buffet/itens');
                this.options = response.data
            } catch (error) {
                console.error('Erro ao buscar itens:', error);
            }
        },
        async criarCardapio() {
            try {
                const selectedIds = this.items.map(item => item.idItem);
                console.log(selectedIds)
                const data = await instance.post('/buffet/criar-cardapio', {
                    nomeCardapio: this.nomeCardapio,
                    precoCardapio: this.precoCardapio,
                    items: selectedIds
                });
                window.location.reload()
            } catch (error) {
                alert('Erro ao criar cardápio!')
            }
        }
    },
    mounted() {
        this.fetchItens();
    }
}
);
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style scoped>
form {
    max-width: 400px;
    margin: 30px auto;
    background: white;
    text-align: left;
    padding: 20px;
    border-radius: 10px;
    position: relative;
    z-index: 2;
    /* Garanta que o formulário esteja acima do backdrop */
}

label {
    color: #aaa;
    display: inline-block;
    margin: 25px 0 15px;
    font-size: 0.6em;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: bold;
}

input,
select {
    display: block;
    padding: 10px 6px;
    width: 100%;
    box-sizing: border-box;
    border: none;
    border-bottom: 1px solid #ddd;
    color: #555;
}

.backdrop {
    top: 0;
    left: 0;
    position: fixed;
    background: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    z-index: 1;
    /* Ajuste o z-index para garantir que o backdrop esteja acima de outros conteúdos */
}

button.submit-button {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #425C4D;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20px;
    font-family: Montserrat;
}

button.submit-button:hover {
    background-color: #2F4036;
}

h4 {
    color: black;
    display: inline-block;
    margin: 25px 0 15px;
    font-size: 0.6em;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: bold;
}

input:focus {
    outline: none;
}

.especial:focus {
    outline: none;
    border-color: #2F4036;
    box-shadow: 0 0 10px #2F4036;
}
</style>
