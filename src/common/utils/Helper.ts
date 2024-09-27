
 //Recebe uma string e retorna no Formato DD/MM/AAAA
export function formatarData(dataEvento: string): string {
    const data = new Date(dataEvento);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

//Recebe uma string e retorna no formato "Dia da Semana, DD de MM de AAAA"
export function formatarDataExtenso(dataEvento: string): string {
    const partes = dataEvento.split('-');
    const ano = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1; // Mês é indexado a partir de 0
    const dia = parseInt(partes[2], 10);
    
    const data = new Date(ano, mes, dia);
    
    // Opções de formatação para o nome do dia e do mês por extenso
    const opcoes: Intl.DateTimeFormatOptions = {
        weekday: 'long',   // Nome completo do dia da semana
        day: 'numeric',    // Dia do mês
        month: 'long',     // Nome completo do mês
        year: 'numeric'    // Ano com quatro dígitos
    };
    
    return data.toLocaleDateString('pt-BR', opcoes);
}

//Recebe uma string e retorna no formato DD/MM/AAAA HH:MM:SS
export function formatarDateToString(date: string | Date): string {
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
}

export function formatarCelular(numero: string): string {
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

export function formatarValorMonetario(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}