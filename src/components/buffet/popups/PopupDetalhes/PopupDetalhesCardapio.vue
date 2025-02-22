<template>
    <div class="backdrop" @click.self="close">
        <form class="modal-form">
            <div v-if="cardapio">
                <!-- Nome do Cardápio -->
                <h4>{{ cardapio.cardapio.nome }}</h4><br>

                <div class="valores-container">
                    <div class="valor-item">
                        <label>Custo: </label>
                        <h4>{{ formatarValorMonetario(cardapio.custoTotal) }}</h4>
                    </div>
                    <div class="valor-item">
                        <label>Preço Sugerido: </label>
                        <h4>R$ 0.00</h4>
                    </div>
                </div>
                <div class="valores-container">
                    <div class="valor-item">
                        <label>{{ currentYear }}:</label>
                        <h4>{{ formatarValorMonetario(reajusteCardapio.atual) }}</h4>
                    </div>
                    <div class="valor-item">
                        <label>{{ currentYear + 1 }}:</label>
                        <h4>{{ formatarValorMonetario(reajusteCardapio.ano1) }}</h4>
                    </div>
                    <div class="valor-item">
                        <label>{{ currentYear + 2 }}:</label>
                        <h4>{{ formatarValorMonetario(reajusteCardapio.ano2) }}</h4>
                    </div>
                </div>


                <!-- Exibição dos Grupos e Itens -->
                <div v-for="(grupo, index) in cardapio.cardapio.grupos" :key="index">
                    <!-- Nome do Grupo e Quantidade de Itens -->
                    <label>{{ grupo.nomeGrupo }} - {{ grupo.qtdItens }} opção(es)</label>

                    <p>
                        <span v-for="(item, itemIndex) in getItensDoGrupo(grupo.nomeGrupo)" :key="itemIndex">
                            {{ item.name }}<span class="itemCardapio"
                                v-if="itemIndex < getItensDoGrupo(grupo.nomeGrupo).length - 1">,
                            </span>
                        </span>
                    </p>
                </div>
            </div>
            <div v-else>
                <p>Carregando...</p>
            </div>
            <div class="form-row">
                <div class="form-column">
                    <button class="submit-button" @click="gerarPDF()">Imprimir</button>
                </div>
                <div class="form-column">
                    <button class="submit-button" @click.prevent="emitEditEvent">Editar </button>
                </div>
            </div>

        </form>

    </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import instance from '@/common/utils/AuthService';
import { Reajuste } from '@/common/utils/Interfaces/Helper';
import { gerarPDFDoHtml } from '@/common/utils/pdfService';
import { CardapioInfo, GroupedItem } from '@/common/utils/Interfaces/Buffet/Cardapio';
import { formatarValorMonetario } from '@/common/utils/Helper/Monetario';

export default defineComponent({
    props: {
        cardId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            cardapio: null as CardapioInfo | null,
            loading: false,
            currentYear: new Date().getFullYear(),
            reajusteCardapio: {} as Reajuste,
            custoTotal: 0
        };
    },
    methods: {
        formatarValorMonetario,
        emitEditEvent() {
            this.$emit('edit-cardapio', this.cardapio);
        },
        async fetchCardapioDetails(id: number) {
            this.loading = true;
            try {
                const response = await instance.get<CardapioInfo>('/buffet/cardapio/' + id);
                this.cardapio = response.data;
            } catch (error) {
                console.error('Erro ao buscar detalhes do cardápio:', error);
            } finally {
                this.loading = false;
            }
        },

        async fetchValoresCardapio(id: number) {
            try {
                const response = await instance.get<Reajuste>('buffet/cardapio/reajuste/' + id);
                this.reajusteCardapio = response.data;
            } catch (error) {
                console.error('Erro ao buscar detalhes do cardápio:', error);
            } finally {
                this.loading = false;
            }
        },

        getItensDoGrupo(nomeGrupo: string) {
            // Verifica se há cardápio e itens agrupados
            if (!this.cardapio || !Array.isArray(this.cardapio.cardapio.itensAgrupados)) {
                return [];
            }

            // Define explicitamente o tipo de 'grupo' como GrupoItem
            const grupoEncontrado = this.cardapio.cardapio.itensAgrupados.find((grupo: GroupedItem) => grupo.grupo === nomeGrupo);

            // Retorna os itens do grupo encontrado, ou uma lista vazia se não encontrar
            return grupoEncontrado ? grupoEncontrado.itens : [];
        },

        preencherTemplate(template: string) {
            if (!this.cardapio) {
                console.error('Cardápio não encontrado');
                return '';
            }

            // Formatar os valores monetários
            const valorAtualFormatado = this.formatarValorMonetario(this.reajusteCardapio.atual);
            const valorAno1Formatado = this.formatarValorMonetario(this.reajusteCardapio.ano1);
            const valorAno2Formatado = this.formatarValorMonetario(this.reajusteCardapio.ano2);

            // Obter os anos
            const currentYear = this.currentYear;
            const nextYear = this.currentYear + 1;
            const yearAfterNext = this.currentYear + 2;

            // Construção dos itens do cardápio em HTML
            const gruposHTML = this.cardapio.cardapio.grupos
                .sort((a, b) => a.sequencia - b.sequencia) // Ordenar pelo atributo "sequencia"
                .map(grupo => {
                    const itensDoGrupo = this.getItensDoGrupo(grupo.nomeGrupo);

                    // Verifica se `itensDoGrupo` é um array válido e contém itens
                    const itens = Array.isArray(itensDoGrupo) && itensDoGrupo.length > 0
                        ? itensDoGrupo.map((item: { name: string }) => `<span>${item.name}</span>`).join(', ')
                        : '<span>Itens não encontrados</span>';

                    return `<div class="titulo"><strong>${grupo.nomeGrupo ? grupo.nomeGrupo : 'Grupo indefinido'} - ${grupo.qtdItens ? grupo.qtdItens : 0} opção(es)</strong> <br>${itens}</div>`;
                }).join('');

            return template
                .replace('{{nome}}', this.cardapio.cardapio.nome)
                .replace('{{currentYear}}', currentYear.toString())
                .replace('{{nextYear}}', nextYear.toString())
                .replace('{{yearAfterNext}}', yearAfterNext.toString())
                .replace('{{valorAtual}}', valorAtualFormatado)
                .replace('{{valorAno1}}', valorAno1Formatado)
                .replace('{{valorAno2}}', valorAno2Formatado)
                .replace('{{grupos}}', gruposHTML);

        },

        async gerarPDF() {
            try {
                const templatePath = '/template-cardapio.html';
                const response = await fetch(templatePath);
                let template = await response.text();

                // Preenche o template com os dados do cardápio
                template = this.preencherTemplate(template);

                await gerarPDFDoHtml(template, "Cardápio" + this.cardapio?.cardapio.nome || "Cardápio");

            } catch (error) {
                console.error('Erro ao carregar o template:', error);
            }
        },

        close() {
            this.cardapio = null; // Limpar dados quando fechar o modal
            this.$emit('close');
        }
    },
    watch: {
        cardId: {
            immediate: true,
            handler(newId: number) {
                if (newId) {
                    this.fetchCardapioDetails(newId);
                    this.fetchValoresCardapio(newId);
                }
            }
        }
    }
});
</script>

<style scoped>
@import '../../../../assets/styles/modal-style.css'
</style>