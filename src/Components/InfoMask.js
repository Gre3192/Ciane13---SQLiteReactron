const InfoMask = ({ props }) => {

    return (
        <div className="p-6 flex bg-white rounded-lg shadow-xl h-full">
        <div className='flex w-full flex-col justify-between'>
          <p className='px-2 flex mb-10'>
            Fornitore giò presente!
          </p>
          <div className='flex justify-between'>
            <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">Chiudi</button>
          </div>
        </div>
      </div>
    )
}

export default InfoMask