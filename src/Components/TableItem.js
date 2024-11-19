import React, { useState, useEffect } from 'react';
import { HiPencil } from "react-icons/hi";
import { FaTrashAlt, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { formattedAmount } from '../Utils/formattedAmount';
import cleanDate from '../Utils/cleanDate';
import getNameFromDate from '../Utils/getNameFromDate';
import checkExpiry from '../Utils/checkExpiry';
import isPayed from '../Utils/isPayed';


const TableItem = (props) => {

    const objData = props
    const [isOpen, setIsOpen] = useState(false);
    const [PaymentsToBePaid, setPaymentsToBePaid] = useState(0)
    const [PaymentsToBeExpiring, setPaymentsToBeExpiring] = useState(0)
    const [PaymentsExpired, setPaymentsExpired] = useState(0)

    useEffect(() => {
        let countPaymentsToBePaid = 0;
        let countPaymentsToBeExpiring = 0;
        let countPaymentsExpired = 0;
        objData.props.fields.forEach(item => {
            if (item.paymentState === "da saldare") {
                countPaymentsToBePaid++;
            }
            if (checkExpiry(item.expiredDate, isPayed(item.paymentState)).isExpiringSoon) {
                countPaymentsToBeExpiring++;
            }
            if (checkExpiry(item.expiredDate, isPayed(item.paymentState)).isExpired) {
                countPaymentsExpired++;
            }
        });
        setPaymentsToBePaid(countPaymentsToBePaid);
        setPaymentsToBeExpiring(countPaymentsToBeExpiring);
        setPaymentsExpired(countPaymentsExpired);
    }, [objData.props.fields.paymentState]);

    return (
        <React.Fragment>
            <div className="select-none p-2 rounded-lg bg-zinc-300 mb-4 cursor-pointer hover:bg-zinc-400" onClick={() => setIsOpen(!isOpen)}>
                <div className={`grid grid-cols-6 ${isOpen ? 'font-bold' : ''}`}>
                    <div className='col-span-1 flex gap-2 items-center'>
                        <button className="focus:outline-none">
                            <IoIosArrowDown className={`transform transition-transform duration-300 ${isOpen ? '' : '-rotate-90'}`} />
                        </button>
                        <div className="uppercase font-bold">{objData.props.name}</div>
                    </div>
                    <div className={`col-span-1 ${isOpen ? 'visible opacity-100 transition-opacity duration-300' : ''}`}>
                        {isOpen ? 'Tipo di Pagamento' : PaymentsToBePaid === 0 ? `${objData.props.fields.length} ${objData.props.fields.length === 1 ? 'Rata' : 'Rate'}` : `Rate da saldare: ${PaymentsToBePaid} su ${objData.props.fields.length}`}
                    </div>
                    <div className={`col-span-1 ${isOpen ? 'visible opacity-100 transition-opacity duration-300' : ''}`}>
                        {isOpen ? 'Data Scadenza' :
                            PaymentsToBePaid === 0 ?
                                <p className='flex items-center gap-2'>
                                    <FaCheckCircle className='text-green-600' />
                                    Tutto Saldato
                                </p> :
                                PaymentsExpired ?
                                    <p className='flex items-center gap-2'>
                                        <FaTimesCircle className='text-red-600' />{PaymentsExpired} Scaduti
                                    </p>
                                    :
                                    PaymentsToBeExpiring ?
                                        <p className='flex items-center gap-2'>
                                            <FaExclamationTriangle className='text-yellow-600' />
                                            {PaymentsToBeExpiring} in Scadenza
                                        </p>
                                        :
                                        ''
                        }
                    </div>
                    <div className={`col-span-1 ${isOpen ? 'visible opacity-100 transition-opacity duration-300' : ''} ${PaymentsExpired && !isOpen ? 'text-red-600' : ''}`}>
                        {isOpen ? 'Importo \u20AC' : ''}
                    </div>
                    <div className={`col-span-1 ${isOpen ? 'visible opacity-100 transition-opacity duration-300' : 'invisible opacity-0'}`}>
                        Stato Pagamento
                    </div>
                    <div className='col-span-1 flex gap-4 justify-end'>
                        <button className='flex justify-center items-center'>
                            <HiPencil className='hover:text-gray-500 h-fit hover:scale-125 transition-all duration-300' />
                        </button>
                        <button className='flex justify-center items-center'>
                            <FaTrashAlt className='hover:text-gray-500 h-fit hover:scale-125 transition-all duration-300' />
                        </button>
                    </div>
                </div>
            </div>
            <div className={`mb-4 ${isOpen ? 'visible opacity-100 transition-opacity duration-300' : 'hidden opacity-0'}`}>
                {
                    objData.props.fields.map((item, index) => {

                        const name = item.name
                        const paymentType = item.paymentType ? item.paymentType : '-'
                        const expiredDate = item.expiredDate ? getNameFromDate(item.expiredDate) + ", " + cleanDate(item.expiredDate) : "-"
                        const paymentState = item.paymentState ? item.paymentState : '-'
                        const amount = item.amount ? formattedAmount(item.amount) + ' ' + '\u20AC' : "-"

                        const isExpired = checkExpiry(expiredDate, isPayed(paymentState)).isExpired
                        const isExpiringSoon = checkExpiry(expiredDate, isPayed(paymentState)).isExpiringSoon
                        const daysUntilExpiry = checkExpiry(expiredDate, isPayed(paymentState)).daysUntilExpiry

                        return (
                            <div key={index} className=''>
                                <div className="grid grid-cols-6 px-5 py-3 select-none items-center">
                                    <div className="col-span-1 font-bold">
                                        {name}
                                    </div>
                                    <div className="col-span-1">
                                        {paymentType}
                                    </div>
                                    <div className={`col-span-1 p-2 mr-8 rounded-xl relative ${isExpired ? 'bg-red-200 border border-red-600' : isExpiringSoon ? 'bg-yellow-200 border border-yellow-600' : ''}`}>
                                        {expiredDate}
                                        {
                                            isExpired || isExpiringSoon ?
                                                <div className="absolute -bottom-4 left-2 text-yellow-700 text-xs p-0">
                                                    <p>{isExpired ? 'Scaduto da ' : 'Scade fra '}{daysUntilExpiry} giorni</p>
                                                </div>
                                                :
                                                ''
                                        }
                                    </div>
                                    <div className="col-span-1">
                                        {amount}
                                    </div>
                                    <div className={`col-span-1 select-none p-2 rounded-xl ${paymentState === "pagato" ? 'bg-green-200 border border-green-600' : (paymentState === "da saldare" ? 'bg-red-200 border border-red-600' : '')}`}>
                                        {paymentState}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </React.Fragment>
    )
}

export default TableItem;
