const checkRegistered = require('../src/keyChecker/checkRegistered');
const addRole = require('../src/rolesManager/addRole');
const embedUtils = require('../src/Utils/embedUtils');
const config = require('../configuration/config.js');
const delRole = require('../src/rolesManager/delRole');
const listRoles = require('../src/rolesManager/listRoles');

module.exports = function (client, message, args) {
    if (message.type === 'dm') {
        const msg = embedUtils.simpleEmbedMSG(
            config.COLOR_RED_STRONG,
            'Este comando debe ser ejecutado dentro del servidor que deseas configurar.'
        );
        message.author.send(msg);
        return;
    }

    //Revisar si el servidor en el que utiliza el comando está registrado

    const actualServer = message.guild;

    let registered = false;

    checkRegistered(client, message).forEach((server) => {
        if (server.id === actualServer.id) registered = true;
    });

    if (!registered) {
        const msg = embedUtils.simpleEmbedMSG(
            config.COLOR_RED_STRONG,
            `El servidor ${actualServer.name} no se encuentra registrado o no tiene una licencia válida. Por favor, utiliza **!register** para registrar una licencia.`
        );
        message.author.send(msg);
        return;
    }

    if (args[0] === 'add') {
        if (args[1]) {
            const rolesToAdd = args.slice(1);
            addRole(client, message, rolesToAdd);
            return;
        }
        const msg = embedUtils.simpleEmbedMSG(
            config.COLOR_BLUE_STRONG,
            'Para permitir que un rol utilice el bot, utiliza **!roles add** seguido de la **mención** de dicho rol.\n**Ejemplo**\n!roles add @SkinMaker.\n\nPara añadir **múltiples roles** a la vez, sólo deja **un espacio** entre cada mención.\n**Ejemplo**\n!roles add @Role1 @Role2 @Role3 ...'
        );
        message.channel.send(msg);
        return;
    }
    if (args[0] === 'remove') {
        if (args[1]) {
            const rolesToRemove = args.slice(1);
            delRole(client, message, rolesToRemove);
            return;
        }
    }
    listRoles(client, message, args);
};
