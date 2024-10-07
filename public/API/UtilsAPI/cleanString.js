function cleanString(str, lowerCase = false, removeAccents = false, capitalizeFirst = false) {
    if (!str) return '-';

    str = str.trim();
    str = str.replace(/\s+/g, ' ');

    if (removeAccents) {
        const accentMap = {
            'á': 'a', 'à': 'a', 'â': 'a', 'ä': 'a', 'ã': 'a', 'å': 'a',
            'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
            'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
            'ó': 'o', 'ò': 'o', 'ô': 'o', 'ö': 'o', 'õ': 'o',
            'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u',
            'ý': 'y', 'ÿ': 'y',
            'ç': 'c', 'ñ': 'n',
            'Á': 'A', 'À': 'A', 'Â': 'A', 'Ä': 'A', 'Ã': 'A', 'Å': 'A',
            'É': 'E', 'È': 'E', 'Ê': 'E', 'Ë': 'E',
            'Í': 'I', 'Ì': 'I', 'Î': 'I', 'Ï': 'I',
            'Ó': 'O', 'Ò': 'O', 'Ô': 'O', 'Ö': 'O', 'Õ': 'O',
            'Ú': 'U', 'Ù': 'U', 'Û': 'U', 'Ü': 'U',
            'Ý': 'Y',
            'Ç': 'C', 'Ñ': 'N'
        };
        str = str.replace(/[áàâäãåéèêëíìîïóòôöõúùûüýÿçñÁÀÂÄÃÅÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜÝÇÑ]/g, function(match) {
            return accentMap[match];
        });
    }
    if (lowerCase) {
        str = str.toLowerCase();
    }
    if (capitalizeFirst) {
        str = str.charAt(0).toUpperCase() + str.slice(1);
    }
    return str;
}

module.exports = cleanString;
