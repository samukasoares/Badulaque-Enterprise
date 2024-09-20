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
            <tr v-for="(registro, index) in filteredOrcamentos" :key="registro.id"
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

    <!-- Exibe a mensagem de sucesso fora do modal -->
    <NotificationMessage :message="successMessage" />

    <PopupOrcamento v-if="showModal" @close="showModal = false" @success="handleSuccessMessage" />
    <PopupDetalhes v-if="showDetailModal" @close="closeDetailModal()" :orcamentoId="orcamentoSelecionado.id" />
    <PopupEditarOrcamento v-if="showEditModal" @close="closeEditModal()" :orcamento="orcamentoSelecionado" />

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PopupOrcamento from '@/components/orçamento/popups/PopupCriarOrcamento.vue';
import PopupDetalhes from '@/components/orçamento/popups/PopupDetalhesOrcamento.vue';
import PopupEditarOrcamento from '@/components/orçamento/popups/PopupEditarOrcamento.vue'
import NotificationMessage from '@/views/NotificationMessage.vue';
import { OrcamentoTabela } from '@/common/utils/Interfaces';



export default defineComponent({
    components: { PopupOrcamento, PopupDetalhes, PopupEditarOrcamento, NotificationMessage },
    data() {
        return {
            showModal: false,
            showDetailModal: false,
            showEditModal: false,
            selectedRow: null as number | null,
            orcamentoSelecionado: {} as OrcamentoTabela,
            searchQuery: '',
            successMessage: '',
            link: '',

            orcamentos: [
                {
                    id: 42,
                    referencia: 'C250926',
                    cliente: 'Samuel & Bruna',
                    contato: '(19)99710-4251',
                    tipo: 'Casamento',
                    dataCriacao: '25/06/24 17:46',
                    dataEnvio: '25/06/24 17:54',
                    status: 'Orçamento',
                },
                // Adicione mais registros conforme necessário
            ] as OrcamentoTabela[],

            filteredOrcamentos: [] as OrcamentoTabela[]
        };
    },
    created() {
        this.filteredOrcamentos = this.orcamentos;
    },
    methods: {
        handleDoubleClick(orcamento: OrcamentoTabela, index: number) {
            this.selectedRow = index;
            this.orcamentoSelecionado = orcamento;
            this.showDetailModal = true;
        },
        handleEditClick(orcamento: OrcamentoTabela, index: number) {
            this.selectedRow = index;
            this.orcamentoSelecionado = orcamento;
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
            this.filteredOrcamentos = this.orcamentos.filter((orcamento) => {
                const query = this.searchQuery.toLowerCase();
                return (
                    orcamento.referencia.toLowerCase().includes(query) ||
                    orcamento.cliente.toLowerCase().includes(query) ||
                    orcamento.contato.toLowerCase().includes(query) ||
                    orcamento.tipo.toLowerCase().includes(query) ||
                    orcamento.dataCriacao.toLowerCase().includes(query) ||
                    orcamento.dataEnvio.toLowerCase().includes(query)
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
        async handleEnvioOrcamento(registro: OrcamentoTabela, index: number) {
            await this.getLink(registro.id);
            console.log(this.link)
        },

        handleSuccessMessage(message: string) {
            this.successMessage = message;

            setTimeout(() => {
                this.successMessage = '';
            }, 3000); // 5 segundos
        }
    }
});
</script>
