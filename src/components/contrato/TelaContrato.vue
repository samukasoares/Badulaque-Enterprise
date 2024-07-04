<template>
    <div class="barraOpcoes">
        <button>Novo Contrato</button>
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
            <th style="width: 10%;">Data</th>
            <th style="width: 20%;">Cliente</th>
            <th style="width: 20%;">Contato</th>
            <th style="width: 10%;">Tipo</th>
            <th style="width: 10%;">Convidados</th>
            <th style="width: 10%;">Cardápio</th>
            <th style="width: 10%;">Total Contrato</th>
        </tr>
        <tr>
            <td>29/09/2025</td>
            <td>Samuel & Bruna</td>
            <td>(19)99710-4251</td>
            <td>Casamento</td>
            <td>150</td>
            <td>Prata</td>
            <td>R$36.230,00</td>
        </tr>
    </table>
</template>

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