import { useState, useRef, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { FaPencilAlt, FaTrashAlt, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import cleanDate from '../Utils/cleanDate';
import checkExpiry from '../Utils/checkExpiry';
import isPayed from '../Utils/isPayed';
import capitalizeFirstLetter from '../Utils/capitalizeFirstLetter';
import { formattedAmount } from '../Utils/formattedAmount';

const cardClasses = 'p-5 rounded-lg shadow-lg mb-4 transition-transform transform';
const textClasses = 'text-muted-foreground';

const TableCard = ({ props }) => {

    const { item, index, openModal, showTable, setShowTable } = props;


    const objData = item;
    const [contentHeight, setContentHeight] = useState(0);
    const [PaymentsToBePaid, setPaymentsToBePaid] = useState(0);
    const [PaymentsToBeExpiring, setPaymentsToBeExpiring] = useState(0);
    const [PaymentsExpired, setPaymentsExpired] = useState(0);
    const contentRef = useRef(null);
    const isTableVisible = showTable[index];

    useEffect(() => {
        let countPaymentsToBePaid = 0;
        let countPaymentsToBeExpiring = 0;
        let countPaymentsExpired = 0;
        objData?.fields?.forEach(item => {
            if (item.paymentState?.toLowerCase() === 'da saldare') {
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
    }, [objData]);

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    }, [showTable]);

    const toggleTable = (index) => {
        setShowTable(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };

    const animationProps = useSpring({
        height: isTableVisible ? contentHeight : 0,
        opacity: isTableVisible ? 1 : 0,
        config: { tension: 200, friction: 20 }
    });

    return (
        <div className={`select-none ${isTableVisible ? 'pb-3' : 'pb-0'} ${cardClasses}`}>
            <div className='cursor-pointer flex justify-between' onClick={() => toggleTable(index)}>
                <div className='flex flex-col gap-2'>
                    <div className='flex gap-1 items-center'>
                        <IoIosArrowDown className={`transform transition-transform duration-300 ${isTableVisible ? '' : '-rotate-90'}`} />
                        <div className='flex items-center gap-2'>
                            <h2 className='text-2xl font-semibold text-accent hover:text-accent-foreground' >
                                {`${capitalizeFirstLetter(objData.name)}`}
                            </h2>
                            <p className='text-base text-gray-400 font-semibold text-accent hover:text-accent-foreground'>
                                {objData?.pIva ? ` - p.IVA: ${objData.pIva}` : null}
                            </p>
                        </div>
                    </div>
                    <div className={textClasses}>
                        {PaymentsToBePaid === 0 ?
                            <p className='flex items-center gap-2'>
                                Tutto Saldato
                                <FaCheckCircle className='text-green-600' title={`Tutto saldato`} />
                            </p>
                            :
                            <div className='flex gap-1'>
                                <p>
                                    Rate da saldare:
                                </p>
                                <span className='font-bold text-primary'>
                                    <p className='flex items-center gap-2'>
                                        {` ${PaymentsToBePaid} su ${objData.fields.length}`}
                                        {PaymentsToBeExpiring !== 0 && <FaExclamationTriangle className='text-yellow-600' title={`${PaymentsToBeExpiring} ${PaymentsToBeExpiring === 1 ? 'Rata' : 'Rate'} in scadenza`} />}
                                        {PaymentsExpired !== 0 && <FaTimesCircle className='text-red-600' title={`${PaymentsExpired} ${PaymentsExpired === 1 ? 'Rata scaduta' : 'Rate scadute'}`} />}
                                    </p>
                                </span>
                            </div>
                        }
                    </div>
                </div>
                <div className='flex gap-4 select-none'>
                    <FaPencilAlt
                        className='text-gray-600 hover:text-gray-500 h-fit hover:scale-125 transition-all duration-300'
                        onClick={(e) => {
                            e.stopPropagation();
                            openModal('update', objData);
                        }}
                    />
                    <FaTrashAlt
                        className='text-gray-600 hover:text-gray-500 h-fit hover:scale-125 transition-all duration-300'
                        onClick={(e) => {
                            e.stopPropagation();
                            openModal('delete', objData);
                        }}
                    />
                </div>
            </div>
            <div className='overflow-hidden select-none py-2'>
                <animated.div style={animationProps}>
                    <div ref={contentRef}>
                        <div className='grid grid-cols-6 bg-muted text-muted-foreground p-3'>
                            <div className='font-semibold px-2'></div>
                            <div className='font-semibold px-2'>Data Emissione</div>
                            <div className='font-semibold px-2'>Data Scadenza</div>
                            <div className='font-semibold px-2'>Tipo di Pagamento</div>
                            <div className='font-semibold px-2'>Importo</div>
                            <div className='font-semibold px-2'>Stato Pagamento</div>
                        </div>
                        {objData.fields.map((item, i) => {

                            const costNumber = item?.costNumber
                            const name = <div className='flex gap-4 items-center '>
                                <div className='text-lg'>
                                    {(i + 1) + ')'}
                                </div>
                                <div className='font-semibold flex flex-col gap-1'>
                                    <div>
                                        {item?.costType ? capitalizeFirstLetter(item?.costType) : null}
                                    </div>
                                    <div >
                                        {costNumber ? costNumber  : null}
                                    </div>
                                </div>
                            </div>

                            const emissionDate = item?.emissionDate ? item?.emissionDate : '-'
                            const paymentType = item?.paymentType ? item?.paymentType : '-'
                            const expiredDate = item?.expiredDate ? item?.expiredDate : '-'
                            const paymentState = item?.paymentState ? item?.paymentState : '-'
                            const amount = item?.amount ? formattedAmount(item?.amount) + ' ' + '\u20AC' : '-'

                            const isExpired = checkExpiry(expiredDate, isPayed(paymentState)).isExpired;
                            const isExpiringSoon = checkExpiry(expiredDate, isPayed(paymentState)).isExpiringSoon;
                            const daysUntilExpiry = checkExpiry(expiredDate, isPayed(paymentState)).daysUntilExpiry;

                            const ExpiredDateClasses = `${isExpired && !isPayed(paymentState) ? 'bg-red-200 border border-red-600' : isExpiringSoon && !isPayed(paymentState) ? 'bg-yellow-200 border border-yellow-600' : ''}`;
                            const PaymentStateClasses = `${isPayed(paymentState) ? 'bg-green-200 border border-green-600' : 'bg-red-200 border border-red-600'}`;

                            return (
                                <div key={i} className='h-24 grid grid-cols-6 p-3 border-b items-center'>

                                    <div className='align-top text-left p-2 '>{name}</div>
                                    <div className='text-left p-2'>{cleanDate(emissionDate)}</div>
                                    <div className='flex flex-col text-left w-3/4'>
                                        <div className={`p-2 rounded-xl ${ExpiredDateClasses}`}>
                                            {cleanDate(expiredDate)}
                                        </div>
                                        {(isExpired || isExpiringSoon) && (
                                            <div className={`${isExpired ? 'text-red-600' : 'text-yellow-600'}  text-xs px-2`}>
                                                <p>
                                                    {isExpired && daysUntilExpiry === 0 ? 'Scaduto oggi' : isExpired ? 'Scaduto da ' : 'Scade fra '}
                                                    {isExpired && daysUntilExpiry === 0 ? '' : daysUntilExpiry}
                                                    {isExpired && daysUntilExpiry === 0 ? '' : daysUntilExpiry === 1 ? ' giorno' : ' giorni'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className='text-left p-2'>{capitalizeFirstLetter(paymentType)}</div>
                                    <div className='text-left p-2'>{amount}</div>
                                    <div className={`p-2 rounded-xl text-left w-3/4 ${PaymentStateClasses}`}>{capitalizeFirstLetter(paymentState)}</div>
                                </div>
                            );
                        })}
                    </div>
                </animated.div>
            </div>
        </div>
    );
};

export default TableCard;
