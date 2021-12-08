const SQLite = require('better-sqlite3');
const sql = new SQLite(__dirname + '/../../localData/serversRegistered.db');
const sql2 = new SQLite(__dirname + '/../../localData/userPreferences.db');
const sql3 = new SQLite(__dirname + '/../../localData/serversConfig.db');

// SERVERS REGISTERED

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

// USER PREFERENCES

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

// SERVER CONFIGURATION

const dataBase3 = {
    tableName: 'Preferences',
    serverID: 'ServerID',
    rolesAllowed: 'rolesAllowed',
};

// Obtener datos
const getPreferencesServer = sql3.prepare(
    `SELECT * FROM ${dataBase3.tableName} WHERE ${dataBase3.serverID} = ?`
);
// Establecer datos
const setPreferencesServer = sql3.prepare(
    `INSERT OR REPLACE INTO ${dataBase3.tableName} (${dataBase3.serverID}, ${dataBase3.rolesAllowed}) VALUES (@${dataBase3.serverID}, @${dataBase3.rolesAllowed})`
);
// Eliminar datos
const delPreferencesServer = sql3.prepare(
    `DELETE FROM ${dataBase3.tableName} WHERE ${dataBase3.serverID} = ?`
);

module.exports = {
    getKeyData,
    setKeyData,
    delKeyData,
    getPreferencesUser,
    setPreferencesUser,
    delPreferencesUser,
    getPreferencesServer,
    setPreferencesServer,
    delPreferencesServer,
};
