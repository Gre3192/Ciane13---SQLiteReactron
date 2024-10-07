const filterFornitoriAPI = (filterFornitori = {}) => {

    let query = '';
    const params = [];

    const {

        filterIdFornitore,
        filterName,
        filterAddress,
        filterEmail,
        filterPhone,
    
      } = filterFornitori


    if (filterIdFornitore) {
        query += ' AND f.id_fornitore = ?';
        params.push(filterIdFornitore.toLowerCase());
    }
    if (filterName) {
        query += ' AND f.name = ?';
        params.push(filterName.toLowerCase());
    }
    if (filterAddress) {
        query += ' AND f.address = ?';
        params.push(filterAddress.toLowerCase());
    }
    if (filterEmail) {
        query += ' AND f.email = ?';
        params.push(filterEmail.toLowerCase());
    }
    if (filterPhone) {
        query += ' AND f.phone = ?';
        params.push(filterPhone.toLowerCase());
    }
    if (query.startsWith(' AND')) {
        query = ' WHERE' + query.slice(4);
    }

    return { filterQuery: query, params };
}

module.exports = filterFornitoriAPI