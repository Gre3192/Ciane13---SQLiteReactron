import sumForMonth from "../Utils/sumForMonth"

const TotalSeasonTable = ({ tableName, listOfMonth, data, seasonModal}) => {

    return (
        <table className="w-full bg-white border border-gray-200">
        <thead>
            <tr className="bg-gray-500 text-white uppercase text-xs leading-normal">
                <th className="py-3 px-4 text-left flex justify-center">
                    <div className="flex flex-col items-center">
                        <div>{`Stagione ${seasonModal}`}</div>
                        <div className="text-sm text-gray-200">{`Totale uscite ${tableName}`}</div>
                    </div>
                </th>
            </tr>
        </thead>
        <tbody className=" bg-gray-500 text-white text-sm font-light">
            <tr className="border-b border-gray-200 flex justify-center">
                <th className=' text-base'>
                    {`${sumForMonth(data, listOfMonth)}`}{' \u20AC'}
                </th>
            </tr>
        </tbody>
    </table>
    )
}

export default TotalSeasonTable