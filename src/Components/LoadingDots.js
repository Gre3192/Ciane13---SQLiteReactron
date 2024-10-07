import React, { useState, useEffect } from 'react';

const LoadingDots = () => {
  const [count, setCount] = useState(0);

  const numberDots = 4

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount((prevCount) => (prevCount + 1) % (numberDots + 1)); // +1 per includere anche lo spazio vuoto
    }, 300); // Tempo in millisecondi tra un cambio di stato e l'altro

    return () => clearInterval(intervalId);
  }, []); // L'effetto si attiva solo al montaggio del componente

  const dots = Array.from({ length: count }).fill('.');

  return (
    <span className="text-gray-500 font-bold">
      {dots.join('')}
      {'\u00A0'}
    </span>
  );
};

export default LoadingDots;
