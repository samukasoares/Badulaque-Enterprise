<template>
    <div class="backdrop" @click.self="close">
        <form>
            <h4>Criar Item</h4><br>
            <label>Nome:</label>
            <input type="text" required>
            <label>Tipo:</label>
            <input type="text" required>
            <label>Preço:</label>
            <input type="text" required>
            <label>Grupo:</label>
            <select>
                <option>Grupo 1</option>
            </select>
            <button type="submit" class="submit-button">Criar</button>
        </form>
    </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'PopupOrcamento',
    data() {
        return {

        };
    },
    methods: {
        close() {
            this.$emit('close');
        },
    }
}
);
</script>

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
</style>