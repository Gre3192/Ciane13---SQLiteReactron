const ErrorMask = ({ error }) => {

    return (
        <div className='flex justify-center gap-10 p-28'>
            <p className='text-3xl font-semibold text-red-500'>{error.message}</p>
            <button onClick={() => window.location.reload()} className='bg-blue-500 text-white px-4 py-2 rounded-md'>Riprova</button>
        </div>
    )
}

export default ErrorMask