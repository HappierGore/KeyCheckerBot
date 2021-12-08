const embedUtils = require('../Utils/embedUtils.js');
const config = require('../../configuration/config');
const timingUtils = require('../Utils/timingUtils.js');
const saveData = require('../dataBase/saveData');
const getData = require('../dataBase/getData');
const filesUtils = require('../Utils/filesUtils.js');

const instructions = function (message) {
    const msg = embedUtils.simpleEmbedMSG(
        config.COLOR_YELLOW_STRONG,
        'Se te han listado los servidores en los que tú, y el bot, **tienen en común** y donde tienes el **permiso** para añadir bots **(Group Manager)**. Por favor, **copia** la ID del servidor al que deseas añadir tu nueva licencia, y luego, escribe **!register** acompañado de la ID del servidor.\n**Ejemplo:**\n!register 123456789101112'
    );
    message.author.send(msg);
};

const finalAction = function (client, message, serverID) {
    const server = client.guilds.cache.get(serverID);
    if (!server) {
        console.log('Server not found');
        const msg = embedUtils.simpleEmbedMSG(
            config.COLOR_RED_STRONG,
            `La ID del servidor que especificaste **(${serverID})** no existe.\n Por favor, **copia** la ID del servidor al que deseas añadir tu nueva licencia, y luego, escribe **!register** acompañado de la ID del servidor.\n**Ejemplo:**\n!register 123456789101112'`
        );

        message.author.send(msg);
        return;
    }
    const key = client.registerProgress.get(message.author.id);
    console.log(
        `The server ${server.name} has been registered with the key ${key.key} by ${message.author.username}`
    );
    saveData.keyData(server, message, key);

    const pathOfJson = `${filesUtils.removeDirFromPath(__dirname, 2)}/keys/`;

    const fileName = 'SerialKeys';

    const keysJSON = filesUtils.getJSON(pathOfJson, fileName);

    keysJSON.forEach((k) => {
        if (k.key === key.key) {
            k.used = true;
            k.claimedBy = server.id;
            k.claimedDate = new Date().getTime();
        }
    });

    filesUtils.createJSON(keysJSON, pathOfJson, fileName, (err) => {
        if (err)
            console.error(
                'Some error occurred while creation of JSON file\n',
                err
            );
    });

    const claimedDate = new Date();

    const expireTime = new Date();

    expireTime.setDate(claimedDate.getDate() + key.lifetime);

    const msg = embedUtils
        .simpleEmbedMSG(
            config.COLOR_GREEN_STRONG,
            `¡La llave **${key.key}** ha sido canjeada para el servidor **${server.name}**!\n**¡Muchas gracias por el apoyo, que lo disfrutes!**`
        )
        .setTitle('Llave activada con éxito')
        .addFields(
            { name: 'ID del servidor', value: server.id, inline: true },
            { name: 'Días de licencia', value: key.lifetime, inline: true },
            { name: 'Expira', value: expireTime.toLocaleDateString() }
        );
    // FIXME Arreglar "Tiempo de expiración"
    message.author.send(msg);

    client.registerProgress.delete(message.author.id);
    client.registerMode.delete(message.author.id);
    return;
};

const register = async function (client, message) {
    const serversData = [];

    let commonServers = 0;

    client.guilds.cache.forEach((server) => {
        const serverUser = server.members.cache.get(message.author.id) || false;
        if (serverUser) {
            if (serverUser.hasPermission(['MANAGE_GUILD'])) {
                serversData.push(server);
            }
            commonServers++;
        }
    });

    if (commonServers > 0 && serversData.length === 0) {
        const msg = embedUtils.simpleEmbedMSG(
            config.COLOR_RED_STRONG,
            `Tienes **${commonServers} servidor${
                commonServers > 1 ? 'es' : ''
            }** en común con el bot, pero en ninguno de ellos tienes permisos para añadir bots **(Manage Group)**. Sin este permiso, no puedes añadir licencias.`
        );
        message.author.send(msg);
        client.registerProgress.delete(message.author.id);
        return;
    }

    for (const [i, server] of serversData.entries()) {
        const icon = server.iconURL();

        const toFields = {
            ID: server.id,
            'Miembros totales': server.memberCount,
        };

        const dataObj = getData.keyData(server.id);

        if (dataObj) {
            const keyObj = JSON.parse(dataObj.Data);

            const now = new Date();

            const expireTime = new Date(keyObj.claimedDate);

            expireTime.setDate(new Date().getDate() + keyObj.lifetime);

            if (expireTime.getTime() > now.getTime())
                toFields['Tiene una licencia y expira el'] =
                    expireTime.toLocaleDateString();
            else
                toFields['Tiene una licencia expirada'] =
                    expireTime.toLocaleDateString();
        } else {
            toFields['No registrado'] = 'Aún no cuenta con una licencia.';
        }

        const msg = embedUtils
            .simpleEmbedMSG(config.COLOR_BLUE_STRONG, '')
            .setTitle(server.name)
            .addFields(embedUtils.createFields(toFields))
            .setThumbnail(icon);

        await timingUtils.wait(0.8);

        message.author.send(msg);

        if (i + 1 === serversData.length) {
            await timingUtils.wait(1);
            instructions(message);
        }
    }
};
module.exports = {
    register,
    finalAction,
};
