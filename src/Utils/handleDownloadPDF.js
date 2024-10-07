import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const handleDownloadPDF = async (elementRef, nameDoc = 'tabella') => {
  try {
    if (!elementRef || !elementRef.current) {
      console.error("Elemento non valido o non esiste nel DOM:", elementRef);
      return;
    }

    // Definisce le dimensioni desiderate in pixel per l'elemento da catturare
    const elementWidth = elementRef.current.scrollWidth;
    const elementHeight = elementRef.current.scrollHeight;

    // Riduci la scala per evitare di creare immagini troppo grandi
    const canvas = await html2canvas(elementRef.current, {
      scale: 1.5, // Usa una scala minore per ridurre la dimensione dell'immagine
      width: elementWidth, // Imposta la larghezza dell'elemento
      height: elementHeight, // Imposta l'altezza dell'elemento
      useCORS: true, // Gestione delle risorse esterne
      scrollX: 0,
      scrollY: 0,
    });

    // Verifica che l'immagine generata non sia corrotta
    if (!canvas) {
      throw new Error("Errore nella generazione del canvas con html2canvas");
    }

    const imgData = canvas.toDataURL('image/jpeg', 0.8); // Usa JPEG con qualità 0.8

    // Crea un nuovo documento PDF con dimensioni standard A4
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Calcola le dimensioni del PDF
    const pdfWidth = pdf.internal.pageSize.getWidth(); // Larghezza PDF in mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // Altezza PDF in mm

    // Calcola il rapporto altezza/larghezza dell'immagine per mantenere la proporzione
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const aspectRatio = canvasHeight / canvasWidth;

    // Calcola l'altezza dell'immagine da inserire nel PDF, mantenendo la proporzione
    const imgWidth = pdfWidth;
    const imgHeight = pdfWidth * aspectRatio;

    // Calcola il numero di pagine necessario per il contenuto completo
    const totalPages = Math.ceil(imgHeight / pdfHeight);

    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
      // Calcola la porzione dell'immagine che deve essere disegnata su questa pagina
      const sourceY = pageIndex * pdfHeight; // Altezza di partenza per ogni pagina

      // Crea una nuova pagina a partire dalla seconda iterazione
      if (pageIndex > 0) {
        pdf.addPage();
      }

      // Disegna l'immagine parziale nella pagina corrente
      pdf.addImage(
        imgData,
        'JPEG', // Usa formato JPEG
        0, // x (posizione nel PDF)
        -sourceY, // y (spostamento verso l'alto per ogni porzione)
        imgWidth, // Larghezza dell'immagine all'interno del PDF
        imgHeight // Altezza dell'immagine totale mantenendo le proporzioni
      );
    }

    // Salva il PDF
    pdf.save(`${nameDoc}.pdf`);
  } catch (error) {
    console.error('Errore durante la generazione del PDF:', error);
  }
};

export default handleDownloadPDF;
