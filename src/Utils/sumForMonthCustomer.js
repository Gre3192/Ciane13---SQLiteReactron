export default function sumForMonthCustomer(gestione, months, filterCostType = null) {
  // Verifica che 'months' sia un array, se non lo è, lo trasformiamo in un array
  const monthsArray = Array.isArray(months) ? months : [months];

  // Verifica che 'fields' esista ed è un array
  if (!Array.isArray(gestione.fields)) {
    return 'Errore'; // Restituisce 0 se non ci sono campi da sommare
  }

  // Filtra i campi in base ai mesi specificati
  const filteredFields = gestione.fields.filter((field) => {
    const fieldMonth = new Date(field.expiredDate).getMonth() + 1;
    return monthsArray.includes(fieldMonth);
  });

  // Gestione dei diversi tipi di somme
  const sumByType = (type) => {
    const sum = filteredFields
      .filter((field) => field.costType === type)
      .reduce((acc, field) => {
        const amount = parseFloat(field.amount);
        return acc + (isNaN(amount) ? 0 : amount);
      }, 0);

    // Controlla se il numero ha decimali
    return sum == 0 ? 0 : sum % 1 === 0 ? sum.toString() : sum.toFixed(2);
  };

  // Calcolo della somma delle fatture e delle note di credito
  const totalFatture = sumByType('fattura');
  const totalNoteCredito = sumByType('nota di credito');

  // Restituisce il risultato in base a `filterCostType`
  if (filterCostType === 'fattura') {
    return totalFatture; // Somma solo delle fatture
  } else if (filterCostType === 'nota di credito') {
    return totalNoteCredito; // Somma solo delle note di credito
  } else {
    // Totale combinato: fatture meno note di credito
    const total = totalFatture - totalNoteCredito
    return total == 0 ? 0 : total % 1 === 0 ? total.toString() : total.toFixed(2);
  }
}
