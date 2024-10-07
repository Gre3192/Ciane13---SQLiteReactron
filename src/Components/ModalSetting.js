import React from 'react';
import { FaTimes } from 'react-icons/fa';
import AddUpdateSettingForm from './AddUpdateSettingForm';
import DeleteSettingForm from './DeleteSettingForm';

const ModalSetting = ({ props }) => {

  const { modalTitle, modalType, closeModal, itemSelected, seasonModal, handlefunction } = props;

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const AddUpdateSettingFormProps = () => {
    return {
      modalTitle: modalTitle,
      closeModal: closeModal,
      seasonModal: seasonModal,
      modalType: modalType,
      handlefunction: handlefunction,
      itemSelected: itemSelected
    };
  }

  const DeleteSettingFormProps = () => {
    return {
      closeModal: closeModal,
      seasonModal: seasonModal,
      modalType: modalType,
      handlefunction: handlefunction,
      itemSelected: itemSelected
    };
  }

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex justify-center items-center" onClick={handleBackgroundClick}>
      <div className="relative bg-white w-full max-w-md m-auto flex-col flex rounded-lg shadow-lg">
        <span className="absolute top-0 right-0 p-4">
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </span>
        {modalType.toLowerCase().includes('add') || modalType.toLowerCase().includes('update') ?
          <AddUpdateSettingForm props={AddUpdateSettingFormProps()} />
          :
          <DeleteSettingForm props={DeleteSettingFormProps()} />
        }
      </div>
    </div>
  );
};

export default ModalSetting;
