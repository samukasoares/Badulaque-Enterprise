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
                <td><button class="action-button" @click="enviarPDF(orcamento.idOrcamento)"><i
                            class="fa-solid fa-share"></i></button></td>
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
    <NotificationMessage :message="message" />

    <PopupOrcamento v-if="showModal" @close="showModal = false" @success="handleSuccessMessage" />
    <PopupDetalhes v-if="showDetailModal" @close="closeDetailModal" :orcamentoId="orcamentoSelecionado?.idOrcamento"
        @orcamentoAtualizado="fetchOrcamentos" />
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import PopupOrcamento from '@/components/orçamento/popups/PopupCriarOrcamento.vue';
import NotificationMessage from '@/views/NotificationMessage.vue';
import instance from '@/common/utils/AuthService';
import { AllOrcamentos, Orcamento, OrcamentoBasico, OrcamentoOpcional } from '@/common/utils/Interfaces/Orcamento';
import PopupDetalhes from './popups/PopupDetalhesOrcamento.vue';
import { gerarPDFDoHtml, gerarPDFDoHtmlWhatsapp } from '@/common/utils/pdfService';
import { formatarDataExtenso, formatarDateToString } from '@/common/utils/Helper/Data';
import { Cardapio } from '@/common/utils/Interfaces';
import { formatarValorMonetario } from '@/common/utils/Helper';
import { fetchCardapios } from '@/common/utils/FetchMethods';
import { gerarMensagemWhatsApp } from '@/common/utils/Helper/Whatsapp';

export default defineComponent({
    components: { PopupOrcamento, NotificationMessage, PopupDetalhes },
    data() {
        return {
            showModal: false,
            showDetailModal: false,
            selectedRow: null as number | null,
            searchQuery: '',
            message: '',
            status: 'pendentes' as keyof AllOrcamentos,

            orcamentos: {} as AllOrcamentos,
            orcamentoSelecionado: null as OrcamentoBasico | null,

            cardapios: [] as Cardapio[],
            cardapiosReajustados: [] as { id: number; nome: string; precoReajustado: number }[],
            opcionaisSelecionados: [] as OrcamentoOpcional[],
            links: [] as string[],

            sinalAVista: '',
            valorAVista: '',
            sinalEntrada: '',
            parcelasEntrada: '',
            valorEntrada: '',
            saldoEntrada: '',
            valorParcelasEntrada: '',
            sinalParcelado: '',
            parcelasParcelado: '',
            valorParcelas: '',

            // Variáveis de paginação
            currentPage: 1,
            itemsPerPage: 20,
        };
    },
    async mounted() {
        this.fetchOrcamentos();
        this.cardapios = await fetchCardapios();
        await this.loadLinks();
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
        formatarValorMonetario,
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
            this.message = message;
            this.fetchOrcamentos();
            setTimeout(() => {
                this.message = '';
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

        async loadLinks() {
            try {
                const response = await fetch("/links-orcamentos.json");
                if (!response.ok) throw new Error("Falha ao carregar o arquivo de links");
                this.links = await response.json();
            } catch (error) {
                console.error("Erro ao carregar links:", error);
                this.links = []; // Define como um array vazio caso o carregamento falhe
            }
        },

        calcularDiferencaAnos(data: string) {
            // Verificar se a data está no formato `yyyy-MM-dd`
            const [ano, mes, dia] = data.split('-').map(Number);

            if (isNaN(dia) || isNaN(mes) || isNaN(ano)) {
                console.error("Erro: Uma ou mais partes da data não são números.");
                return 0; // Retorna 0 como padrão se a data estiver inválida
            }

            // Criar um objeto Date com base na data fornecida
            const dataEvento = new Date(ano, mes - 1, dia); // Meses são indexados a partir de 0 em JavaScript

            // Obter o ano atual
            const anoAtual = new Date().getFullYear();

            // Calcular a diferença de anos
            const diferenca = dataEvento.getFullYear() - anoAtual;

            return diferenca;
        },

        async fetchCardapiosReajustados(ano: number) {
            try {
                const response = await instance.post('/buffet/cardapio/reajustes', { ano });
                const reajustes = response.data;
                // Formata os cardápios com os valores reajustados
                this.cardapiosReajustados = this.cardapios.map(cardapio => {
                    const reajusteEncontrado = reajustes.find((item: any) => item.cardapio === cardapio.nomeCardapio);
                    return {
                        id: cardapio.idCardapio,
                        nome: cardapio.nomeCardapio,
                        precoReajustado: reajusteEncontrado ? reajusteEncontrado.reajuste : cardapio.precoCardapio
                    };
                });
            } catch (error) {
                console.error("Erro ao obter valores reajustados dos cardápios:", error);
            }
        },

        async enviarPDF(idOrcamento: number) {
            try {
                // Busca o orçamento com base no ID
                const response = await instance.get(`/orcamento/get/${idOrcamento}`);
                const orcamento = response.data;

                // Define o índice do link com base no id do orçamento
                const linkIndex = idOrcamento % this.links.length;
                const linkOrcamento = this.links[linkIndex];

                const dataEvento = orcamento.dataEvento.slice(0, 10); // Supondo que dataEvento seja uma string no formato 'YYYY-MM-DD'
                const ano = this.calcularDiferencaAnos(dataEvento);

                await this.fetchCardapiosReajustados(ano)

                this.opcionaisSelecionados = orcamento.Orcamento_Opcional

                // Carrega o template HTML e o preenche com os dados do orçamento
                const templatePath = '/template-orcamento.html';
                const templateResponse = await fetch(templatePath);
                let template = await templateResponse.text();

                // Preenche o template com os dados do orçamento
                template = this.preencherTemplate(template, orcamento);

                // Gera o PDF em Blob usando a função gerarPDFDoHtmlWhatsapp
                const pdfContent = await gerarPDFDoHtmlWhatsapp(template, orcamento.referencia);

                // Verifica se pdfContent é um Blob e cria o FormData
                if (pdfContent instanceof Blob) {
                    const formData = new FormData();
                    formData.append("file", pdfContent, `Orcamento.pdf`);

                    // Envia o FormData para o backend, incluindo o idContrato na URL
                    await instance.post(`/orcamento/post-pdf/${idOrcamento}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });

                    this.message = 'PDF enviado com sucesso!';
                } else {
                    console.error("Erro: O conteúdo do PDF não é um Blob.");
                }

                // Montando a mensagem de WhatsApp
                const mensagemWhatsApp = gerarMensagemWhatsApp(orcamento, linkOrcamento);

                // Formata o número de telefone removendo caracteres especiais
                const numeroTelefone = orcamento.Lead.celular.replace(/[^\d]/g, '');

                // Cria o link para o WhatsApp com a mensagem formatada
                const whatsappUrl = `https://web.whatsapp.com/send?phone=55${numeroTelefone}&text=${encodeURIComponent(mensagemWhatsApp)}`;

                // Abre o link em uma nova aba
                window.open(whatsappUrl, '_blank');

                const enviado = await instance.put(`/orcamento/atualizar-enviado/${idOrcamento}`);

                await this.fetchOrcamentos();

            } catch (error) {
                console.error('Erro ao enviar PDF:', error);
                this.message = 'Erro ao enviar PDF';
            }
        },

        preencherTemplate(template: string, orcamento: Orcamento): string {
            const cardapiosHTML = this.cardapiosReajustados.map(cardapio => {
                return `<span class="flex-item-estrutura"><strong>${cardapio.nome}:</strong><span> ${this.formatarValorMonetario(cardapio.precoReajustado)}</span></span>`;
            }).join('');

            const opcionaisSelecionadosHTML = this.opcionaisSelecionados.map(opcional => {
                return `<span class="flex-item-estrutura"><strong>${opcional.Opcional.nomeOpcional}:</strong><span> ${this.formatarValorMonetario(opcional.valorOrcamento)}</span></span>`;
            }).join('');

            orcamento.FormaPagamento.forEach((forma) => {
                if (forma.tipo === 'À Vista') {
                    this.sinalAVista = formatarValorMonetario(forma.valorSinal);
                    this.valorAVista = formatarValorMonetario(forma.valorTotal);
                }

                if (forma.tipo === 'Entrada Parcelada') {
                    this.sinalEntrada = formatarValorMonetario(forma.valorSinal);
                    this.parcelasEntrada = (forma.numeroParcelasEntrada).toString();
                    this.valorEntrada = formatarValorMonetario(forma.valorEntrada);
                    this.saldoEntrada = formatarValorMonetario(forma.valorTotal - forma.valorEntrada);
                    this.valorParcelasEntrada = formatarValorMonetario(forma.valorParcela);
                }

                if (forma.tipo === 'Parcelado') {
                    this.sinalParcelado = formatarValorMonetario(forma.valorSinal);
                    this.parcelasParcelado = (forma.numeroParcelas).toString();
                    this.valorParcelas = formatarValorMonetario(forma.valorParcela);
                }

            })

            return template
                .replace('{{id}}', orcamento.idOrcamento.toString())
                .replace('{{referencia}}', orcamento.referenciaOrcamento)
                .replace('{{nome}}', orcamento.Lead.nomeLead)
                .replace('{{cidade}}', orcamento.Lead.cidade)
                .replace('{{telefone}}', orcamento.Lead.celular)
                .replace('{{tipoEvento}}', orcamento.tipoEvento)
                .replace('{{data}}', formatarDataExtenso(orcamento.dataEvento))
                .replace('{{convidados}}', orcamento.numConvidados.toString())
                .replace('{{totalProposta}}', formatarValorMonetario(orcamento.valorTotalOrcamento))
                .replace('{{dataEnvio}}', orcamento.enviadoEm ? formatarDateToString(orcamento.enviadoEm) : '-')
                .replace('{{observacoes}}', orcamento.observacoesOrcamento)
                .replace('{{valorEspaco}}', formatarValorMonetario(orcamento.valorEspacoFinal))
                .replace('{{cardapioBar}}', orcamento.CardapioBar.nomeCardapioBar)
                .replace('{{valorPorPessoaBar}}', formatarValorMonetario(orcamento.valorPPBar))
                .replace('{{cardapios}}', cardapiosHTML)
                .replace('{{opcionais}}', opcionaisSelecionadosHTML)
                .replace('{{totalOpcionais}}', formatarValorMonetario(orcamento.valorOpcionais + (orcamento.valorPPBar * orcamento.numConvidados)))
                .replace('{{cerimonia}}', orcamento.cerimoniaLocal === 1 ? 'Sim' : 'Não')
                .replace('{{cardapioBuffet}}', orcamento.Cardapio.nomeCardapio)
                .replace('{{valorCardapio}}', formatarValorMonetario(orcamento.valorPPCardapio))
                .replace('{{tipoBebida}}', orcamento.Cerveja.nome)
                .replace('{{valorCerveja}}', formatarValorMonetario(orcamento.valorPPCerveja))
                .replace('{{valorPorPessoaBuffet}}', formatarValorMonetario(orcamento.valorPPCardapio + orcamento.valorPPCerveja).toString())
                .replace('{{valorTotalBuffet}}', formatarValorMonetario((orcamento.valorPPCardapio + orcamento.valorPPCerveja) * orcamento.numConvidados))
                .replace('{{valorTotalBar}}', formatarValorMonetario((orcamento.valorPPBar * orcamento.numConvidados)))

                .replace('{{sinalAVista}}', this.sinalAVista)
                .replace('{{valorAVista}}', this.valorAVista)

                .replace('{{sinalEntrada}}', this.sinalEntrada)
                .replace('{{parcelasEntrada}}', this.parcelasEntrada)
                .replace('{{valorEntrada}}', this.valorEntrada)
                .replace('{{saldoEntrada}}', this.saldoEntrada)
                .replace('{{valorParcelasEntrada}}', this.valorParcelasEntrada)

                .replace('{{sinalParcelado}}', this.sinalParcelado)
                .replace('{{parcelasParcelado}}', this.parcelasParcelado)
                .replace('{{valorParcelas}}', this.valorParcelas)
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
