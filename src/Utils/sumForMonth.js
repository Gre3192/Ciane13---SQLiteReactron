export default function sumForMonth(data, months, filterType = null) {
  // Converte `months` in array, se non è già un array
  const monthsArray = Array.isArray(months) ? months : [months];

  // Trasforma i mesi in stringhe a due cifre
  const monthsStr = monthsArray.map((month) => month.toString().padStart(2, '0'));

  const total = data.reduce((totalSum, management) => {
    // Somma per ogni gestione
    const managementSum = management.fields.reduce((sum, field) => {
      // Estrae il mese dalla data di scadenza
      const expiredDateMonth = field.expiredDate.split('-')[1];

      // Controlla se il mese corrisponde ai mesi specificati
      if (monthsStr.includes(expiredDateMonth)) {
        // Converte il campo `amount` in numero
        const amount = parseFloat(field.amount);
        if (isNaN(amount)) return sum; // Ignora se `amount` non è un numero

        // Se `filterType` è specificato, somma o sottrai in base a `costType`
        if (filterType) {
          if (filterType === field.costType) {
            return sum + amount; // Somma solo se il `costType` corrisponde al `filterType`
          } else {
            return sum; // Altrimenti ignora
          }
        } else {
          // Se `filterType` non è specificato, somma o sottrai in base al `costType`
          return field.costType === 'fattura' ? sum + amount : sum - amount;
        }
      }

      return sum;
    }, 0);

    return totalSum + managementSum;
  }, 0);

  // Restituisce il risultato formattato come stringa se necessario
  return total % 1 === 0 ? total.toString() : total.toFixed(2);
}
