export default function isPayed(paymentState) {

    if (paymentState?.toLowerCase() === "pagato") 
        return true
    return false

}
