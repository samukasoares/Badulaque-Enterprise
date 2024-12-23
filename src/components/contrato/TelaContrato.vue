<template>
    <div class="barraOpcoes">
        <button @click="showModal = true">Novo Contrato</button>
        <div class="group">
            <label>Status:</label>
            <select v-model="status">
                <option value="Pendente">Pendentes</option>
                <option value="Ativo">Ativos</option>
                <option value="Realizado">Realizados</option>
                <option value="Descartado">Descartados</option>

            </select>
        </div>
        <input type="text" v-model="searchQuery" placeholder="Pesquisar Contratos...">
    </div>

    <table>
        <tr>
            <th>Data</th>
            <th>Cliente</th>
            <th>Contato</th>
            <th>Tipo</th>
            <th>Convidados</th>
            <th>Cardápio</th>
            <th>Assinado</th>
            <th>Definir Cardápio</th>
            <th>Pagamentos</th>
            <th>Recebimentos</th>
        </tr>
        <tr v-for="(contrato, index) in filteredContratos" :key="contrato.idContrato"
            @dblclick="handleDoubleClick(contrato, index)" :class="{ 'selected-row': selectedRow === index }">
            <td>{{ formatarData(contrato.Orcamento.dataEvento) }}</td>
            <td>{{ contrato.Orcamento.Lead.nomeLead }}</td>
            <td>{{ contrato.Orcamento.Lead.celular }}</td>
            <td>{{ contrato.Orcamento.tipoEvento }}</td>
            <td>{{ contrato.Orcamento.numConvidados }}</td>
            <td>{{ contrato.Orcamento.Cardapio.nomeCardapio }}</td>
            <td><input type="checkbox" class="custom-checkbox" v-model="contrato.assinado" :true-value="1"
                    :false-value="0" @change="atualizarAssinado(contrato)"></td>
            <td><button class="paginationButton" @click="abrirDefCardapioModal(contrato)"><i
                        class="fa-solid fa-edit action-icon"></i></button></td>
            <td><i class="fa-solid fa-hand-holding-dollar action-icon"></i></td>
            <td><i class="fa-solid fa-sack-dollar action-icon"></i></td>
        </tr>
    </table>

    <div class="pagination">
        <!--<button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Anterior</button>-->
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="paginationButton"><i
                class="fa-solid fa-angles-left action-icon"></i></button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="paginationButton"><i
                class="fa-solid fa-angles-right action-icon"></i></button>
    </div>

    <NotificationMessage :message="message" />

    <PopupCriarContrato v-if="showModal" @close="showModal = false" @success="handleMessage" />

    <PopupDetalhesContrato v-if="showDetailModal" @close="closeDetailModal"
        :contratoId="contratoSelecionado?.idContrato" />

    <PopupDefinicaoCardapio v-if="showDefCardapioModal" :contratoId="contratoSelecionado?.idContrato"
        @close="closeDefCardapioModal" @success="handleMessage"
        :convidadosContrato="contratoSelecionado?.Orcamento.numConvidados"
        :dataContrato="contratoSelecionado?.Orcamento.dataEvento" />

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PopupCriarContrato from '../contrato/popups/PopupCriarContrato.vue'
import PopupDetalhesContrato from './popups/PopupDetalhesContrato.vue';
import PopupDefinicaoCardapio from './popups/PopupDefinicaoCardapio.vue';
import { Contrato } from '@/common/utils/Interfaces/Contrato/ContratoTabela';
import { formatarData } from '@/common/utils/Helper/Data';
import { fetchContratos } from '@/common/utils/FetchMethods';
import { formatarValorMonetario } from '@/common/utils/Helper';
import instance from '@/common/utils/AuthService';

export default defineComponent({
    components: { PopupCriarContrato, PopupDetalhesContrato, PopupDefinicaoCardapio },
    data() {
        return {
            showModal: false,

            contratos: [] as Contrato[],
            searchQuery: '',
            showDetailModal: false,
            showDefCardapioModal: false,
            selectedRow: null as number | null,
            contratoSelecionado: null as Contrato | null,
            status: 'Ativo',

            // Variáveis de paginação
            currentPage: 1,
            itemsPerPage: 20,

            message: ''
        }
    },
    computed: {
        filteredContratos(): Contrato[] {
            let contratosFiltrados = this.contratos.filter(contrato => {
                const matchesSearch = contrato.Orcamento.Lead.nomeLead
                    .toLowerCase()
                    .includes(this.searchQuery.toLowerCase());
                const matchesStatus = contrato.status === this.status; // Filtro de status
                return matchesSearch && matchesStatus;
            });

            const sortedContratos = [...contratosFiltrados].sort((a, b) => {
                return new Date(a.Orcamento.dataEvento).getTime() - new Date(b.Orcamento.dataEvento).getTime();
            });

            return sortedContratos;
        },

        // Dados paginados
        paginatedContratos(): Contrato[] {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredContratos.slice(start, end);
        },

        totalPages(): number {
            return Math.ceil(this.filteredContratos.length / this.itemsPerPage);
        },
    },
    methods: {
        formatarData, formatarValorMonetario,

        async atualizarAssinado(contrato: Contrato) {
            try {
                // Crie o payload com o novo valor de "assinado"
                const payload = {
                    idContrato: contrato.idContrato,
                    assinado: contrato.assinado,
                    observacoes: contrato.observacoes,
                    Orcamento_idOrcamento: contrato.Orcamento_idOrcamento,
                    valorNF: 0
                };
                const response = await instance.put('/contrato/update', payload);

                this.contratos = await fetchContratos();
            } catch (error) {
                console.error('Erro ao tentar atualizar o contrato:', error);
            }
        },

        handleDoubleClick(contrato: Contrato, index: number) {
            this.selectedRow = index;
            this.contratoSelecionado = contrato;
            this.showDetailModal = true;
        },

        closeDetailModal() {
            this.showDetailModal = false;
            this.selectedRow = null;
        },
        abrirDefCardapioModal(contrato: Contrato) {
            this.contratoSelecionado = contrato;
            this.showDefCardapioModal = true;
        },

        closeDefCardapioModal() {
            this.showDefCardapioModal = false;
        },

        changePage(page: number) {
            if (page > 0 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },

        async handleMessage(message: string) {
            this.message = message;
            this.contratos = await fetchContratos();
            setTimeout(() => {
                this.message = '';
            }, 3000);
        },
    },
    async mounted() {
        this.contratos = await fetchContratos()
    }
})
</script>

<style scoped>
.groupConsolidado {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 5px;
}

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