<template>
    <div class="backdrop" @click.self="close">
        <form class="modal-form">
            <h4>{{ item.nomeItem }}</h4><br>

            <label>Id:</label>
            <input type="number" disabled v-model="item.idItem">

            <label>Nome:</label>
            <input type="text" required v-model="item.nomeItem">

            <label>Unidade</label>
            <select v-model="item.unidade">
                <option>Gramas</option>
                <option>Mililitros</option>
                <option>Unidades</option>
            </select>

            <label>Consumo por Pessoa:</label>
            <input type="number" required v-model.number="item.consumoPorPessoa">

            <label>Grupo:</label>
            <select v-model="item.Grupo_idGrupo">
                <option v-for="grupo in grupos" :key="grupo.idGrupo" :value="grupo.idGrupo">{{ grupo.nomeGrupo }}
                </option>
            </select>

            <label>Base Receita:</label>
            <input disabled type="number" required v-model.number="item.baseReceita">

            <label>Custo:</label>
            <input disabled type="text" :value="formatarValorMonetarioCusto(item.custo)">

            <label>Valor:</label>
            <input disabled type="text" :value="formatarValorMonetarioCusto(item.valor)">

            <div class="form-group">
                <button type="submit" class="submit-button" @click="atualizarValor()">Atualizar</button>
                <button type="submit" class="submit-button" @click="abrirFichaTecnica()">Ficha Técnica</button>
            </div>

        </form>
    </div>

    <FichaTecnica v-if="fichaTecnicaModalAberto" :itemId="item.idItem" @close="fecharFichaTecnica"
        :baseReceita="item.baseReceita" @update-custo="atualizarCusto" @sucess="handleSuccessMessage" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ItemInfo } from '@/common/utils/Interfaces/Buffet/Buffet';
import instance from '@/common/utils/AuthService';
import FichaTecnica from '../FichaTecnica.vue';
import { Grupo } from '@/common/utils/Interfaces/Buffet/Cardapio';
import { fetchGrupos } from '@/common/utils/Helper/FetchMethods';
import { formatarValorMonetarioCusto } from '@/common/utils/Helper/Monetario';


export default defineComponent({
    components: { FichaTecnica },
    props: {
        cardId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            item: {} as ItemInfo,
            loading: false,
            grupos: [] as Grupo[],
            fichaTecnicaModalAberto: false,
            message: ''

        };
    },
    methods: {
        formatarValorMonetarioCusto,
        close() {
            this.$emit('close');
        },

        async fetchItemDetails(id: number) {
            this.loading = true;
            try {
                const response = await instance.get<ItemInfo>('/buffet/item/' + id);
                this.item = response.data;
            } catch (error) {
                console.error('Erro ao buscar detalhes do item:', error);
            } finally {
                this.loading = false;
            }
        },

        abrirFichaTecnica() {
            this.fichaTecnicaModalAberto = true;
        },

        fecharFichaTecnica() {
            this.fichaTecnicaModalAberto = false;
        },

        async atualizarValor() {
            const itemAtualizado: ItemInfo = {
                idItem: this.item.idItem,
                nomeItem: this.item.nomeItem,
                unidade: this.item.unidade,
                consumoPorPessoa: this.item.consumoPorPessoa,
                Grupo_idGrupo: this.item.Grupo_idGrupo,
                baseReceita: this.item.baseReceita,
                custo: this.item.custo || 0,
                valor: this.item.valor || 0
            }

            try {
                const data = await instance.post('buffet/item/update', itemAtualizado)
                this.$emit('success', 'Item atualizado com sucesso!');
                //this.close(); // Fecha o modal após o sucesso
            } catch (error) {
                this.$emit('error', 'Item atualizado com sucesso!');
            }
        },

        atualizarCusto(novoCusto: number) {
            this.item.custo = novoCusto; // Atualiza o valor do custo no modal de Edit Item
        },

        handleSuccessMessage(message: string) {
            this.message = message;
            setTimeout(() => {
                this.message = '';
            }, 3000);
        },

    },
    async mounted() {
        this.grupos = await fetchGrupos()
    },
    watch: {
        cardId: {
            immediate: true,
            handler(newId: number) {
                if (newId) {
                    this.fetchItemDetails(newId);
                }
            }
        }
    },
});
</script>

<style scoped>
@import '../../../../assets/styles/modal-style.css'
</style>