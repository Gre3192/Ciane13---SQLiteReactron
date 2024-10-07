const getNameFromDate = (dateString, type = "dayName", lang = "IT") => {

  const weekdayNamesEN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekdayNamesIT = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
  const monthNamesEN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthNamesIT = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

  const weekdayNames = lang.toUpperCase() === 'IT' ? weekdayNamesIT : weekdayNamesEN;
  const monthNames = lang.toUpperCase() === 'IT' ? monthNamesIT : monthNamesEN;

  const date = new Date(dateString);

  const dayOfWeekIndex = date.getDay();
  const monthIndex = date.getMonth();
  const dayOfWeek = weekdayNames[dayOfWeekIndex];
  const month = monthNames[monthIndex];
  const day = date.getDate();
  const year = date.getFullYear();

  switch (type.toLowerCase()) {
    case 'dayName'.toLowerCase():
      return dayOfWeek;
    case 'dayNum'.toLowerCase():
      return day;
    case 'monthName'.toLowerCase():
      return month;
    case 'year'.toLowerCase():
      return year;
    default:
      return `${dayOfWeek}, ${day} ${month} ${year}`;
  }
  
};

export default getNameFromDate;
