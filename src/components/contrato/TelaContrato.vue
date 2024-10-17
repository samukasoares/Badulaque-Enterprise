<template>
    <div class="barraOpcoes">
        <button @click="showModal = true">Novo Contrato</button>
        <div class="group">
            <label>Status:</label>
            <select>
                <option>Ativo</option>
                <option>Realizado</option>
            </select>
        </div>
        <input type="text" placeholder="Pesquisar Contratos...">
        <div class="groupConsolidado">
            <label>Ativos:</label>
            <label>52</label>
        </div>
        <div class="groupConsolidado">
            <label>Cerimônia:</label>
            <label>43</label>
        </div>
        <div class="groupConsolidado">
            <label>Bar:</label>
            <label>20</label>
        </div>
        <div class="groupConsolidado">
            <label>Noiva:</label>
            <label>12</label>
        </div>
        <div class="groupConsolidado">
            <label>Cabine:</label>
            <label>15</label>
        </div>
        <div class="groupConsolidado">
            <label>Faturamento:</label>
            <label>R$900.000,00</label>
        </div>
    </div>

    <table>
        <tr>
            <th>Data</th>
            <th>Cliente</th>
            <th>Contato</th>
            <th>Tipo</th>
            <th>Convidados</th>
            <th>Cardápio</th>
            <th>Total Contrato</th>
            <th>Assinado</th>
            <th>Definir Cardápio</th>
            <th>Pagamentos</th>
            <th>Recebimentos</th>
        </tr>
        <tr v-for="(contrato, index) in contratos" :key="contrato.idContrato"
            :class="{ 'selected-row': selectedRow === index }">
            <td>{{ formatarData(contrato.Orcamento.dataEvento) }}</td>
            <td>{{ contrato.Orcamento.Lead.nomeLead }}</td>
            <td>{{ contrato.Orcamento.Lead.celular }}</td>
            <td>{{ contrato.Orcamento.tipoEvento }}</td>
            <td>{{ contrato.Orcamento.numConvidados }}</td>
            <td>{{ contrato.Orcamento.Cardapio.nomeCardapio }}</td>
            <td>{{ formatarValorMonetario(contrato.Orcamento.FormaPagamento[2].valorTotal) }}</td>
            <td><input type="checkbox" class="custom-checkbox" v-model="contrato.assinado"
                    @change="atualizarAssinado(contrato)"></td>
            <td><i class="fa-solid fa-edit action-icon"></i></td>
            <td><i class="fa-solid fa-hand-holding-dollar action-icon"></i></td>
            <td><i class="fa-solid fa-sack-dollar action-icon"></i></td>
        </tr>
    </table>

    <PopupCriarContrato v-if="showModal" @close="showModal = false" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PopupCriarContrato from '../contrato/popups/PopupCriarContrato.vue'
import { Contrato } from '@/common/utils/Interfaces/Contrato';
import { formatarData } from '@/common/utils/Helper/Data';
import { fetchContratos } from '@/common/utils/FetchMethods';
import { formatarValorMonetario } from '@/common/utils/Helper';

export default defineComponent({
    components: { PopupCriarContrato },
    data() {
        return {
            showModal: false,

            contratos: [] as Contrato[],
            searchQuery: '',
            showDetailModal: false,
            selectedRow: null as number | null,
        }
    },
    methods: {
        formatarData, formatarValorMonetario,

        async atualizarAssinado(contrato: Contrato) {
            try {
                // Crie o payload com o novo valor de "assinado"
                const payload = {
                    idContrato: contrato.idContrato,
                    assinado: contrato.assinado
                };

            } catch (error) {
                console.error('Erro ao tentar atualizar o contrato:', error);
            }
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

input,
select {
    border-radius: 5px;
    padding: 10px;
    border: none;
    font-family: MontSerrat;
}

input:focus {
    outline: none;
    border-color: #2F4036;
    box-shadow: 0 0 10px #2F4036;
}

select:focus {
    outline: none;
    border-color: #2F4036;
    box-shadow: 0 0 10px #2F4036;
}
</style>