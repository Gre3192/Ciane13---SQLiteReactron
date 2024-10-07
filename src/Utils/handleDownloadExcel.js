import * as XLSX from 'xlsx';

export default function handleDownloadExcel(arrayData, nameFile) {
    const workbook = XLSX.utils.book_new();
    const wsData = [['Nome Uscita', 'Tipo di Pagamento', 'Data Scadenza', 'Importo', 'Stato Pagamento']];

    if (arrayData) {
        arrayData.forEach(item => {
            // Insert a row with just the name
            wsData.push(['', '', '', '', '', '', '']);
            wsData.push([item.name, '', '', '', '', '', '']);

            // Iterating over item.fields which is an array of objects
            item.fields.forEach((field, index) => {
                wsData.push([
                    index+1, // Leave the 'Nome Uscita' column empty for the field rows
                    field.paymentType,
                    field.expiredDate,
                    field.amount,
                    field.paymentState,
                ]);
            });
        });
    }

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(workbook, ws, 'Foglio1');
    XLSX.writeFile(workbook, `${nameFile}.xlsx`);
};
