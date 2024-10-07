export default function paymentsToBePaid(fields) {
    let count = 0;
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].paymentState === "Da Saldare") {
        count++;
      }
    }
    return count;
  }