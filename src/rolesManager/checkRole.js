const getData = require('../dataBase/getData');
const checkRegistered = require('../keyChecker/checkRegistered');
const embedUtils = require('../Utils/embedUtils');
const config = require('../../configuration/config');

module.exports = function (client, message, notify = false) {
    const hasRole = {};
    let serversNoConfigured = [];
    const serversRegistered = checkRegistered(client, message);

    serversRegistered.forEach((server) => {
        const previousData = getData.serverPreferences(server.id);

        if (previousData) {
            const data = JSON.parse(previousData.rolesAllowed);

            const userServer = server.members.cache.get(message.author.id);

            const rolesNames = [];
            data.forEach((r) => {
                if (userServer.roles.cache.has(r)) {
                    hasRole[server.name] = true;
                    rolesNames.push(server.roles.cache.get(r).name);
                }
            });

            const lgData =
                Object.keys(hasRole).length > 0
                    ? `y además, tiene los roles ${rolesNames.join(
                          ', '
                      )} para su uso`
                    : 'pero no tiene ningún rol que le permita su uso';

            console.log(
                `El usuario ${message.author.username} tiene una licencia activa en ${server.name} ${lgData}`
            );
            return;
        }
        // Si no tienen data, entonces el servidor no ha registrado ningún rol para utilizar el bot
        serversNoConfigured.push(server);
    });
    if (!Object.keys(hasRole).length > 0 && notify) {
        let serversNames = [];

        serversNoConfigured.forEach((server) => {
            serversNames.push(server.name);
        });

        const size = serversNames.length;

        const noConfigured = `Sin embargo, aún hay ${
            size > 1 ? 'algunos' : 'un'
        } servidor${size > 1 ? 'es' : ''} que aún **no ha${
            size > 1 ? 'n' : ''
        } configurado** los roles a los que se les permita el uso del bot.\nEst${
            size > 1 ? 'os son' : 'e es'
        }:\n**${serversNames.join(', ')}**.\n`;

        const msg = embedUtils.simpleEmbedMSG(
            config.COLOR_ORANGE_STRONG,
            `Actualmente, te encuentras en servidores que **tienen licencia** pero no tienes los **rangos necesarios** para utilizar el bot.\n ${
                size > 0 ? noConfigured : ''
            }`
        );
        message.author.send(msg);
    }
    return hasRole;
};
