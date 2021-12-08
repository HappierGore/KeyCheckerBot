const sqlManager = require('./sqlManager.js');

const keyData = (serverID) => sqlManager.getKeyData.get(serverID);

const userPreferences = (userID) => sqlManager.getPreferencesUser.get(userID);

const serverPreferences = (serverID) =>
    sqlManager.getPreferencesServer.get(serverID);

module.exports = {
    keyData,
    userPreferences,
    serverPreferences,
};
