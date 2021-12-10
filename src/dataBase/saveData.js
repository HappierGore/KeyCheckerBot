const sqlManager = require('./sqlManager.js');

const keyData = (discordGuild, message, key) => {
    const dataStructure = {
        usernameWhoClaimed: message.author.username,
        userIDWhoClaimed: message.author.id,
        claimedDate: new Date().getTime(),
        lifetime: key.lifetime,
    };

    const dataToDB = {
        ServerID: discordGuild.id,
        Key: key.key,
        Data: JSON.stringify(dataStructure),
    };

    sqlManager.setKeyData.run(dataToDB);
};

const userPreferences = (userID, serverID) => {
    const dataToDB = {
        UserID: userID,
        ServerID: serverID,
    };

    sqlManager.setPreferencesUser.run(dataToDB);
};

const serverPreferences = (serverID, rolesAllowed) => {
    const dataToDB = {
        ServerID: serverID,
        rolesAllowed: JSON.stringify(rolesAllowed),
    };

    sqlManager.setPreferencesServer.run(dataToDB);
};

module.exports = {
    keyData,
    userPreferences,
    serverPreferences,
};
