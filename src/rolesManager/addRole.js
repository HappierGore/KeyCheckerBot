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

    rolesObj.forEach((r) => dataToSave.push(r.id));

    const dataFiltered = new Set(dataToSave);

    saveData.serverPreferences(actualServer.id, [...dataFiltered]);

    const rolesNames = [];

    [...dataFiltered].forEach((roleID, i) => {
        const role = actualServer.roles.cache.get(roleID);
        rolesNames.push(`${strUtils.numberToEmoji(i + 1)} ${role.name}`);
    });

    const msg = embedUtils
        .simpleEmbedMSG(
            config.COLOR_GREEN_STRONG,
            'Se han actualizado correctamente los roles que tienen acceso al bot.'
        )
        .setTitle('Operación exitosa')
        .addField('Roles con acceso', rolesNames.join('\n\n'));
    message.channel.send(msg);
};
