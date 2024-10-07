const isNearExpiry = (dateInput, daysMargin) => {

  const inputDate = new Date(dateInput);

  const currentDate = new Date();

  const timeDifference = inputDate - currentDate;

  const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

  return daysDifference <= daysMargin;

}

export default isNearExpiry