const cleanDate = (dateString) => {
  // Split the string using '/'
  let parts = dateString?.split('-');
  
  // Rearrange the parts into the new format "dd/mm/yyyy"
  let formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
  
  return formattedDate;
}

export default cleanDate