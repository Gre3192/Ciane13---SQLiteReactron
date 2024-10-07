import { useState, useRef, useEffect } from 'react';
import { FaPlus, FaMinus, FaTrashAlt, FaTimes } from 'react-icons/fa';
import { useTransition, animated } from '@react-spring/web';
import useMeasure from 'react-use-measure';
import InputForm from './InputForm';
import capitalizeFirstLetter from '../Utils/capitalizeFirstLetter';
import cleanString from '../Utils/cleanString';

const AddUpdateForm = ({ props }) => {

  const { closeModal, seasonModal, modalType, handlefunction, itemSelected, data } = props;

  const lastPaymentRef = useRef(null);
  const dropdownRef = useRef(null);
  const [ref, bounds] = useMeasure();
  const [isAdding, setIsAdding] = useState(false);
  // const [isDisabled, setIsDisabled] = useState(false);

  const [dataModal, setDataModal] = useState({ name: '', pIva: '', payments: [] });

  const [options, setOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isGestione = window.location.href.includes('/CostiGestione') ? true : false
  const placeholderSelect = isGestione ? 'Scegli Gestione...' : 'Scegli Fornitore...'

  // get elenco Fornitori e Gestione per la select
  useEffect(() => {
    const fetchData = async () => {
      try {
        let result;

        if (isGestione) {
          result = await window.electronAPI.getGestione();
        }
        else {
          result = await window.electronAPI.getFornitori();
        }

        setOptions(result);
      } catch (error) {
        console.error('Errore durante il recupero dei dati:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (itemSelected && modalType.toLowerCase() === 'update') {
      setDataModal({
        name: itemSelected.name,
        pIva: itemSelected.pIva,
        payments: itemSelected.fields.map(payment => ({
          ...payment,
          expiredDate: payment.expiredDate
        }))
      });
    }
  }, [itemSelected, modalType]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    if (isAdding && lastPaymentRef.current) {
      lastPaymentRef.current.scrollIntoView({ behavior: 'smooth' });
      setIsAdding(false);
    }
  }, [dataModal.payments.length, isAdding]);

  const transitions = useTransition(dataModal.payments, {
    keys: item => item.idCosto,
    from: { opacity: 0, transform: 'translate3d(0,-20px,0)' },
    enter: { opacity: 1, transform: 'translate3d(0,0px,0)' },
    leave: { opacity: 0, transform: 'translate3d(0,-20px,0)' },
    config: { tension: 250, friction: 20 }
  });

  const handlePaymentChange = (index, e) => {
    const { name, value } = e.target;
    const newPayments = [...dataModal.payments];
    newPayments[index][name] = value;
    setDataModal((prevData) => ({
      ...prevData,
      payments: newPayments,
    }));
  };

  const addPayment = () => {
    setDataModal((prevData) => ({
      ...prevData,
      payments: [...prevData.payments, {
        idCosto: Date.now(),
        paymentType: 'Effetto Bancario',
        expiredDate: '',
        amount: '',
        paymentState: 'Da saldare',
        season: seasonModal
      }],
    }));
    setIsAdding(true);
  };

  const removePayment = (idCosto) => {
    if (dataModal.payments.length > 0) {
      const newPayments = dataModal.payments.filter(payment => payment.idCosto !== idCosto);
      setDataModal((prevData) => ({
        ...prevData,
        payments: newPayments,
      }));
    }
  };

  const clearSearch = () => {
    setSearchTerm(''); // Resetta il termine di ricerca
    setDataModal((prevData) => ({ ...prevData, name: '' })); // Svuota il valore selezionato
  };

  const handleOptionClick = (option) => {
    if (isGestione) {
      setDataModal((prevData) => ({ ...prevData, name: option.name, pIva: option.pIva,idGestione: option.idGestione }));
    }
    else {
      setDataModal((prevData) => ({ ...prevData, name: option.name, pIva: option.pIva, idFornitore: option.idFornitore }));
    }
    setSearchTerm(option.name); // Mostra il valore selezionato nell'input
    setDropdownOpen(false); // Chiudi il dropdown
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let result = null;

      if (modalType.toLowerCase() === 'create') {
        if (isGestione) {
          result = await window.electronAPI.addCostiGestione(dataModal);
          handlefunction(result);
        }
        else {
          result = await window.electronAPI.addCostiFornitori(dataModal);
          handlefunction(result);
        }
      }

      if (modalType.toLowerCase() === 'update' && itemSelected) {
        if (isGestione) {
          result = await window.electronAPI.updateCostiGestione(itemSelected.idGestione, dataModal);
          handlefunction(itemSelected.idGestione, result);
        }
        else {
          result = await window.electronAPI.updateCostiFornitori(itemSelected.idFornitore, dataModal);
          handlefunction(itemSelected.idFornitore, result);
        }
      }

      closeModal();
    } catch (error) {
      console.error('Errore durante l\'invio dei dati:', error);
    }
  };

  const isOptionDisabled = (option) => {
    if (!isGestione) return data?.some(existing => existing.idFornitore === option.idFornitore);
    if (isGestione) return data?.some(existing => existing.idGestione === option.idGestione);
  };

  const filteredOptions = options.filter(option => option.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const isSubmitDisabled = dataModal.payments.length === 0;

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md h-full flex flex-col relative">
      <button
        type="button"
        onClick={closeModal}
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
      >
        <FaTimes size={20} className='text-gray-500 hover:text-gray-700 h-fit hover:scale-125 transition-all duration-300' />
      </button>
      <div className='text-lg font-semibold text-gray-700 mb-2'>{`Stagione ${seasonModal}`}</div>
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="mb-4 relative">
          <div className="relative" ref={dropdownRef}>
            <div className="relative mt-1">

              <div className="py-1">
                <input
                  type="text"
                  placeholder={placeholderSelect}
                  value={modalType.toLowerCase() === 'update' ? capitalizeFirstLetter(dataModal.name) : capitalizeFirstLetter(searchTerm)}
                  onFocus={() => setDropdownOpen(true)}
                  onChange={e => setSearchTerm(e.target.value)}
                  className={`w-full  py-2 text-xl  ${modalType.toLowerCase() === 'update'? 'bg-white font-semibold' : 'px-3 border rounded-lg border-gray-500'}`}
                  disabled={modalType.toLowerCase() === 'update'}
                  required
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                    onClick={clearSearch}
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
              <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">
                {
                  dropdownOpen && <ul className="max-h-56 overflow-y-auto py-1 text-base leading-6 shadow-xs focus:outline-none sm:text-sm sm:leading-5">
                    {filteredOptions?.length === 0 ? (
                      <li className="cursor-default select-none relative py-2 px-3 text-gray-700">
                        Nessun elemento trovato
                      </li>
                    ) : (
                      filteredOptions.map(option => (
                        <li
                          key={option.id}
                          className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-200 ${isOptionDisabled(option) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'text-gray-700'}`}
                          onClick={() => !isOptionDisabled(option) && handleOptionClick(option)}
                        >
                          <span className={`font-normal truncate ${isOptionDisabled(option) ? 'flex justify-between' : ' block '}`}>
                            <p>
                              {capitalizeFirstLetter(cleanString(option.name))}
                            </p>
                            {isOptionDisabled(option) ?
                              <p>
                                {`Elemento esistente per la Stagione ${seasonModal}`}
                              </p> : null
                            }
                          </span>
                        </li>
                      ))
                    )}
                  </ul>
                }
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium self-end mb-1">
            {dataModal.payments.length === 0 ? 'Nessuna rata inserita' : `Rate inserite: ${dataModal.payments.length}`}
          </span>
          <div className="flex justify-end gap-4 mb-2">
            <button
              type="button"
              onClick={addPayment}
              className={`px-4 py-1 bg-gray-200 text-gray-700 rounded-md flex items-center hover:bg-gray-300 transition duration-300`}
            >
              <FaPlus className="mr-2" />
              <span>Aggiungi rata</span>
            </button>
            <button
              type="button"
              onClick={() => removePayment(dataModal.payments[dataModal.payments.length - 1]?.idCosto)}
              className={`px-4 py-1 bg-gray-200 text-gray-700 rounded-md flex items-center hover:bg-gray-300 transition duration-300`}
            >
              <FaMinus className="mr-2" />
              <span>Rimuovi rata</span>
            </button>
          </div>
        </div>


        <div className="overflow-y-scroll h-64 flex-grow border-2 rounded-md" ref={ref}>
          {transitions((style, item, t, index) => (
            <animated.div
              key={item.idCosto}
              style={style}
              className="mb-10 border rounded-md flex flex-wrap shadow-lg"
              ref={index === dataModal.payments.length - 1 ? lastPaymentRef : null}
            >
              <div className='w-full p-4 bg-gray-200 flex justify-between'>

                <div className='flex w-full gap-2'>
                  <h3 className="select-none text-lg font-medium ">{`${index + 1} )`}</h3>
                  <InputForm name="costType" data={item.costType} handleChange={(e) => handlePaymentChange(index, e)} />
                </div>



                <button type="button" onClick={() => removePayment(item.idCosto)} className="text-gray-600 hover:text-gray-800">
                  <FaTrashAlt />
                </button>
              </div>
              <div className='w-full p-4 flex flex-col gap-6'>
                <div className='flex justify-between'>
                  <InputForm name="emissionDate" data={item.emissionDate} minMaxDate={seasonModal} handleChange={(e) => handlePaymentChange(index, e)} />
                  <InputForm name="costNumber" data={item.costNumber} handleChange={(e) => handlePaymentChange(index, e)} />
                  <InputForm name="expiredDate" data={item.expiredDate} minMaxDate={seasonModal} handleChange={(e) => handlePaymentChange(index, e)} />
                </div>
                <div className='flex justify-between gap-10'>
                  <InputForm name="paymentType" data={item.paymentType} handleChange={(e) => handlePaymentChange(index, e)} />
                  <InputForm name="amount" data={item.amount} handleChange={(e) => handlePaymentChange(index, e)} />
                  <InputForm name="paymentState" data={item.paymentState} handleChange={(e) => handlePaymentChange(index, e)} />
                </div>
              </div>
            </animated.div>
          ))}
        </div>
        <div className="flex justify-end mt-3">
          <button
            type="submit"
            className={`px-5 py-1 rounded-md ${isSubmitDisabled ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            disabled={isSubmitDisabled}
          >
            {`${modalType.toLowerCase() === 'create' ? 'Aggiungi' : modalType.toLowerCase() === 'update' ? 'Modifica' : ''}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUpdateForm;
