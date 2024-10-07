export default function getMonthName(monthNumber) {
    const months = [
      "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
      "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
    ];
  
    if (monthNumber < 1 || monthNumber > 12) {
      return "Numero del mese non valido";
    }
  
    return months[monthNumber - 1];
  }
  