export function formattedAmount(num) {

    return num == 0 ? 0 : num % 1 === 0 ? num.toString() : num.toFixed(2);

}