const { Client, Message } = require('discord.js');
const getData = require('../dataBase/getData');
/**
 *
 * @param {Client} client
 * @param {Message} message
 */
module.exports = function (client, message) {
    const licensedBy = [];

    // FIXME En el if, van las condiciones para ser considerado un servidor registrado con licencia válida y vigente
    client.guilds.cache.forEach((server) => {
        const dbServer = getData.keyData(server.id);
        if (dbServer) {
            const serverUser = server.members.cache.has(message.author.id);
            if (serverUser) {
                const keyObj = JSON.parse(getData.keyData(server.id).Data);

                const now = new Date();

                const expireTime = new Date(keyObj.claimedDate);

                expireTime.setDate(new Date().getDate() + keyObj.lifetime);

                if (expireTime.getTime() > now.getTime()) {
                    licensedBy.push(server);

                    console.log(
                        `El usuario ${message.author.username} tiene una licencia activa gracias al servidor ${server.name}`
                    );
                }
            }
        }
    });
    return licensedBy;
};
