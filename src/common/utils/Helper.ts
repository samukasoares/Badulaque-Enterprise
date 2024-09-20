export function formatarData(dataEvento: string): string {
    const data = new Date(dataEvento);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
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