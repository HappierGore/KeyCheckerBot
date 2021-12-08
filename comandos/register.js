const validateKey = require('../src/keyChecker/validateKey');
const registerKey = require('../src/keyChecker/registerKey');
const embedUtils = require('../src/Utils/embedUtils.js');
const config = require('../configuration/config.js');
const filesUtils = require('../src/Utils/filesUtils.js');
const { MessageAttachment } = require('discord.js');
const checkRegistered = require('../src/keyChecker/checkRegistered');
const getData = require('../src/dataBase/getData');
const timingUtils = require('../src/Utils/timingUtils');

const resetProgress = function (client, message) {
    client.registerProgress.delete(message.author.id);
    client.registerMode.delete(message.author.id);
    const msg = embedUtils.simpleEmbedMSG(
        config.COLOR_ORANGE_STRONG,
        'El tiempo para registrar una llave ha expirado. Puedes volver a utilizar **!register** si así lo deseas.'
    );
    message.author.send(msg);
};

module.exports = async function (client, message, args) {
    if (args[0] === 'force') {
        client.registerMode.set(message.author.id, 'force');
    }

    if (client.registerMode.get(message.author.id) !== 'force') {
        const licensedBy = checkRegistered(client, message);
        if (licensedBy.length > 0) {
            const dbPreference = await getData.userPreferences(
                message.author.id
            );

            const serverPreferred =
                client.guilds.cache.get(dbPreference.ServerID) || licensedBy[0];

            const msg = embedUtils.simpleEmbedMSG(
                config.COLOR_GREEN_STRONG,
                `Ya cuentas con una licencia **activa** por parte del servidor **${serverPreferred.name}**\n\nSi tienes más servidores con licencias y quieres cambiar la que utilizas, puedes usar el comando **!license** para realizar este cambio.\n\nSi deseas continuar con el proceso de registro, utiliza **!register force**.`
            );
            message.author.send(msg);
            return;
        }
    }

    if (args[0] && args[0] !== 'force') {
        if (client.registerProgress.has(message.author.id)) {
            registerKey.finalAction(client, message, args[0]);
            return;
        }

        if (validateKey(client, message, args[0])) {
            registerKey.register(client, message, args[0]);
            timingUtils.wait(30).then(() => resetProgress(client, message));
            return;
        }

        const smallLogo = new MessageAttachment(
            `${filesUtils.removeDirFromPath(
                __dirname,
                1
            )}/localData/smallLogo_HappierGore.jpg`,
            'smallLogo.png'
        );

        const bigLogo = new MessageAttachment(
            `${filesUtils.removeDirFromPath(
                __dirname,
                1
            )}/localData/bigLogo_HappierGore.png`,
            'bigLogo.png'
        );

        const msg = embedUtils
            .simpleEmbedMSG(
                config.COLOR_RED_STRONG,
                'Si no recibiste una al suscribirte en Patreon, contacta al creador: **HappierGore#1197**.\nSi no tienes una, ¡Suscríbete en Patreon para recibirla!'
            )
            .setTitle('La licencia no existe o ya no es válida')
            .attachFiles([smallLogo, bigLogo])
            .setImage('attachment://bigLogo.png')
            .setThumbnail('attachment://smallLogo.png');

        message.author.send(msg);
        return;
    }

    const msg = embedUtils
        .simpleEmbedMSG(
            config.COLOR_YELLOW_STRONG,
            'Para registrar a tu servidor, utiliza **!register** seguido de la licencia que se te dió al momento de suscribirte a Patreon'
        )
        .setTitle('Registro de licencia para servidor');
    message.author.send(msg);
};
