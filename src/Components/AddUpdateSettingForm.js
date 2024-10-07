import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import fornitoriAtom from '../Atom/FornitoriAtom'; //
import gestioneAtom from '../Atom/GestioneAtom'; //

const AddUpdateSettingForm = ({ props }) => {

  const { modalTitle, closeModal, modalType, handlefunction, itemSelected } = props;

  const [fornitori, setFornitori] = useRecoilState(fornitoriAtom);
  const [gestione, setGestione] = useRecoilState(gestioneAtom);

  const [fornitoreToUpdate, setFornitoreToUpdate] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    pIva: ''
  });
  const [gestioneToUpdate, setGestioneToUpdate] = useState({
    name: '',
  });

  const [data, setData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    pIva: ''
  });

  useEffect(() => {
    if (itemSelected && modalType.toLowerCase().includes('update')) {
      setData({
        name: itemSelected.name || '',
        phone: itemSelected.phone || '',
        email: itemSelected.email || '',
        address: itemSelected.address || '',
        pIva: itemSelected.pIva || ''
      });
    }
  }, [itemSelected, modalType]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let result = null;
    if (modalType.toLowerCase() === 'addgestione') {
      result = await window.electronAPI.addGestione(data);
      handlefunction(result);
    }
    if (modalType.toLowerCase() === 'updategestione') {
      if (!itemSelected.idGestione) {
      } else {
        result = await window.electronAPI.updateGestione(itemSelected.idGestione, data);
        handlefunction(itemSelected.idGestione, result);
      }
    }
    if (modalType.toLowerCase() === 'addfornitore') {
      result = await window.electronAPI.addFornitori(data);
      handlefunction(result);
    }
    if (modalType.toLowerCase() === 'updatefornitore') {
      if (!itemSelected.idFornitore) {
      } else {
        result = await window.electronAPI.updateFornitori(itemSelected.idFornitore, data);
        handlefunction(itemSelected.idFornitore, result);
      }
    }
    closeModal();

  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => (
      {
        ...prevData,
        [name]: value,
      }));
  };




  
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">{modalTitle}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Nome
          </label>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
        {modalType.toLowerCase().includes('fornitore') && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Telefono
              </label>
              <input
                type="text"
                name="phone"
                value={data.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                email
              </label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Indirizzo
              </label>
              <input
                type="text"
                name="address"
                value={data.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Partita IVA
              </label>
              <input
                type="text"
                name="pIva"
                value={data.pIva}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </>
        )}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {modalType.toLowerCase().includes('add') ? 'Aggiungi' : 'Modifica'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUpdateSettingForm;
