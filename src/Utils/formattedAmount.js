export function formattedAmount(num) {
    // Converte il valore in numero se non lo è già
    const numericValue = parseFloat(num);

    // Se il valore è NaN, restituisci '0' come fallback
    if (isNaN(numericValue)) {
        return '0';
    }

    // Se il numero è 0, restituisci '0' come stringa
    if (numericValue === 0) {
        return '0';
    }

    // Se il numero è intero, restituisci il numero come stringa
    if (Number.isInteger(numericValue)) {
        return numericValue.toString();
    }

    // Se il numero ha decimali, formatta con due cifre decimali
    return numericValue.toFixed(2).replace(/\.00$/, '');
}
