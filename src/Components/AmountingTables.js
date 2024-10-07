import SemesterTable from './SemesterTable';
import TotalSeasonTable from './TotalSeasonTable';

const AmountingTables = ({ props }) => {


    const { data, seasonModal, tableRef } = props

    const listOfMonth = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8]
    const listFirstSemester = listOfMonth.slice(0, 6)
    const listSecondSemester = listOfMonth.slice(-6)
    const tableName = window.location.href.includes('/CostiFornitori') ? 'Fornitori' : 'Gestione'



    return (
        <div ref={tableRef} className="font-roboto select-none">
            <div className='pb-8'>
                <TotalSeasonTable tableName={tableName} listOfMonth={listOfMonth} data={data} seasonModal={seasonModal} />
            </div>
            <div className='flex flex-col gap-7'>
                <SemesterTable tableSemesterName={'Primo Semestre'} listOfMonth={listFirstSemester} data={data} seasonModal={seasonModal} />
                <SemesterTable tableSemesterName={'Secondo Semestre'} listOfMonth={listSecondSemester} data={data} seasonModal={seasonModal} />
            </div>
        </div>
    );
}

export default AmountingTables