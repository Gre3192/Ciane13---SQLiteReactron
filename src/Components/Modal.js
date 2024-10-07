import AddUpdateForm from './AddUpdateForm';
import DeleteForm from './DeleteForm';

const Modal = ({ props }) => {

  const { modalType, closeModal, itemSelected, seasonModal, handlefunction, data } = props;


  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const AddUpdateFormProps = () => {
    return {
      data: data,
      closeModal: closeModal,
      seasonModal: seasonModal,
      modalType: modalType,
      handlefunction: handlefunction,
      itemSelected: itemSelected
    }
  }

  const DeleteFormProps = () => {
    return {
      closeModal: closeModal,
      seasonModal: seasonModal,
      modalType: modalType,
      handlefunction: handlefunction,
      itemSelected: itemSelected
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleBackgroundClick}>
      <div className={`bg-white p-0 rounded-lg shadow-xl z-10 ${modalType.toLowerCase() === 'delete' ? '' : 'w-[80%] h-[80%]'} overflow-auto`} onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col gap-6 h-full">
          {modalType.toLowerCase() === 'create' || modalType.toLowerCase() === 'update' ?
            <AddUpdateForm props={AddUpdateFormProps()} />
            :
            <DeleteForm props={DeleteFormProps()} />
          }
        </div>
      </div>
    </div>
  );
};

export default Modal;
