import React, { useState } from "react";
import { FaPlus, FaMinus } from 'react-icons/fa';
import sumForMonthCustomer from "../Utils/sumForMonthCustomer";
import capitalizeFirstLetter from "../Utils/capitalizeFirstLetter";
import getMonthName from "../Utils/getMonthName";




export default function SemesterTableItem({ data, itemData, listOfMonth }) {

    const [isOpenRowTable, setisOpenRowTable] = useState(false)

    return (

        <div className="pdf-row" style={{ display: "contents" }}>
            <div className="flex items-center h-fit cursor-pointer" onClick={() => setisOpenRowTable(!isOpenRowTable)}>
                <button
                    className={`pl-2 text-gray-500 transition-all duration-300`}
                    disabled={data?.length === 0}
                    data-html2canvas-ignore
                >
                    {isOpenRowTable ? <FaMinus /> : <FaPlus />}
                </button>
                <div className="py-3 px-2 font-semibold">
                    {capitalizeFirstLetter(itemData.name)}
                </div>
            </div>
            {
                listOfMonth.map(
                    (month, index) => {
                        return (
                            <div key={index} className="py-3 px-4 cursor-pointer border-r border-l border-gray-300" onClick={() => setisOpenRowTable(!isOpenRowTable)}>
                                {
                                    isOpenRowTable ?
                                        <div>
                                            <div className="flex justify-between" >
                                                <div title={`Somma fatture di ${getMonthName(month)}`}>
                                                    {sumForMonthCustomer(itemData, month) === 0 ? '' : `${sumForMonthCustomer(itemData, month, 'fattura')} \u20AC`}
                                                </div>
                                                {sumForMonthCustomer(itemData, month) === 0 ? '' : <FaMinus className="w-2" />}
                                            </div>
                                            <div className="flex justify-between">
                                                <div title={`Somma note di credito di ${getMonthName(month)}`}>
                                                    {sumForMonthCustomer(itemData, month) === 0 ? '' : `${sumForMonthCustomer(itemData, month, 'nota di credito')} \u20AC`}
                                                </div>
                                            </div>
                                            <div title={`Totale di ${getMonthName(month)}`}>
                                                {sumForMonthCustomer(itemData, month) === 0 ? null : <hr />}
                                            </div>
                                        </div>
                                        : null
                                }
                                <div className={`${isOpenRowTable && sumForMonthCustomer(itemData, month) != 0 ? 'flex justify-end' : null}`} title={`Totale di ${getMonthName(month)}`}>
                                    {sumForMonthCustomer(itemData, month) === 0 ? '' : `${sumForMonthCustomer(itemData, month)} \u20AC`}
                                </div>
                            </div>
                        )
                    }
                )
            }
        </div>

    )
}


