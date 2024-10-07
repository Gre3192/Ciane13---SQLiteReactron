const filterGestioneAPI = (filterGestione = {}) => {

    let query = '';
    const params = [];

    const {

        filterIdGestione,
        filterName

      } = filterGestione


    if (filterIdGestione) {
        query += ' AND g.id_gestione = ?';
        params.push(filterIdGestione.toLowerCase());
    }
    if (filterName) {
        query += ' AND g.name = ?';
        params.push(filterName.toLowerCase());
    }

    return { filterQuery: query, params };
}

module.exports = filterGestioneAPI