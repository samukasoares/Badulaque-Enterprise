<template>
    <div class="backdrop" @click.self="close">
        <form class="modal-form">
            <div v-if="cardapio">
                <!-- Nome do Cardápio -->
                <h4>{{ cardapio.cardapio.nome }}</h4>

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
        </form>
    </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import instance from '@/common/utils/AuthService';
import { CardapioInfo, GroupedItem } from '@/common/utils/Interfaces';

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
            loading: false
        };
    },
    methods: {
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
                }
            }
        }
    }
});
</script>

<style scoped>
@import '../../../../assets/styles/modal-style.css'
</style>