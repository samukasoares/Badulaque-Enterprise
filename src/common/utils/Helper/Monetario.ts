export function formatarValorMonetario(valor: number | null | undefined) {
    if (typeof valor !== 'number') {
        return 'N/A'; // Retorna 'N/A' ou algum texto padrão se o valor for indefinido
    }
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatarValorMonetarioCusto(valor: number | null | undefined) {
    if (typeof valor !== 'number') {
        return 'N/A'; // Retorna 'N/A' ou algum texto padrão se o valor for indefinido
    }
    return valor.toLocaleString('pt-BR', { 
        style: 'currency', 
        currency: 'BRL',
        minimumFractionDigits: 4, // Define o número mínimo de casas decimais
        maximumFractionDigits: 4 // Define o número máximo de casas decimais
    });
}