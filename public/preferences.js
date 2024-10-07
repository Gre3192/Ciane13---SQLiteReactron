const fs = require('fs');
const path = require('path');


// const preferencesPath = path.join(__dirname, 'preferences.json');
const preferencesPath = path.join(process.cwd(), 'preferences.json');

const savePreferences = (preferences) => {
    fs.writeFileSync(preferencesPath, JSON.stringify(preferences, null, 2));
};

const loadPreferences = () => {
    if (fs.existsSync(preferencesPath)) {
        const data = fs.readFileSync(preferencesPath);
        return JSON.parse(data);
    }
    return {};
};

const getPreference = (key) => {
    const preferences = loadPreferences();
    return preferences[key];
};

const setPreference = (key, value) => {
    const preferences = loadPreferences();
    preferences[key] = value;
    savePreferences(preferences);
};

module.exports = {
    getPreference,
    setPreference
};
