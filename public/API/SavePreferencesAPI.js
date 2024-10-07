const path = require('path');
const fs = require('fs');
const { loadPreferences } = require('./LoadPreferencesAPI');

const savePreferences = (preferences) => {
  // const preferencesPath = path.join(__dirname, '..', '..', 'preferences.json');
  const preferencesPath = path.join(process.cwd(), 'preferences.json')
  if (!fs.existsSync(preferencesPath)) {
    fs.writeFileSync(preferencesPath, JSON.stringify(preferences, null, 2));
  } else {
    const existingPreferences = loadPreferences();
    const updatedPreferences = { ...existingPreferences, ...preferences };
    fs.writeFileSync(preferencesPath, JSON.stringify(updatedPreferences, null, 2));
  }
};

module.exports = {
  savePreferences
};