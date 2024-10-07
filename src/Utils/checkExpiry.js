export default function checkExpiry(dateString, isPayed = false) {

    const expiryDate = new Date(dateString);

    const marginDays = 60
    
    const today = new Date();

    const diffTime = expiryDate.getTime() - today.getTime();

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const isExpired = diffTime < 0 && !isPayed;

    const isExpiringSoon =  diffDays <= marginDays && !isPayed && !isExpired;
    
    return {
        isExpiringSoon: isExpiringSoon,
        daysUntilExpiry: Math.abs(diffDays),
        isExpired:isExpired
    };
}