const checkRole = require('../rolesManager/checkRole');
const checkRegistered = require('../keyChecker/checkRegistered');
const getData = require('../dataBase/getData');
const embedUtils = require('../Utils/embedUtils');
const config = require('../../configuration/config');

module.exports = function (client, message) {
    const licensedBy = checkRegistered(client, message);

    const dbPreference = getData.userPreferences(message.author.id) || {
        id: '-1',
    };
    let isValid = false;

    for (sv of licensedBy) {
        if (sv.id === dbPreference.ServerID) isValid = true;
    }

    console.log(isValid);

    if (licensedBy.length > 0) {
        const serverPreferred =
            client.guilds.cache.get(dbPreference.ServerID) || licensedBy[0];

        if (!isValid) {
            const msg = embedUtils.simpleEmbedMSG(
                config.COLOR_RED_STRONG,
                `La licencia que tenías del servidor **${serverPreferred.name}** ha expirado\n\nSi tienes más servidores con licencias y quieres cambiar la que utilizas, puedes usar el comando **!license** para realizar este cambio.\n\nSi deseas continuar con el proceso de registro, utiliza **!register force**, de este modo podrías re-activar la licencia de tu servidor.`
            );
            message.author.send(msg);
            return false;
        }

        const serversAllowed = checkRole(client, message, true);

        return serversAllowed[serverPreferred.name] ? true : false;
    }
};
