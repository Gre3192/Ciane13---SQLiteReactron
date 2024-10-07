const path = require('path');
const fs = require('fs');

const loadPreferences = () => {
  // Definisci il percorso del file di preferenze
  const preferencesPath = path.join(process.cwd(), 'preferences.json');

  // Valori predefiniti per le preferenze
  const defaultPreferences = {
    selectedSeason: '2020/2021'
  };

  try {
    // Controlla se il file di preferenze esiste
    if (!fs.existsSync(preferencesPath)) {
      // Se il file non esiste, crealo con i valori predefiniti
      fs.writeFileSync(preferencesPath, JSON.stringify(defaultPreferences, null, 2), 'utf-8');
      console.log('File di preferenze creato con valori predefiniti.');
    }

    // Leggi e restituisci il contenuto del file di preferenze
    const data = fs.readFileSync(preferencesPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Errore durante il caricamento delle preferenze:', error);
    return defaultPreferences; // Ritorna i valori di default in caso di errore
  }
};

module.exports = {
  loadPreferences
};
