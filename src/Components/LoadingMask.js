import CircularProgress from '@mui/material/CircularProgress';

const LoadingMask = () => {

    return(
        <div className='flex justify-center gap-10 p-28'>
        <p className='text-3xl font-semibold'>Sto caricando i dati</p>
        <CircularProgress className='scale-105' />
      </div>
    
    )
}

export default LoadingMask