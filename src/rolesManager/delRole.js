const embedUtils = require('../Utils/embedUtils');
const strUtils = require('../Utils/strUtils');
const config = require('../../configuration/config');
const saveData = require('../dataBase/saveData');
const getData = require('../dataBase/getData');

const convertRole = (roleMention) => roleMention.slice(3, -1);

module.exports = function (client, message, roles) {
    if (
        !message.guild.members.cache
            .get(message.author.id)
            .hasPermission('MANAGE_GUILD')
    ) {
        const msg = embedUtils.simpleEmbedMSG(
            config.COLOR_RED_STRONG,
            'No tienes el permiso necesario **(MANAGE_GUILD)** para realizar esta configuración.\nSi no sabes qué permiso es, éste permite añadir bots al servidor.'
        );
        message.channel.send(msg);
        return;
    }

    const actualServer = message.guild;

    // Logic starts here
    const rolesObj = roles
        .map((r) => {
            const rFound = actualServer.roles.cache.get(convertRole(r));
            if (rFound) return rFound;
            return;
        })
        .filter((r) => r);

    if (!rolesObj.length > 0) {
        const msg = embedUtils.simpleEmbedMSG(
            config.COLOR_RED_STRONG,
            'Parece ser que no ingresaste ningún rol válido. Asegúrate de mencionarlos utilizando **@roleName**'
        );
        message.channel.send(msg);
        return;
    }

    const previousData = getData.serverPreferences(actualServer.id);

    const dataToSave = previousData
        ? JSON.parse(previousData.rolesAllowed)
        : [];

    const newData = new Map();

    let erasedData = 0;

    dataToSave.forEach((r) => {
        newData.set(r, true);
    });

    rolesObj.forEach((r) => {
        if (newData.get(r.id)) {
            newData.delete(r.id);
            erasedData++;
        }
    });

    const dataToDB = [];

    [...newData.keys()].forEach((r) => {
        dataToDB.push(r);
    });

    saveData.serverPreferences(actualServer.id, dataToDB);

    const rolesNames = [];

    dataToDB.forEach((roleID, i) => {
        const role = actualServer.roles.cache.get(roleID);
        rolesNames.push(`${strUtils.numberToEmoji(i + 1)} ${role.name}`);
    });

    if (rolesNames.length < 1) {
        const errMsg = embedUtils.simpleEmbedMSG(
            config.COLOR_ORANGE_STRONG,
            'No hay roles con acceso al bot. Si deseas añadir roles, utiliza **!roles add**'
        );
        message.channel.send(errMsg);
        return;
    }

    const msg = embedUtils
        .simpleEmbedMSG(
            config.COLOR_ORANGE_STRONG,
            `Se ha${erasedData > 1 ? 'n' : ''} removido **${erasedData} rol${
                erasedData > 1 ? 'es' : ''
            }** con acceso al bot.`
        )
        .setTitle('Operación exitosa')
        .addField('Roles con acceso', rolesNames.join('\n\n'));
    message.channel.send(msg);
};
