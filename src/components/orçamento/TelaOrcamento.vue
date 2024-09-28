<template>
    <div class="barraOpcoes">
        <button @click="showModal = true">Novo Orçamento</button>
        <div class="group">
            <label>Status:</label>
            <select v-model="status">
                <option value="pendentes">Pendentes</option>
                <option value="enviados">Enviados</option>
                <option value="descartados">Descartados</option>
            </select>
        </div>

        <input type="text" v-model="searchQuery" placeholder="Pesquisar Orçamentos...">
    </div>

    <table>
        <thead>
            <th style="width: 10%;">Referência</th>
            <th style="width: 20%;">Cliente</th>
            <th style="width: 20%;">Contato</th>
            <th style="width: 10%;">Tipo</th>
            <th style="width: 10%;">Data de Criação</th>
            <th style="width: 10%;">Data de Envio</th>
            <th style="width: 5%;">Enviar</th>
        </thead>
        <tbody>
            <tr v-for="(orcamento, index) in paginatedOrcamentos" :key="orcamento.idOrcamento"
                @dblclick="handleDoubleClick(orcamento, index)" :class="{ 'selected-row': selectedRow === index }">
                <td>{{ orcamento.referenciaOrcamento }}</td>
                <td>{{ orcamento.Lead.nomeLead }}</td>
                <td>{{ orcamento.Lead.celular }}</td>
                <td>{{ orcamento.tipoEvento }}</td>
                <td>{{ formatarDateToString(orcamento.createdAt) }}</td>
                <td>{{ orcamento.enviadoEm ? formatarDateToString(orcamento.enviadoEm) : '-' }}</td>
                <td><i class="fa-solid fa-share action-icon"></i></td>
            </tr>
        </tbody>
    </table>

    <!-- Controles de paginação -->
    <div class="pagination">
        <!--<button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Anterior</button>-->
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="paginationButton"><i
                class="fa-solid fa-angles-left action-icon"></i></button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="paginationButton"><i
                class="fa-solid fa-angles-right action-icon"></i></button>
    </div>

    <!-- Exibe a mensagem de sucesso fora do modal -->
    <NotificationMessage :message="successMessage" />

    <PopupOrcamento v-if="showModal" @close="showModal = false" @success="handleSuccessMessage" />
    <PopupDetalhes v-if="showDetailModal" @close="closeDetailModal" :orcamentoId="orcamentoSelecionado?.idOrcamento" />
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import PopupOrcamento from '@/components/orçamento/popups/PopupCriarOrcamento.vue';
import NotificationMessage from '@/views/NotificationMessage.vue';
import instance from '@/common/utils/AuthService';
import { AllOrcamentos, OrcamentoBasico } from '@/common/utils/Interfaces/Orcamento';
import PopupDetalhes from './popups/PopupDetalhesOrcamento.vue';
import { formatarCelular } from '@/common/utils/Helper';

export default defineComponent({
    components: { PopupOrcamento, NotificationMessage, PopupDetalhes },
    data() {
        return {
            showModal: false,
            showDetailModal: false,
            selectedRow: null as number | null,
            searchQuery: '',
            successMessage: '',
            status: 'pendentes' as keyof AllOrcamentos,

            orcamentos: {} as AllOrcamentos,
            orcamentoSelecionado: null as OrcamentoBasico | null,

            // Variáveis de paginação
            currentPage: 1,
            itemsPerPage: 20,
        };
    },
    mounted() {
        this.fetchOrcamentos();
    },
    computed: {
        // Filtra os orçamentos com base no status selecionado
        filteredOrcamentos(): OrcamentoBasico[] {
            let orcamentosFiltrados = this.orcamentos[this.status] || [];

            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                orcamentosFiltrados = orcamentosFiltrados.filter(orcamento => {
                    return (
                        orcamento.referenciaOrcamento.toLowerCase().includes(query) ||
                        orcamento.Lead.nomeLead.toLowerCase().includes(query) ||
                        orcamento.Lead.celular.includes(query) ||
                        orcamento.tipoEvento.toLowerCase().includes(query)
                    );
                });
            }

            // Cria uma cópia do array antes de ordenar para evitar mutações indesejadas
            const sortedOrcamentos = [...orcamentosFiltrados].sort((a, b) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });

            return sortedOrcamentos;
        },

        // Dados paginados
        paginatedOrcamentos(): OrcamentoBasico[] {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredOrcamentos.slice(start, end);
        },

        // Total de páginas
        totalPages(): number {
            return Math.ceil(this.filteredOrcamentos.length / this.itemsPerPage);
        },
    },
    methods: {
        async fetchOrcamentos() {
            try {
                const response = await instance.get<AllOrcamentos>('/orcamento/get-all');
                this.orcamentos = response.data;
            } catch (error) {
                console.error('Erro ao buscar orçamentos:', error);
            }
        },
        changePage(page: number) {
            if (page > 0 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        handleDoubleClick(orcamento: OrcamentoBasico, index: number) {
            this.selectedRow = index;
            this.orcamentoSelecionado = orcamento;
            this.showDetailModal = true;
        },
        closeDetailModal() {
            this.showDetailModal = false;
            this.selectedRow = null;
        },
        handleSuccessMessage(message: string) {
            this.successMessage = message;
            this.fetchOrcamentos();
            setTimeout(() => {
                this.successMessage = '';
            }, 3000);
        },
        formatarDateToString(date: string | Date): string {
            const padToTwoDigits = (num: number): string => {
                return num.toString().padStart(2, '0');
            };

            if (typeof date === 'string') {
                date = new Date(date);
            }

            const day = padToTwoDigits(date.getDate());
            const month = padToTwoDigits(date.getMonth() + 1);
            const year = date.getFullYear().toString().slice(-2);
            const hours = padToTwoDigits(date.getHours());
            const minutes = padToTwoDigits(date.getMinutes());
            const seconds = padToTwoDigits(date.getSeconds());

            return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        },

    },
});
</script>

<style scoped>
.pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 10px;
}

button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
}

.paginationButton {
    background-color: transparent;
    border: none;
}
</style>
