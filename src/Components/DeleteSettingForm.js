import capitalizeFirstLetter from '../Utils/capitalizeFirstLetter';
import cleanString from '../Utils/cleanString';

const DeleteSettingForm = ({ props }) => {

    const { closeModal, modalType, itemSelected, handlefunction } = props;

    const handleDelete = async () => {
        try {
            if (modalType.toLowerCase() === 'deletefornitore') {
                await window.electronAPI.deleteFornitori(itemSelected.idFornitore);
                handlefunction(itemSelected.idFornitore)
            }
            if (modalType.toLowerCase() === 'deletegestione') {
                await window.electronAPI.deleteGestione(itemSelected.idGestione);
                handlefunction(itemSelected.idGestione)
            }
            closeModal();
        } catch (error) {
            console.error('Errore durante la cancellazione:', error);
        }
    }

    return (
        <div className="px-6 py-10 flex bg-white rounded-lg shadow-xl h-full">
            <div className='flex w-full flex-col justify-between'>
                <p className='px-2 mb-10'>
                    Sei sicuro di voler eliminare{' '}
                    <span className="font-bold truncate overflow-hidden">
                        {capitalizeFirstLetter(cleanString(itemSelected.name))}
                    </span>{' '}
                    e tutti i suoi costi dal{' '}
                    <span className="font-bold">
                        Database
                    </span>?
                </p>
                <div className='flex justify-between'>
                    <button onClick={closeModal} className="underline px-2 py-2 rounded-md hover:scale-105 transform transition-transform duration-300 ease-in-out">Annulla</button>
                    <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">Elimina</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteSettingForm;
