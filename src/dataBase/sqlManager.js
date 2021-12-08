const SQLite = require('better-sqlite3');
const sql = new SQLite(__dirname + '/../../localData/serversRegistered.db');
const sql2 = new SQLite(__dirname + '/../../localData/userPreferences.db');

const dataBase = {
    tableName: 'KeyData',
    serverID: 'ServerID',
    key: 'Key',
    data: 'Data',
};

// Obtener datos
const getKeyData = sql.prepare(
    `SELECT * FROM ${dataBase.tableName} WHERE ${dataBase.serverID} = ?`
);
// Establecer datos
const setKeyData = sql.prepare(
    `INSERT OR REPLACE INTO ${dataBase.tableName} (${dataBase.serverID}, ${dataBase.key}, ${dataBase.data}) VALUES (@${dataBase.serverID}, @${dataBase.key}, @${dataBase.data})`
);
// Eliminar datos
const delKeyData = sql.prepare(
    `DELETE FROM ${dataBase.tableName} WHERE ${dataBase.serverID} = ?`
);

const dataBase2 = {
    tableName: 'Preferences',
    userID: 'UserID',
    serverID: 'ServerID',
};

// Obtener datos
const getPreferencesUser = sql2.prepare(
    `SELECT * FROM ${dataBase2.tableName} WHERE ${dataBase2.userID} = ?`
);
// Establecer datos
const setPreferencesUser = sql2.prepare(
    `INSERT OR REPLACE INTO ${dataBase2.tableName} (${dataBase2.userID}, ${dataBase2.serverID}) VALUES (@${dataBase2.userID}, @${dataBase2.serverID})`
);
// Eliminar datos
const delPreferencesUser = sql2.prepare(
    `DELETE FROM ${dataBase2.tableName} WHERE ${dataBase2.userID} = ?`
);

module.exports = {
    getKeyData,
    setKeyData,
    delKeyData,
    getPreferencesUser,
    setPreferencesUser,
    delPreferencesUser,
};
