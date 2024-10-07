import React from 'react';
import parseYearSeason from '../Utils/parseYearSeason';

const InputForm = ({ name, data, handleChange, minMaxDate }) => {




    const renderInput = (name) => {
        switch (name) {
            case 'name':
                return (
                    <div className='mb-2 sticky top-12 bg-white py-2'>
                        <input
                            type='text'
                            name='name'
                            placeholder='Nome'
                            value={data}
                            onChange={handleChange}
                            className='w-full p-4 text-2xl border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500'
                            required
                        />
                    </div>
                );
            case 'phone':
                return (
                    <div>
                        <label className='select-none block text-sm font-medium text-gray-700'>Telefono</label>
                        <input
                            type='text'
                            name='phone'
                            value={data}
                            onChange={handleChange}
                            className='mt-1 block w-full p-1 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500'
                        />
                    </div>
                );
            case 'email':
                return (
                    <div>
                        <label className='select-none block text-sm font-medium text-gray-700'>email</label>
                        <input
                            type='email'
                            name='email'
                            value={data}
                            onChange={handleChange}
                            className='mt-1 block w-full p-1 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500'
                        />
                    </div>
                );
            case 'address':
                return (
                    <div>
                        <label className='select-none block text-sm font-medium text-gray-700'>Indirizzo</label>
                        <input
                            type='text'
                            name='address'
                            value={data}
                            onChange={handleChange}
                            className='mt-1 block w-full p-1 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500'
                        />
                    </div>
                );
            case 'paymentType':
                return (
                    <div className='w-1/4 p-1'>
                        <label className='select-none block text-sm font-medium text-gray-700'>Tipo di Pagamento</label>
                        <select
                            name='paymentType'
                            value={data}
                            onChange={handleChange}
                            className='cursor-pointer mt-1 block w-full p-1 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500'
                            required
                        >
                            <option value='Effetto Bancario'>Effetto Bancario</option>
                            <option value='RID Bancario'>RID Bancario</option>
                            <option value='RID Bancario'>Ricevuta bancaria (RIBA)</option>
                            <option value='Bonifico'>Bonifico</option>
                            <option value='Assegni'>Assegni</option>
                            <option value='Contanti'>Contanti</option>
                        </select>
                    </div>
                );
            case 'expiredDate':
                return (
                    <div className='w-1/4 p-1'>
                        <label className='select-none block text-sm font-medium text-gray-700'>Data Scadenza</label>
                        <input
                            type='date'
                            name='expiredDate'
                            value={data}
                            onChange={handleChange}
                            className='cursor-pointer mt-1 block w-full py-1 px-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500'
                            required
                            min={parseYearSeason(minMaxDate).min + "-09-01"}  
                            max={parseYearSeason(minMaxDate).max + "-08-31"}  
                        />
                    </div>
                );
            case 'amount':
                return (
                    <div className='w-1/4 p-1'>
                        <label className='select-none block text-sm font-medium text-gray-700'>Importo &#8364;</label>
                        <input
                            type='number'
                            name='amount'
                            value={data}
                            onChange={handleChange}
                            className='mt-1 block w-full py-1 px-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500'
                            required
                        />
                    </div>
                );
            case 'paymentState':
                return (
                    <div className='w-1/4 p-1'>
                        <label className='select-none block text-sm font-medium text-gray-700'>Stato Pagamento</label>
                        <select
                            name='paymentState'
                            value={data}
                            onChange={handleChange}
                            className='cursor-pointer mt-1 block w-full p-1 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500'
                            required
                        >
                            <option value='Pagato'>Pagato</option>
                            <option value='Da saldare'>Da saldare</option>
                        </select>
                    </div>
                );
            case 'costNumber':
                return (
                    <div className='w-1/4 p-1'>
                        <label className='select-none block text-sm font-medium text-gray-700'>Numero</label>
                        <input
                            type='number'
                            name='costNumber'
                            value={data}
                            onChange={handleChange}
                            className='mt-1 block w-full py-1 px-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500'
                        />
                    </div>
                );
            case 'emissionDate':
                return (
                    <div className='w-1/4 p-1'>
                        <label className='select-none block text-sm font-medium text-gray-700'>Data Emissione</label>
                        <input
                            type='date'
                            name='emissionDate'
                            value={data}
                            onChange={handleChange}
                            className='cursor-pointer mt-1 block w-full py-1 px-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500'
                            required
                            min={parseYearSeason(minMaxDate).min + "-09-01"}  
                            max={parseYearSeason(minMaxDate).max + "-08-31"} 
                        />
                    </div>
                );
            case 'costType':
                return (
                    <div className='w-1/5'>
                        <select
                            name='costType'
                            value={data || ""}
                            onChange={handleChange}
                            className='cursor-pointer block w-full p-1 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500'
                            required
                        >
                            <option value='' disabled>Seleziona un tipo</option>
                            <option value='fattura'>Fattura</option>
                            <option value='nota di credito'>Nota di credito</option>
                        </select>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            {renderInput(name)}
        </>
    );
};

export default InputForm;
