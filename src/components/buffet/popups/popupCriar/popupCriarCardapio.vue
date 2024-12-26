<template>
    <div class="backdrop" @click.self="close">
        <form :class="{ 'with-dynamic-items': filteredGroups.length > 0 }">
            <h4 v-if="isEditMode">Editar Cardápio</h4>
            <h4 v-else>Criar Cardápio</h4>
            <div class="form-columns">
                <div class="form-column">
                    <label>Nome:</label>
                    <input type="text" required class="especial" v-model="nomeCardapio">
                    <label>Preço:</label>
                    <input type="number" required class="especial" v-model="precoCardapio">

                    <label>Tipo:</label>
                    <VueMultiselect v-model="tipoCardapio" :options="opcTipoCardapio" :multiple="false"
                        :close-on-select="true" :show-labels="false" :preselect-first="true"></VueMultiselect>

                    <label>Link:</label>
                    <input type="text" required class="especial" v-model="linkCardapio">

                    <label>Itens:</label>
                    <VueMultiselect v-model="items" :options="itensAgrupados" :multiple="true" :close-on-select="false"
                        group-values='itens' group-label='grupo' :group-select="true" :show-labels="false"
                        :preserve-search="true" placeholder="Escolha os itens..." label="name" track-by="idItem"
                        :preselect-first="false" :max-height="250"></VueMultiselect>
                </div>

                <!-- Seção Dinâmica -->
                <div v-if="filteredGroups.length > 0" class="form-column">
                    <div v-for="group in filteredGroups" :key="group.grupo">
                        <label>{{ group.grupo }}</label>
                        <input type="number" v-model="inputValues[group.grupo]"
                            placeholder="Quantidade que pode escolher...">
                    </div>
                </div>
            </div>

            <button type="submit" class="submit-button" @click.prevent="submitCardapio">
                {{ isEditMode ? 'Salvar Alterações' : 'Criar' }}
            </button>
        </form>
    </div>
</template>

<script lang="ts">
import instance from '@/common/utils/AuthService';
import { CardapioInfo, Item, GroupedItem } from '@/common/utils/Interfaces/Buffet/Cardapio';
import { CardapioGrupos, UpdateCardapio, RegistroCardapio } from '@/common/utils/Interfaces/Buffet/Registro';
import { defineComponent, PropType } from 'vue';
import VueMultiselect from 'vue-multiselect';

export default defineComponent({
    name: 'PopupOrcamento',
    components: { VueMultiselect },
    props: {
        cardapioData: {
            type: Object as PropType<CardapioInfo | null>,
            default: null
        },
        isEditMode: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            idCardapio: 0,
            nomeCardapio: '',
            precoCardapio: 0,
            tipoCardapio: '',
            opcTipoCardapio: ['Padrão', 'Personalizado'],
            linkCardapio: '',

            cardapioGrupos: [] as CardapioGrupos[],
            selectedItemsIds: [] as number[],

            items: [] as Item[],
            inputValues: {} as Record<string, string>, // Para armazenar os valores dos inputs dinâmicos
            itensAgrupados: [] as GroupedItem[],

        };
    },
    methods: {
        close() {
            this.$emit('close');
        },
        async fetchItensAgrupados() {
            try {
                let response = await instance.get<GroupedItem[]>('/buffet/itensAgrupados');
                this.itensAgrupados = response.data;


            } catch (error) {
                console.error('Erro ao achar itens agrupados:', error);
            }
        },

        async submitCardapio() {
            try {
                // Construir o array de IDs dos itens selecionados
                this.selectedItemsIds = this.items.map((item: Item) => item.idItem);

                console.log(this.selectedItemsIds)

                // Construir o array de CardapioGrupos
                this.cardapioGrupos = this.filteredGroups.map(group => {
                    return {
                        idGrupo: group.itens[0].Grupo_idGrupo,
                        qtdItens: parseInt(this.inputValues[group.grupo] || '0'),
                    };
                });

                let payload;


                let response;
                if (this.isEditMode && this.cardapioData) {
                    // Modo de Edição
                    payload = {
                        idCardapio: this.idCardapio,
                        nomeCardapio: this.nomeCardapio,
                        precoCardapio: this.precoCardapio,
                        linkCardapio: this.linkCardapio,
                        tipo: this.tipoCardapio,
                        items: this.selectedItemsIds,
                        grupos: this.cardapioGrupos,
                    } as UpdateCardapio;

                    response = await instance.put(`/buffet/cardapio/update/${payload.idCardapio}`, payload);
                } else {
                    // Modo de Criação

                    payload = {
                        nomeCardapio: this.nomeCardapio,
                        precoCardapio: this.precoCardapio,
                        linkCardapio: this.linkCardapio,
                        tipo: this.tipoCardapio,
                        items: this.selectedItemsIds,
                        grupos: this.cardapioGrupos,
                    } as RegistroCardapio;

                    response = await instance.post('/buffet/criar-cardapio', payload);
                }

                window.location.reload();

            } catch (error) {
                alert('Erro ao salvar o cardápio!');
            }
        }
    },
    mounted() {
        this.fetchItensAgrupados();
    },
    computed: {
        filteredGroups(): GroupedItem[] {
            return this.itensAgrupados.filter((group: GroupedItem) => {
                return this.items.some((item: Item) => item.Grupo_idGrupo === group.itens[0].Grupo_idGrupo);
            });
        },
    },

    watch: {
        cardapioData: {
            immediate: true,
            handler(newData) {
                if (newData && newData.cardapio) {
                    // Preenchendo campos básicos
                    this.idCardapio = newData.cardapio.idCardapio;
                    this.nomeCardapio = newData.cardapio.nome;
                    this.precoCardapio = newData.cardapio.preco;
                    this.linkCardapio = newData.cardapio.linkCardapio;
                    this.tipoCardapio = newData.cardapio.tipo;

                    // Verificando se 'itensAgrupados' existe e preenchendo 'items' para o VueMultiselect
                    if (Array.isArray(newData.cardapio.itensAgrupados)) {
                        this.items = newData.cardapio.itensAgrupados.flatMap((group: GroupedItem) => group.itens);
                    }

                    // Preenchendo as quantidades de itens por grupo em 'inputValues'
                    if (Array.isArray(newData.cardapio.grupos)) {
                        newData.cardapio.grupos.forEach((grupo: { nomeGrupo: string; qtdItens: number }) => {
                            this.inputValues[grupo.nomeGrupo] = grupo.qtdItens.toString() || '';
                        });
                    }
                }
            }
        }
    }
});
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style scoped>
form {
    max-width: 400px;
    /* Largura padrão */
    margin: 30px auto;
    background: white;
    text-align: left;
    padding: 20px;
    border-radius: 10px;
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
}

form.with-dynamic-items {
    max-width: 800px;
    /* Aumentar largura quando houver itens dinâmicos */
}

.form-columns {
    display: flex;
    justify-content: space-between;
}

.form-column {
    flex: 1;
    margin-right: 20px;
}

.form-column:last-child {
    margin-right: 0;
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

input:focus {
    outline: none;
}

.especial:focus {
    outline: none;
    border-color: #2F4036;
    box-shadow: 0 0 10px #2F4036;
}
</style>
