import { FaPlus, FaTimes } from 'react-icons/fa';
import SeasonSelector from './SeasonSelector';
import ToggleSwitch from './ToggleSwitch';

const HeadTable = ({ props }) => {

    const { data, handleSearch, searchTerm, clearSearchTerm, openModal, setfilterCosti, nameTable, setSeasonModal, seasonModal, setShowTable, isList, handleToggle, handleDownloadPDF} = props;
    const nameTableExcel = nameTable + ' ' + seasonModal

    const ToggleSwitchProps = () => {
        return {
            isList: isList,
            handleToggle: handleToggle
        };
    };

    const SeasonSelectorProps = () => {
        return {
            onSeasonSelect: setfilterCosti,
            setSeasonModal: setSeasonModal,
            setShowTable: setShowTable
        };
    };

    return (
        <div className='pt-2 pb-5 flex justify-between items-center sticky top-0 z-10 select-none'>
            <div className='flex gap-5'>
                <SeasonSelector props={SeasonSelectorProps()} />
                <p className='font-bold uppercase text-xl underline select-none'>{nameTable}</p>
            </div>
            <div className='relative flex items-center gap-5 select-none'>
                <ToggleSwitch props={ToggleSwitchProps()} />
                <input
                    type='text'
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder='Ricerca...'
                    className='border rounded-3xl p-2 px-5 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none'
                />
                {searchTerm && (
                    <button
                        onClick={clearSearchTerm}
                        className={`absolute ${window.location.href.includes('/Contabilita') ? 'right-2' : 'right-52'} top-1/2 transform -translate-y-1/2 focus:outline-none scale-50`}
                    >
                        <FaTimes className='text-gray-500 hover:text-gray-700 h-fit hover:scale-125 transition-all duration-300 text-3xl' />
                    </button>
                )}
                <button onClick={() => openModal('create')} disabled={!isList}>
                    <FaPlus className={`h-fit ${isList ? 'hover:scale-125 hover:text-gray-700 text-gray-500' : 'text-gray-300'} transition-all duration-300 text-xl`} />
                </button>
                {/* <button onClick={handleDownloadPDF} disabled={!isList} className={` text-white ${isList ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-300'} px-4 py-2 rounded-md transition-all duration-300`}> */}
                <button onClick={handleDownloadPDF} disabled={isList} className={` text-white ${!isList ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-300'} px-4 py-2 rounded-md transition-all duration-300`}>
                    <p className='select-none'>
                        Download PDF
                    </p>
                </button>
            </div>
        </div>
    )
}

export default HeadTable;
