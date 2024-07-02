<template>
    <div class="backdrop" @click.self="close">
        <form>
            <h4>Criar Cardápio</h4><br>
            <label>Nome:</label>
            <input type="text" required class="especial">
            <label>Preço:</label>
            <input type="number" required class="especial">
            <label>Itens:</label>
            <VueMultiselect v-model="value" :options="options" :multiple="true" :close-on-select="false"
                :clear-on-select="false" :preserve-search="true" placeholder="Escolha os itens..." label="name"
                track-by="name" :preselect-first="false"></VueMultiselect>
            <button type="submit" class="submit-button">Criar</button>

        </form>

    </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VueMultiselect from 'vue-multiselect'

export default defineComponent({
    name: 'PopupOrcamento',
    components: { VueMultiselect },
    data() {
        return {
            value: null,

            options: [
                { name: 'Vue.js', language: 'JavaScript' },
                { name: 'Rails', language: 'Ruby' },
                { name: 'Sinatra', language: 'Ruby' },
                { name: 'Laravel', language: 'PHP' },
                { name: 'Phoenix', language: 'Elixir' },
            ]
        }

    },
    methods: {
        close() {
            this.$emit('close');
        },
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
