<template>

    <div class="barraOpcoes">
        <button @click="showModal = true">Novo Orçamento</button>
        <div class="group">
            <label>Status:</label>
            <select>
                <option>Orçamento</option>
                <option>Descartado</option>
            </select>
        </div>

        <input type="text" v-model="searchQuery" placeholder="Pesquisar Orçamentos..." @input="filterRegistros">
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 10%;">Referência</th>
                <th style="width: 20%;">Cliente</th>
                <th style="width: 20%;">Contato</th>
                <th style="width: 10%;">Tipo</th>
                <th style="width: 10%;">Data de Criação</th>
                <th style="width: 10%;">Data de Envio</th>
                <th style="width: 10%;">Status</th>
                <th style="width: 5%;">Enviar</th>
                <th style="width: 5%;">Editar</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(registro, index) in filteredRegistros" :key="registro.id"
                @dblclick="handleDoubleClick(registro, index)" :class="{ 'selected-row': selectedRow === index }">
                <td>{{ registro.referencia }}</td>
                <td>{{ registro.cliente }}</td>
                <td>{{ registro.contato }}</td>
                <td>{{ registro.tipo }}</td>
                <td>{{ registro.dataCriacao }}</td>
                <td>{{ registro.dataEnvio }}</td>
                <td>{{ registro.status }}</td>
                <td @click="handleEnvioOrcamento(registro, index)"><i class="fa-solid fa-share action-icon"></i></td>
                <td @click="handleEditClick(registro, index)"><i class="fa-solid fa-edit action-icon"></i></td>
            </tr>
        </tbody>
    </table>

    <PopupOrcamento v-if="showModal" @close="showModal = false" />
    <PopupDetalhes v-if="showDetailModal" @close="closeDetailModal()" :registro="registroSelecionado" />
    <PopupEditarOrcamento v-if="showEditModal" @close="closeEditModal()" :registro="registroSelecionado" />

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PopupOrcamento from '@/components/orçamento/popups/PopupCriarOrcamento.vue';
import PopupDetalhes from '@/components/orçamento/popups/PopupDetalhesOrcamento.vue';
import PopupEditarOrcamento from '@/components/orçamento/popups/PopupEditarOrcamento.vue'

interface Registro {
    id: number;
    referencia: string;
    cliente: string;
    contato: string;
    tipo: string;
    dataCriacao: string;
    dataEnvio: string;
    status: string;
}


export default defineComponent({
    components: { PopupOrcamento, PopupDetalhes, PopupEditarOrcamento },
    data() {
        return {
            showModal: false,
            showDetailModal: false,
            showEditModal: false,
            selectedRow: null as number | null,
            registroSelecionado: null as Registro | null,
            searchQuery: '',

            link: '',

            registros: [
                {
                    id: 1,
                    referencia: 'C250926',
                    cliente: 'Samuel & Bruna',
                    contato: '(19)99710-4251',
                    tipo: 'Casamento',
                    dataCriacao: '25/06/24 17:46',
                    dataEnvio: '25/06/24 17:54',
                    status: 'Orçamento',
                },
                {
                    id: 2,
                    referencia: 'C251108',
                    cliente: 'Pedro & Karol',
                    contato: '(19)99710-3211',
                    tipo: 'Casamento',
                    dataCriacao: '21/06/24 17:59',
                    dataEnvio: '25/06/24 19:30',
                    status: 'Descartado',
                },
                // Adicione mais registros conforme necessário
            ] as Registro[],
            filteredRegistros: [] as Registro[]
        };
    },
    created() {
        this.filteredRegistros = this.registros;
    },
    methods: {
        handleDoubleClick(registro: Registro, index: number) {
            this.selectedRow = index;
            this.registroSelecionado = registro;
            this.showDetailModal = true;
        },
        handleEditClick(registro: Registro, index: number) {
            this.selectedRow = index;
            this.registroSelecionado = registro;
            this.showEditModal = true;
        },
        closeDetailModal() {
            this.showDetailModal = false;
            this.selectedRow = null;
        },
        closeEditModal() {
            this.showEditModal = false;
            this.selectedRow = null;
        },
        filterRegistros() {
            this.filteredRegistros = this.registros.filter((registro) => {
                const query = this.searchQuery.toLowerCase();
                return (
                    registro.referencia.toLowerCase().includes(query) ||
                    registro.cliente.toLowerCase().includes(query) ||
                    registro.contato.toLowerCase().includes(query) ||
                    registro.tipo.toLowerCase().includes(query) ||
                    registro.dataCriacao.toLowerCase().includes(query) ||
                    registro.dataEnvio.toLowerCase().includes(query)
                );
            });
        },

        async fetchLinks() {
            const response = await fetch('/links-orcamentos.json');
            return response.json();

        },
        async getLink(orcamentoId: number) {
            const links = await this.fetchLinks();
            const index = (orcamentoId) % links.length;
            this.link = links[index];
        },
        async handleEnvioOrcamento(registro: Registro, index: number) {
            await this.getLink(registro.id);
            console.log(this.link)
        }
    }
});
</script>
