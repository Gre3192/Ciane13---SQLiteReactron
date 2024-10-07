const filterCostiAPI = (filterCosti = {}) => {


    let query = '';
    const params = [];

    const {

        filterIdCosto,
        filterType,
        filterName,
        filterPaymentType,
        filterSeason,
        filterCostType,
        filteremissionDate,
        filterCostNumber,
        filtercreationDate,
        filterExpiredDate,
        filterAmount,
        filterPaymentState

    } = filterCosti


    if (filterIdCosto) {
        query += ' AND c.id_costo = ?';
        params.push(filterIdCosto.toLowerCase());
    }
    if (filterType) {
        query += ' AND c.type = ?';
        params.push(filterType.toLowerCase());
    }
    if (filterName) {
        query += ' AND c.name = ?';
        params.push(filterName.toLowerCase());
    }
    if (filterPaymentType) {
        query += ' AND c.payment_type = ?';
        params.push(filterPaymentType.toLowerCase());
    }
    if (filterSeason) {
        query += ' AND c.season = ?';
        params.push(filterSeason.toLowerCase());
    }
    if (filterCostType) {
        query += ' AND c.cost_type = ?';
        params.push(filterCostType.toLowerCase());
    }
    if (filteremissionDate) {
        query += ' AND c.cost_emission_date = ?';
        params.push(filteremissionDate.toLowerCase());
    }
    if (filterCostNumber) {
        query += ' AND c.cost_number = ?';
        params.push(filterCostNumber.toLowerCase());
    }
    if (filtercreationDate) {
        query += ' AND c.creation_date = ?';
        params.push(filtercreationDate.toLowerCase());
    }
    if (filterExpiredDate) {
        query += ' AND c.expired_date = ?';
        params.push(filterExpiredDate.toLowerCase());
    }
    if (filterAmount) {
        query += ' AND c.amount = ?';
        params.push(filterAmount.toLowerCase());
    }
    if (filterPaymentState) {
        query += ' AND c.payment_state = ?';
        params.push(filterPaymentState.toLowerCase());
    }


    // Rimuovi il primo 'AND' se presente
    if (query.startsWith(' AND')) {
        query = ' WHERE' + query.slice(4);
    }


    return { filterQuery: query, params };
}
    

module.exports = filterCostiAPI