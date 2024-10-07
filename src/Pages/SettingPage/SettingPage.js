import { useState, useEffect } from 'react';
import { FaPlus, FaPencilAlt, FaTrashAlt, FaCog, FaTimes } from 'react-icons/fa';
import ErrorMask from '../../Components/ErrorMask';
import LoadingMask from '../../Components/LoadingMask';
import ModalSetting from '../../Components/ModalSetting';
import cleanString from '../../Utils/cleanString';
import capitalizeFirstLetter from '../../Utils/capitalizeFirstLetter';


const SettingPage = () => {

  const [fornitori, setFornitori] = useState([]);
  const [gestione, setGestione] = useState([]);
  const [filteredFornitori, setFilteredFornitori] = useState([]);
  const [filteredGestione, setFilteredGestione] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fornitoreSearchTerm, setFornitoreSearchTerm] = useState('');
  const [gestioneSearchTerm, setGestioneSearchTerm] = useState('');
  const [modalType, setModalType] = useState('');
  const [itemSelected, setItemSelected] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fornitoriData = await window.electronAPI.getFornitori();
        const gestioneData = await window.electronAPI.getGestione();
        setFornitori(fornitoriData);
        setFilteredFornitori(fornitoriData);
        setGestione(gestioneData);
        setFilteredGestione(gestioneData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredFornitori(
      fornitori.filter(fornitore =>
        fornitore.name && fornitore.name.toLowerCase().includes(fornitoreSearchTerm.toLowerCase())
      ).map(fornitore => ({
        ...fornitore,
        idFornitore: fornitore.idFornitore || fornitori.find(f => f.name === fornitore.name).idFornitore
      }))
    );
  }, [fornitoreSearchTerm, fornitori]);

  useEffect(() => {
    setFilteredGestione(
      gestione.filter(item =>
        item.name && item.name.toLowerCase().includes(gestioneSearchTerm.toLowerCase())
      ).map(item => ({
        ...item,
        idGestione: item.idGestione || gestione.find(g => g.name === item.name).idGestione
      }))
    );
  }, [gestioneSearchTerm, gestione]);

  const addNewFornitore = (newFornitore) => {
    setFornitori(prevData => [...prevData, newFornitore]);
    setFornitoreSearchTerm('')
  };

  const updateFornitore = (id, updatedFornitore) => {
    setFornitori(prevData => {
      const updatedData = prevData.map(fornitore => {
        if (fornitore.idFornitore === id) {
          return updatedFornitore;
        }
        return fornitore;
      });
      return updatedData;
    });
    setFornitoreSearchTerm('')
  };

  const deleteFornitore = (idFornitore) => {
    setFornitori(prevData => prevData.filter(item => item.idFornitore !== idFornitore));
    setFornitoreSearchTerm('')
  };

  const addNewGestione = (newGestione) => {
    setGestione(prevData => [...prevData, newGestione]);
    setGestioneSearchTerm('')
  };

  const updateGestione = (id, updatedGestione) => {
    setGestione(prevData => {
      const updatedData = prevData.map(gestione => {
        if (gestione.idGestione === id) {
          return updatedGestione;
        }
        return gestione;
      });
      return updatedData;
    });
    setGestioneSearchTerm('')
  };

  const deleteGestione = (idGestione) => {
    setGestione(prevData => prevData.filter(item => item.idGestione !== idGestione));
    setGestioneSearchTerm('')
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setItemSelected(item);
  };

  const closeModal = () => {
    setModalType('');
    setItemSelected(null);
  };

  const ModalSettingProps = () => {
    switch (modalType.toLowerCase()) {
      case "addfornitore":
        return {
          modalTitle: 'Aggiungi Fornitore',
          modalType: modalType,
          closeModal: closeModal,
          handlefunction: addNewFornitore,
          itemSelected: null,
        };
      case "updatefornitore":
        return {
          modalTitle: 'Modifica Fornitore',
          modalType: modalType,
          closeModal: closeModal,
          handlefunction: (id, data) => updateFornitore(id, data),
          itemSelected: itemSelected,
        };
      case "deletefornitore":
        return {
          modalType: modalType,
          closeModal: closeModal,
          handlefunction: deleteFornitore,
          itemSelected: itemSelected,
        };
      case "addgestione":
        return {
          modalTitle: 'Aggiungi Gestione',
          modalType: modalType,
          closeModal: closeModal,
          handlefunction: addNewGestione,
          itemSelected: null,
        };
      case "updategestione":
        return {
          modalTitle: 'Modifica Gestione',
          modalType: modalType,
          closeModal: closeModal,
          handlefunction: (id, data) => updateGestione(id, data),
          itemSelected: itemSelected,
        };
      case "deletegestione":
        return {
          modalType: modalType,
          closeModal: closeModal,
          handlefunction: deleteGestione,
          itemSelected: itemSelected,
        };
      default:
        return {};
    }
  };

  return (
    <>
      {error ? <ErrorMask error={error} />
        :
        loading ? <LoadingMask />
          :
          <div className="container mx-auto p-4 h-[96%] overflow-hidden select-none">
            <h1 className="text-2xl font-bold mb-4 items-center flex gap-2">
              <FaCog />
              <p>Impostazioni</p>
            </h1>
            <div className="flex flex-col md:flex-row gap-4 h-[90%]">


              <div className="w-full md:w-1/2 bg-white shadow-md rounded-lg p-4 flex flex-col h-full">
                <div className="sticky top-0 bg-white flex justify-between items-center mb-4 p-2 z-10">
                  <h2 className="text-xl font-bold">Gestione</h2>
                  <div className="flex items-center relative">
                    <input
                      type="text"
                      placeholder="Cerca Gestione..."
                      value={gestioneSearchTerm}
                      onChange={(e) => setGestioneSearchTerm(e.target.value)}
                      className="p-2 border rounded-md mr-2 flex-grow"
                    />
                    {gestioneSearchTerm && (
                      <button
                        onClick={() => setGestioneSearchTerm('')}
                        className="absolute right-16 text-gray-500 hover:text-gray-700"
                      >
                        <FaTimes />
                      </button>
                    )}
                    <button
                      onClick={() => openModal('addGestione')}
                      className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-md flex items-center ml-2"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
                <div className="flex-grow overflow-y-auto">
                  <ul className="list-disc pl-3">
                    {filteredGestione.length === 0 ?
                      <p className='text-xl font-semibold text-center mt-4 select-none'>Nessun elemento trovato</p>
                      :
                      filteredGestione.map((item) => (
                        <li key={item.idGestione} className="mr-3 flex justify-between items-center">
                          <span className="font-medium">{capitalizeFirstLetter(cleanString(item.name, true))}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openModal('updateGestione', item)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <FaPencilAlt />
                            </button>
                            <button
                              onClick={() => openModal('deleteGestione', item)}
                              className="text-gray-500 hover:text-gray-600"
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        </li>
                      ))
                    }
                  </ul>
                </div>
              </div>



              <div className="w-full md:w-1/2 bg-white shadow-md rounded-lg p-4 flex flex-col h-full">
                <div className="sticky top-0 bg-white flex justify-between items-center mb-4 p-2 z-10">
                  <h2 className="text-xl font-bold">Fornitori</h2>
                  <div className="flex items-center relative">
                    <input
                      type="text"
                      placeholder="Cerca Fornitore..."
                      value={fornitoreSearchTerm}
                      onChange={(e) => setFornitoreSearchTerm(e.target.value)}
                      className="p-2 border rounded-md mr-2 flex-grow"
                    />
                    {fornitoreSearchTerm && (
                      <button
                        onClick={() => setFornitoreSearchTerm('')}
                        className="absolute right-16 text-gray-500 hover:text-gray-700"
                      >
                        <FaTimes />
                      </button>
                    )}
                    <button
                      onClick={() => openModal('addFornitore')}
                      className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-md flex items-center ml-2"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
                <div className="flex-grow overflow-y-auto">
                  <ul className="list-disc pl-3">
                    {filteredFornitori.length === 0 ?
                      <p className='text-xl font-semibold text-center mt-4 select-none'>Nessun elemento trovato</p>
                      :
                      filteredFornitori.map((item) => (
                        <li key={item.idFornitore} className="mr-3 flex justify-between items-center">
                          <span className="font-medium">{capitalizeFirstLetter(cleanString(item.name, true))}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openModal('updateFornitore', item)}
                              className="text-blue-500 hover:text-blue-600"
                            >
                              <FaPencilAlt />
                            </button>
                            <button
                              onClick={() => openModal('deleteFornitore', item)}
                              className="text-gray-500 hover:text-gray-600"
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
      }
      {modalType && <ModalSetting props={ModalSettingProps()} />}
    </>
  );
};

export default SettingPage;
