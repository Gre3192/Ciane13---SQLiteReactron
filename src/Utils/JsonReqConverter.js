export default function jsonReqConverter(data) {

    const JsonInput = data.records;
    const groupedByName = {};

    JsonInput.forEach(item => {
        const name = item.fields.name;

        // Controllo se il campo name è definito
        if (name) {
            if (!groupedByName[name]) {
                groupedByName[name] = [];
            }
            // Creazione di un nuovo oggetto senza il campo name
            const { name, ...fieldsWithoutName } = item.fields;
            groupedByName[name].push({
                id: item.id,
                creationDate: item.creationDate,
                ...fieldsWithoutName
            });
        }
    });

    // Creazione dell'output basato sulla mappa
    const JsonOutput = Object.keys(groupedByName).map(name => ({
        name: name,
        fields: groupedByName[name]
    }));

    return JsonOutput;
};





    // QUESTA NOTA SERVE A VISUALIZZARE LA FORMA DEL JSON IN ENTRATA E CIO' CHE LA FUNZIONE RESTITUISCE.
    // E' IMPORTANTE SPECIFICARE CHE IL JSONINPUT PUO' CAMBIARE IN BASE ALLA RICHIESTA, MENTRE IL JSONOUTPUT NON DEVE VARIARE IN QUANTO E' LA FORMA CHE DESIDERATA DAL PROGRAMMA

    // const JsonInput = [

    //     {
    //         creationDate: "2024-06-15T10:40:23.000Z",
    //         fields: {
    //             amount: "2024-05-23",
    //             expiredDate: "45",
    //             name: "qwer",
    //             paymentState: "Da saldare",
    //             paymentType: "Effetto Bancario",
    //         },
    //         id: "rec031pPCjcxLRF4U",
    //     },
    //     {
    //         creationDate: "2024-06-15T10:40:23.000Z",
    //         fields: {
    //             amount: "2024-05-23",
    //             expiredDate: "45",
    //             name: "qwer",
    //             paymentState: "Da saldare",
    //             paymentType: "Effetto Bancario",
    //         },
    //         id: "rec031pPCjcxLRF4U",
    //     },
    //     {
    //         creationDate: "2024-06-15T10:40:23.000Z",
    //         fields: {
    //             amount: "2024-05-23",
    //             expiredDate: "45",
    //             name: "qwer",
    //             paymentState: "Da saldare",
    //             paymentType: "Effetto Bancario",
    //         },
    //         id: "rec031pPCjcxLRF4U",
    //     },
    // ]


    // const JsonOutput =[
        
    //     {
    //         name: "Locazione",
    //         fields: [

    //             {
    //                 id: "rec031pPCjcxLRF4U",
    //                 creationDate: "2024-06-15T10:40:23.000Z",
    //                 amount: "2024-05-23",
    //                 expiredDate: "45",
    //                 paymentState: "Da saldare",
    //                 paymentType: "Effetto Bancario",
    //             },
    //             {
    //                 id: "rec031pPCjcxLRF4U",
    //                 creationDate: "2024-06-15T10:40:23.000Z",
    //                 amount: "2024-05-23",
    //                 expiredDate: "45",
    //                 paymentState: "Da saldare",
    //                 paymentType: "Effetto Bancario",
    //             },
    //             {
    //                 id: "rec031pPCjcxLRF4U",
    //                 creationDate: "2024-06-15T10:40:23.000Z",
    //                 amount: "2024-05-23",
    //                 expiredDate: "45",
    //                 paymentState: "Da saldare",
    //                 paymentType: "Effetto Bancario",
    //             },

    //         ]
    //     },
    //     {
    //         name: "Caffè",
    //         fields: [

    //             {
    //                 id: "rec031pPCjcxLRF4U",
    //                 creationDate: "2024-06-15T10:40:23.000Z",
    //                 amount: "2024-05-23",
    //                 expiredDate: "45",
    //                 paymentState: "Da saldare",
    //                 paymentType: "Effetto Bancario",
    //             },
    //             {
    //                 id: "rec031pPCjcxLRF4U",
    //                 creationDate: "2024-06-15T10:40:23.000Z",
    //                 amount: "2024-05-23",
    //                 expiredDate: "45",
    //                 paymentState: "Da saldare",
    //                 paymentType: "Effetto Bancario",
    //             },
    //             {
    //                 id: "rec031pPCjcxLRF4U",
    //                 creationDate: "2024-06-15T10:40:23.000Z",
    //                 amount: "2024-05-23",
    //                 expiredDate: "45",
    //                 paymentState: "Da saldare",
    //                 paymentType: "Effetto Bancario",
    //             },

    //         ]
    //     },


    // ] 











