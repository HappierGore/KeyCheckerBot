const checkRegistered = require('../keyChecker/checkRegistered');
const embedUtils = require('../utils/embedUtils');
const config = require('../../configuration/config.js');
const timingUtils = require('../utils/timingUtils');
const saveData = require('../dataBase/saveData');
const getData = require('../dataBase/getData');

const final = function (client, message, serverID) {
    const server = client.guilds.cache.get(serverID);
    if (!server) {
        console.log('Server not found');
        const msg = embedUtils.simpleEmbedMSG(
            config.COLOR_RED_STRONG,
            `La ID del servidor que especificaste **(${serverID})** no existe.\n Por favor, **copia** la ID del servidor de quien deseas utilizar su licencia, y luego, escribe **!license** acompañado de la ID del servidor.\n**Ejemplo:**\n!license 123456789101112'`
        );

        message.author.send(msg);
        return;
    }
    saveData.userPreferences(message.author.id, serverID);

    const keyObj = JSON.parse(getData.keyData(server.id).Data);

    const claimedDate = new Date(keyObj.claimedDate);

    const expireTime = new Date(keyObj.claimedDate);

    expireTime.setDate(claimedDate.getDate() + keyObj.lifetime);

    const msg = embedUtils
        .simpleEmbedMSG(
            config.COLOR_GREEN_STRONG,
            `Ahora estás utilizando la licencia de **${server.name}**`
        )
        .setTitle('Licencia cambiada con éxito')
        .addFields(
            { name: 'ID del servidor', value: server.id, inline: true },
            {
                name: 'Expira el',
                value: expireTime.toLocaleDateString(),
                inline: true,
            }
        );
    message.author.send(msg);
    // FIXME Cambiar "algún día" con valor real
};

const instructions = function (message) {
    const msg = embedUtils.simpleEmbedMSG(
        config.COLOR_YELLOW_STRONG,
        'Se te han listado los servidores en los que tú y el bot **tienen en común** y donde estos tengan una **licencia activa**. Por favor, **copia** la ID del servidor de quién deseas utilizar su licencia, y luego, escribe **!license** acompañado de la ID del servidor\n**Ejemplo:**\n!license 12345678910'
    );
    message.author.send(msg);
};

const changeLicense = async function (client, message) {
    const licensedBy = checkRegistered(client, message);

    if (licensedBy.length < 1) {
        const msg = embedUtils
            .simpleEmbedMSG(
                config.COLOR_RED_STRONG,
                'No hay servidores con licencias válidas o vigentes. Para registrar una licencia utiliza **!register**'
            )
            .setTitle('No se encontraron servidores registrados');
        message.author.send(msg);
    }

    for (const [i, server] of licensedBy.entries()) {
        const icon = server.iconURL();

        const keyObj = JSON.parse(getData.keyData(server.id).Data);

        const expireTime = new Date(keyObj.claimedDate);

        expireTime.setDate(new Date().getDate() + keyObj.lifetime);

        const toFields = {
            ID: server.id,
            'Miembros totales': server.memberCount,
            'Valido hasta': expireTime.toLocaleDateString(),
        };
        const msg = embedUtils
            .simpleEmbedMSG(config.COLOR_BLUE_STRONG, '')
            .setTitle(server.name)
            .addFields(embedUtils.createFields(toFields))
            .setThumbnail(icon);

        await timingUtils.wait(0.8);

        message.author.send(msg);

        if (i + 1 === licensedBy.length) {
            await timingUtils.wait(1);
            instructions(message);
        }
    }
};

module.exports = {
    changeLicense,
    final,
};
