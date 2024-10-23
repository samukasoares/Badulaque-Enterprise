<template>
    <div class="backdrop" @click.self="close">
        <form class="modal-form">
            <div class="content">
            </div>

            <div class="form-group">
                <button class="submit-button">Visualizar PDF</button>
            </div>

        </form>
    </div>


</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Cardapio, Cerveja } from '@/common/utils/Interfaces';
import instance from '@/common/utils/AuthService';
import { OrcamentoOpcional } from '@/common/utils/Interfaces/Orcamento';
import { formatarValorMonetario } from '@/common/utils/Helper';
import { gerarPDFDoHtml } from '@/common/utils/pdfService';


export default defineComponent({
    props: {
        contratoId: {
            type: Number,
            required: false,
            default: null,
        },
    },
    data() {
        return {
            //Cliente
            id: '',
            nome: '',
            email: '',
            cidade: '',
            telefone: '',

            //Data
            data: '',
            dataEventoRaw: '',

            //Orçamento
            convidados: '',
            referencia: '',
            cerimonia: '',
            totalProposta: '',
            dataCriação: '',
            tipoEvento: '',
            dataEnvio: '',
            observacoes: '',

            //Espaço
            diaSemana: '',
            valorEspaco: '',

            //Cardapio
            cardapioBuffet: '',
            cardapioBuffetId: 0,
            valorCardapio: '',

            //Cerveja
            tipoBebida: '',
            tipoBebidaId: 0,


            valorCerveja: '',
            valorPorPessoaBuffet: '',
            valorTotalBuffet: '',
            cardapioBar: '',
            valorPorPessoaBar: '',
            valorTotalBar: '',
            valorNoiva: '',
            valorCabine: '',
            valorOpcionais: '',
            loading: false,
            isEditing: false,


            opcionaisSelecionados: [] as OrcamentoOpcional[],
            sinal1: '',

            sinalEntrada: '',
            parcelasEntrada: '',
            valorEntrada: '',
            valorParcelasEntrada: '',
            saldoEntrada: '',

            sinalAVista: '',
            valorAVista: '',

            sinalParcelado: '',
            parcelasParcelado: '',
            valorParcelas: '',

            //Objetos que armazenam todas as opções
            cardapios: [] as Cardapio[],
            cervejas: [] as Cerveja[]
        };
    },

    methods: {
        close() {
            this.$emit('close');
        },
        formatarValorMonetario,
    },


});
</script>

<style scoped>
@import '../../../assets/styles/modal-style.css'
</style>