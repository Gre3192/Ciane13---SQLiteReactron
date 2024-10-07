import React, { useState, useEffect, useMemo, useRef } from 'react';
import HeadTable from '../../Components/HeadTable';
import TableCard from '../../Components/TableCard';
import Modal from '../../Components/Modal';
import ErrorMask from '../../Components/ErrorMask';
import LoadingMask from '../../Components/LoadingMask';
import AmountingTables from '../../Components/AmountingTables';
import handleDownloadPDF from '../../Utils/handleDownloadPDF';


const ListOfCostsPage = () => {

    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [itemSelected, setItemSelected] = useState(null);
    const [modalType, setModalType] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterCosti, setfilterCosti] = useState({});
    const [filterFornitori, setfilterFornitori] = useState({});
    const [filterGestione, setfilterGestione] = useState({});
    const [seasonModal, setSeasonModal] = useState(null);
    const [showTable, setShowTable] = useState({});
    const [isList, setIsList] = useState(true);

    const tableRef = useRef();

    const isCostiFornitoriPage = window.location.href.includes('/CostiFornitori');
    const isCostiGestionePage = window.location.href.includes('/CostiGestione');
    const nameTable = isCostiFornitoriPage ? 'Costi Fornitori' : 'Costi Gestione';

    useEffect(() => {
        setShowTable({});
        if (isCostiGestionePage) {
            window.electronAPI.getCostiGestione(filterCosti, filterGestione)
                .then(data => {
                    setData(data);
                });
        }
        if (isCostiFornitoriPage) {
            window.electronAPI.getCostiFornitori(filterCosti, filterFornitori)
                .then(data => {
                    setData(data);
                });
        }
        setLoading(false);
    }, [filterCosti, filterFornitori, filterGestione, window.location.href]);

    const filteredData = useMemo(() => {
        if (!data) return [];
        return data.filter((item) => {
            return (
                (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        });
    }, [data, searchTerm]);
    const recordsToDisplay = searchTerm ? filteredData : (data ? data : []);

    const addItem = (newItem) => {
        setData(prevData => [...prevData, newItem])
    };

    const updateItem = (id, updatedItem) => {
        setData(prevData => {
            const updatedData = prevData.map(item => {
                if (isCostiFornitoriPage) {
                    if (item?.idFornitore === id) {
                        return updatedItem;
                    }
                }
                if (isCostiGestionePage) {
                    if (item?.idGestione === id) {
                        return updatedItem;
                    }
                }
                return item;
            });
            return updatedData;
        });
    };

    const deleteItem = (id) => {
        if (isCostiFornitoriPage) {
            setData(prevData => prevData.filter(item => item.idFornitore !== id));
        }
        if (isCostiGestionePage) {
            setData(prevData => prevData.filter(item => item.idGestione !== id));
        }
        closeModal();
    };

    const handleSearch = (event) => {
        setShowTable({});
        setSearchTerm(event.target.value);
    };

    const clearSearch = () => {
        setShowTable({});
        setSearchTerm('');
    };

    const openModal = (type, item = null) => {
        setModalType(type);
        setItemSelected(item);
    };

    const closeModal = () => {
        setShowTable({});
        setModalType('');
        setItemSelected(null);
    };

    const handleToggle = () => {
        setIsList(!isList);
    };

    const ModalProps = () => {
        switch (modalType.toLowerCase()) {
            case "create":
                return {
                    data: data,
                    modalType: modalType,
                    itemSelected: null,
                    seasonModal: seasonModal,
                    closeModal: closeModal,
                    handlefunction: addItem
                };
            case "update":
                return {
                    modalType: modalType,
                    itemSelected: itemSelected,
                    seasonModal: seasonModal,
                    closeModal: closeModal,
                    handlefunction: (id, data) => updateItem(id, data)
                };
            case "delete":
                return {
                    modalType: modalType,
                    itemSelected: itemSelected,
                    seasonModal: seasonModal,
                    closeModal: closeModal,
                    handlefunction: deleteItem
                };
            default:
                return {};
        }
    };

    const HeadTableProps = () => {
        return {
            data: data,
            searchTerm: searchTerm,
            nameTable: nameTable,
            seasonModal: seasonModal,
            isList: isList,
            handleSearch: handleSearch,
            clearSearchTerm: clearSearch,
            setfilterCosti: setfilterCosti,
            openModal: openModal,
            setSeasonModal: setSeasonModal,
            setShowTable: setShowTable,
            handleToggle: handleToggle,
            handleDownloadPDF: () => handleDownloadPDF(tableRef, 'Contabilità' + ' ' + nameTable.replace('Costi ', '') + ' ' + seasonModal)
        };
    };

    const TableCardProps = (item, index) => {
        return {
            item: item,
            index: index,
            showTable: showTable,
            openModal: openModal,
            setShowTable: setShowTable
        };
    };

    const AmountingTablesProps = () => {
        return {
            data: data,
            seasonModal: seasonModal,
            tableRef: tableRef,
        };
    };


    return (
        <>
            {error ? <ErrorMask error={error} />
                :
                loading ? <LoadingMask />
                    :
                    <>
                        <HeadTable props={HeadTableProps()} />
                        {
                            !isList ?
                                <div className="font-roboto h-[85vh] overflow-y-scroll select-none">
                                    <AmountingTables props={AmountingTablesProps()} />
                                </div>
                                :
                                <div className={`relative ${modalType ? 'modal-open' : ''} overflow-y-scroll h-[85vh]`}>
                                    {modalType && <Modal props={ModalProps()} />}
                                    <div className={`${modalType ? 'pointer-events-none opacity-50' : ''}`}>
                                        {recordsToDisplay.length === 0 ? (
                                            <p className='text-xl font-semibold text-center mt-4 select-none'>Nessun elemento trovato</p>
                                        ) : (
                                            recordsToDisplay.map((item, index) => {
                                                return (
                                                    <React.Fragment key={index}>
                                                        <TableCard props={TableCardProps(item, index)} />
                                                    </React.Fragment>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                        }
                    </>
            }
        </>
    );
}

export default ListOfCostsPage;
