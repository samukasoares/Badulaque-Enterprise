<template>
    <div class="backdrop" @click.self="close">
        <div class="modal">
            <div class="content">
                <div class="group">
                    <h4>Geral</h4>
                    <div class="formgroup">
                        <label>ID:</label>
                        <input ref="id" disabled type="text">
                    </div>
                    <div class="formgroup">
                        <label>Referência:</label>
                        <input ref="referencia" disabled type="text">
                    </div>
                    <div class="formgroup">
                        <label>Nome:</label>
                        <input ref="nome" disabled type="text">
                    </div>
                    <div class="formgroup">
                        <label>Tipo de Evento:</label>
                        <input ref="tipoEvento" disabled type="text">
                    </div>
                    <div class="formgroup">
                        <label>Data:</label>
                        <input ref="data" disabled type="text">
                    </div>
                    <div class="formgroup">
                        <label>Convidados:</label>
                        <input ref="convidados" disabled type="text">
                    </div>
                    <div class="formgroup">
                        <label>Total Proposta:</label>
                        <input ref="totalProposta" disabled type="text">
                    </div>
                    <h4>Controle</h4>
                    <div class="formgroup">
                        <label>Data Envio:</label>
                        <input ref="dataEnvio" disabled type="text">
                    </div>
                    <div class="formgroup">
                        <label>Hora Envio:</label>
                        <input ref="horaEnvio" disabled type="text">
                    </div>
                    <h4>Observações</h4>
                    <div class="formgroup">
                        <input ref="observacoes" disabled type="text" class="textarea">
                    </div>
                </div>
                <div class="group">
                    <h4>Espaço</h4>
                    <div class="formgroup">
                        <label>Dia da Semana:</label>
                        <input ref="diaSemana" disabled type="text">
                    </div>
                    <div class="formgroup">
                        <label>Valor:</label>
                        <input ref="valorEspaco" disabled type="text">
                    </div>
                    <h4>Buffet</h4>
                    <div class="formgroup">
                        <label>Cardápio:</label>
                        <input ref="cardapioBuffet" disabled type="text">
                    </div>
                    <div class="formgroup">
                        <label>Tipo de Bebida:</label>
                        <input ref="tipoBebida" disabled type="text">
                    </div>
                    <div class="formgroup">
                        <label>Valor por pessoa:</label>
                        <input ref="valorPorPessoaBuffet" disabled type="text">
                    </div>
                    <div class="formgroup">
                        <label>Valor Total:</label>
                        <input ref="valorTotalBuffet" disabled type="text">
                    </div>
                    <h4>BAR</h4>
                    <div class="formgroup">
                        <label>Cardápio:</label>
                        <input ref="cardapioBar" disabled type="text">
                    </div>
                    <div class="formgroup">
                        <label>Valor por pessoa:</label>
                        <input ref="valorPorPessoaBar" disabled type="text">
                    </div>
                    <div class="formgroup">
                        <label>Valor Total:</label>
                        <input ref="valorTotalBar" disabled type="text">
                    </div>
                    <h4>Espaço da Noiva</h4>
                    <div class="formgroup">
                        <label>Valor:</label>
                        <input ref="valorNoiva" disabled type="text">
                    </div>
                    <h4>Cabine de Fotos/Plataforma 360</h4>
                    <div class="formgroup">
                        <label>Valor:</label>
                        <input ref="valorCabine" disabled type="text">
                    </div>
                </div>
            </div>
            <div class="formgroup">
                <button @click="gerarPDF">Visualizar Orcamento</button>
                <button>Visualizar Detalhado</button>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default defineComponent({
    data() {
        return {
            id: '',
            referencia: '',
            nome: '',
            tipoEvento: '',
            data: '',
            convidados: '',
            totalProposta: '',
            dataEnvio: '',
            horaEnvio: '',
            observacoes: '',
            diaSemana: '',
            valorEspaco: '',
            cardapioBuffet: '',
            tipoBebida: '',
            valorPorPessoaBuffet: '',
            valorTotalBuffet: '',
            cardapioBar: '',
            valorPorPessoaBar: '',
            valorTotalBar: '',
            valorNoiva: '',
            valorCabine: '',
        };
    },
    methods: {
        close() {
            this.$emit('close');
        },
        async gerarPDF() {
            const templatePath = '/template-orcamento.html';
            const response = await fetch(templatePath);
            let template = await response.text();

            template = template
                .replace('{{id}}', this.id)
                .replace('{{referencia}}', this.referencia)
                .replace('{{nome}}', this.nome)
                .replace('{{tipoEvento}}', this.tipoEvento)
                .replace('{{data}}', this.data)
                .replace('{{convidados}}', this.convidados)
                .replace('{{totalProposta}}', this.totalProposta)
                .replace('{{dataEnvio}}', this.dataEnvio)
                .replace('{{horaEnvio}}', this.horaEnvio)
                .replace('{{observacoes}}', this.observacoes)
                .replace('{{diaSemana}}', this.diaSemana)
                .replace('{{valorEspaco}}', this.valorEspaco)
                .replace('{{cardapioBuffet}}', this.cardapioBuffet)
                .replace('{{tipoBebida}}', this.tipoBebida)
                .replace('{{valorPorPessoaBuffet}}', this.valorPorPessoaBuffet)
                .replace('{{valorTotalBuffet}}', this.valorTotalBuffet)
                .replace('{{cardapioBar}}', this.cardapioBar)
                .replace('{{valorPorPessoaBar}}', this.valorPorPessoaBar)
                .replace('{{valorTotalBar}}', this.valorTotalBar)
                .replace('{{valorNoiva}}', this.valorNoiva)
                .replace('{{valorCabine}}', this.valorCabine);

            const doc = new jsPDF();
            doc.setProperties({
                title: this.referencia
            });

            const iframe = document.createElement('iframe');
            document.body.appendChild(iframe);
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(template);
            iframeDoc.close();

            iframe.onload = () => {
                html2canvas(iframeDoc.body).then((canvas) => {
                    const imgData = canvas.toDataURL('image/png');
                    doc.addImage(imgData, 'PNG', 10, 10);
                    const pdfDataUri = doc.output('datauristring');
                    const newTab = window.open();
                    if (newTab) {
                        newTab.document.write(`
                        <html>
                            <head>
                                <style>
                                    body, html {
                                        margin: 0;
                                        padding: 0;
                                        height: 100%;
                                        overflow: hidden;
                                    }
                                    iframe {
                                        position: absolute;
                                        top: 0;
                                        left: 0;
                                        width: 100%;
                                        height: 100%;
                                        border: none;
                                    }
                                </style>
                            </head>
                            <body>
                                <iframe src="${pdfDataUri}" frameborder="0"></iframe>
                            </body>
                        </html>
                    `);
                    }
                    document.body.removeChild(iframe);
                });
            };
        }
    },
    mounted() {
        // Preenchendo dados para teste
        this.id = '123';
        this.referencia = 'Ref002';
        this.nome = 'Evento Teste';
        this.tipoEvento = 'Casamento';
        this.data = '2024-12-31';
        this.convidados = '100';
        this.totalProposta = '5000';
        this.dataEnvio = '2024-07-01';
        this.horaEnvio = '15:00';
        this.observacoes = 'Nenhuma';
        this.diaSemana = 'Sábado';
        this.valorEspaco = '2000';
        this.cardapioBuffet = 'Completo';
        this.tipoBebida = 'Alcoólica';
        this.valorPorPessoaBuffet = '50';
        this.valorTotalBuffet = '5000';
        this.cardapioBar = 'Simples';
        this.valorPorPessoaBar = '20';
        this.valorTotalBar = '2000';
        this.valorNoiva = '1000';
        this.valorCabine = '800';
    }
});
</script>

<style scoped>
.modal {
    max-width: fit-content;
    margin: 30px auto;
    background: white;
    padding: 20px;
    border-radius: 10px;
    position: relative;
    z-index: 2;
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

h4 {
    color: black;
    font-size: 0.6em;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: bold;
}

input {
    color: #aaa;
    font-size: 0.6em;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: bold;
    border: 1px solid #aaa;
    border-radius: 5px;
}

label {
    color: #aaa;
    font-size: 0.6em;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: bold;
}

button {
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

button:hover {
    background-color: #2F4036;
}

.content {
    display: flex;
}

.group {
    display: inline;
    margin-right: 10px;

}

.formgroup {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
    margin-bottom: 2px;
}

.textarea {
    width: 100%;
    height: 60px;
    resize: none;
    border-radius: 5px;
}
</style>