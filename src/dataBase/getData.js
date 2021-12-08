const sqlManager = require(__dirname + '/sqlManager.js');

const keyData = (serverID) => sqlManager.getKeyData.get(serverID);

const userPreferences = (userID) => sqlManager.getPreferencesUser.get(userID);

module.exports = {
    keyData,
    userPreferences,
};
