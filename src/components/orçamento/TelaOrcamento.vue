<template>

    <div class="barraOpcoes">
        <button @click="showModal = true">Novo Orçamento</button>
        <i class="fa-solid fa-handshake action-icon"></i>
        <div class="group">
            <label>Status:</label>
            <select>
                <option>Orçamento</option>
                <option>Descartado</option>
            </select>
        </div>

        <input type="text" placeholder="Pesquisar Orçamentos...">
    </div>

    <table>
        <tr>
            <th style="width: 10%;">Código</th>
            <th style="width: 20%;">Cliente</th>
            <th style="width: 20%;">Contato</th>
            <th style="width: 10%;">Tipo</th>
            <th style="width: 10%;">Data de Criação</th>
            <th style="width: 10%;">Data de Envio</th>
            <th style="width: 5%;">Enviar</th>
            <th style="width: 5%;">Editar</th>
        </tr>
        <tr>
            <td>C250926</td>
            <td>Samuel & Bruna</td>
            <td>(19)99710-4251</td>
            <td>Casamento</td>
            <td>25/06/24 17:46</td>
            <td>25/06/24 17:54</td>
            <td><i class="fa-solid fa-share action-icon"></i></td>
            <td><i class="fa-solid fa-edit action-icon"></i></td>
        </tr>
    </table>

    <PopupOrcamento v-if="showModal" @close="showModal = false" />

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PopupOrcamento from '@/components/orçamento/PopupOrcamento.vue';

export default defineComponent({
    components: { PopupOrcamento },
    data() {
        return {
            showModal: false
        };
    }
});
</script>

<style>
table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    border-radius: 5px;
    overflow: hidden;
}

th,
td {
    border-right: 1px solid #2F4036;
    text-align: center;
    padding: 8px;
}

th {

    background-color: #425C4D;
    color: white;
}

tr:nth-child(even) {
    background-color: #E1C59C;
}

.action-icon {
    color: #425C4D;
    cursor: pointer;
    font-size: 1.2em;
}

.action-icon:hover {
    color: #2F4036;
}

/* Remove the border from the last cell in each row */
th:last-child,
td:last-child {
    border-right: none;
}

.barraOpcoes {
    display: flex;
    border-radius: 5px;
    width: 100%;
    margin-bottom: 10px;
    height: 30px;
    align-items: center;
    justify-content: space-between;
}

.barraOpcoes button {
    background-color: #425C4D;
    border: none;
    padding: 5px 10px;
    color: white;
    cursor: pointer;
    border-radius: 5px;
    padding: 10px;
    font-family: MontSerrat;
    width: 200px;
}

.barraOpcoes button:hover {
    background-color: #2F4036;
}

.barraOpcoes select,
.barraOpcoes input {
    border-radius: 5px;
    padding: 10px;
    border: none;
    font-family: MontSerrat;
}

.barraOpcoes select {
    width: 200px;
}

.barraOpcoes input {
    width: 300px;
}

.barraOpcoes input:focus {
    outline: none;
    border-color: #2F4036;
    box-shadow: 0 0 10px #2F4036;
}

.barraOpcoes select:focus {
    outline: none;
    border-color: #2F4036;
    box-shadow: 0 0 10px #2F4036;
}

.group {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 350px;
}
</style>