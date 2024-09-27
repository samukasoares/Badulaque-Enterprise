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
            <th style="width: 5%;">Editar</th>
        </thead>
        <tbody>
            <tr v-for="(orcamento, index) in filteredOrcamentos" :key="orcamento.idOrcamento"
                @dblclick="handleDoubleClick(orcamento, index)" :class="{ 'selected-row': selectedRow === index }">
                <td>{{ orcamento.referenciaOrcamento }}</td>
                <td>{{ orcamento.Lead.nomeLead }}</td>
                <td>{{ formatarCelular(orcamento.Lead.celular) }}</td>
                <td>{{ orcamento.tipoEvento }}</td>
                <td>{{ formatarDateToString(orcamento.createdAt) }}</td>
                <td>{{ orcamento.enviadoEm ? formatarDateToString(orcamento.enviadoEm) : '-' }}</td>
                <td><i class="fa-solid fa-share action-icon"></i></td>
                <td><i class="fa-solid fa-edit action-icon"></i></td>
            </tr>
        </tbody>
    </table>

    <!-- Exibe a mensagem de sucesso fora do modal -->
    <NotificationMessage :message="successMessage" />

    <PopupOrcamento v-if="showModal" @close="showModal = false" @success="handleSuccessMessage" />
    <PopupDetalhes v-if="showDetailModal" @close="closeDetailModal" :orcamentoId="orcamentoSelecionado?.idOrcamento" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
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
            showEditModal: false,
            selectedRow: null as number | null,
            searchQuery: '',
            successMessage: '',
            link: '',
            status: 'pendentes' as keyof AllOrcamentos,

            orcamentos: {} as AllOrcamentos,
            orcamentoSelecionado: null as OrcamentoBasico | null,

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

            return orcamentosFiltrados;

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
        handleDoubleClick(orcamento: OrcamentoBasico, index: number) {
            this.selectedRow = index;
            this.orcamentoSelecionado = orcamento;
            this.showDetailModal = true;
        },
        closeDetailModal() {
            this.showDetailModal = false;
            this.selectedRow = null;
        },
        closeEditModal() {
            this.showEditModal = false;
            this.selectedRow = null;
        },
        handleSuccessMessage(message: string) {
            this.successMessage = message;
            this.fetchOrcamentos();
            setTimeout(() => {
                this.successMessage = '';

            }, 3000); // 5 segundos
        },
        formatarDateToString(date: string | Date): string {
            const padToTwoDigits = (num: number): string => {
                return num.toString().padStart(2, '0');
            };

            // Verifica se o valor é uma string e, se for, converte para um objeto Date
            if (typeof date === 'string') {
                date = new Date(date);
            }

            const day = padToTwoDigits(date.getDate());
            const month = padToTwoDigits(date.getMonth() + 1); // Janeiro é 0!
            const year = date.getFullYear().toString().slice(-2); // Pega os dois últimos dígitos do ano

            const hours = padToTwoDigits(date.getHours());
            const minutes = padToTwoDigits(date.getMinutes());
            const seconds = padToTwoDigits(date.getSeconds());

            return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        },
        formatarCelular(numero: string): string {
            // Verifica se o número tem o tamanho adequado para ser um celular válido no Brasil
            if (numero.length === 11) {
                const DDD = numero.slice(0, 2); // Pega os dois primeiros números (DDD)
                const parte1 = numero.slice(2, 7); // Pega os próximos 5 números
                const parte2 = numero.slice(7, 11); // Pega os últimos 4 números
                return `(${DDD}) ${parte1}-${parte2}`;
            }
            // Retorna o número sem formatação caso não tenha o tamanho esperado
            return numero;
        }


    },

});
</script>
