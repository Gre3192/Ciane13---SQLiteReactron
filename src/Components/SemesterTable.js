import sumForMonth from "../Utils/sumForMonth"
import getMonthName from "../Utils/getMonthName"
import { useState } from "react";
import { FaPlus, FaMinus } from 'react-icons/fa';
import SemesterTableItem from "./SemesterTableItem";

const SemesterTable = ({ tableSemesterName, listOfMonth, data, seasonModal }) => {

    const [isOpen, setisOpen] = useState(false)
    const [isOpenRowTable, setisOpenRowTable] = useState(false)

    return (
        <div className='p-2 border-2 rounded shadow-lg'>
            <div className="flex justify-between mb-2">
                <div className='text-gray-600 font-roboto uppercase font-bold text-lg py-2 flex gap-2'>
                    <p>
                        {tableSemesterName}
                        {':'}
                    </p>
                    <p className="font-normal">
                        {sumForMonth(data, listOfMonth)}
                        {' \u20AC'}
                    </p>
                </div>
                <div data-html2canvas-ignore>
                    <button
                        className={`text-white p-2 rounded-md transition-all duration-300 ${data?.length === 0 ? 'bg-gray-300' : 'bg-gray-500 hover:bg-gray-600'}`}
                        onClick={() => setisOpen(!isOpen)}
                        disabled={data?.length === 0}  // Disabilita il bottone se data è vuoto
                    >
                        {isOpen ? <FaMinus /> : <FaPlus />}
                    </button>
                </div>
            </div>

            <div className="w-full  bg-white border border-gray-200">

                {/* Testa tabella */}
                <div className="bg-gray-200 grid grid-cols-7 text-gray-600 uppercase text-xs leading-normal">
                    <div className="py-3 px-4 text-left">
                        uscita
                    </div>
                    {
                        listOfMonth?.map(
                            (month, index) => {
                                return (
                                    <div key={index} className="py-3 px-4 text-left flex items-center ">
                                        {getMonthName(month)}{' '}{month >= 9 && month <= 12 ? seasonModal?.split('/')[0] : seasonModal?.split('/')[1]}
                                    </div>
                                )
                            }
                        )
                    }
                </div>


                {/* Righe tabella */}
                {
                    isOpen && data?.map((itemData, index) => {
                        return (
                            <div key={index} className="border-b py-2 grid grid-cols-7  border-gray-200">
                                <SemesterTableItem data={data} itemData={itemData} listOfMonth={listOfMonth} />
                            </div>
                        )
                    }
                    )
                }



                {/* Somma di tutto il mese di tutte le uscite */}
                <div className="border-b grid grid-cols-7 border-gray-200 bg-gray-100">
                    <div className="py-3 px-4 uppercase font-bold">
                        totale
                    </div>
                    {
                        listOfMonth.map(
                            (month, index) => {
                                return (
                                    <div key={index} className="py-3 px-4 ">
                                        {
                                            sumForMonth(data, month) === 0 ?
                                                '-' :
                                                `${sumForMonth(data, month)} \u20AC`
                                        }
                                    </div>
                                )
                            }
                        )
                    }
                </div>
            </div>

        </div>
    )
}

export default SemesterTable