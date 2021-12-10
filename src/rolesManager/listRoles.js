const embedUtils = require('../Utils/embedUtils');
const strUtils = require('../Utils/strUtils');
const config = require('../../configuration/config');
const saveData = require('../dataBase/saveData');
const getData = require('../dataBase/getData');

module.exports = function (client, message, args) {
    const actualServer = message.guild;

    const previousData = getData.serverPreferences(actualServer.id);

    if (!previousData || JSON.parse(previousData.rolesAllowed).length === 0) {
        const errMsg = embedUtils.simpleEmbedMSG(
            config.COLOR_ORANGE_STRONG,
            'No hay roles con acceso al bot. Si deseas añadir roles, utiliza **!roles add**'
        );
        message.channel.send(errMsg);
        return;
    }

    const data = JSON.parse(previousData.rolesAllowed);

    const rolesNames = [];

    data.forEach((roleID, i) => {
        const role = actualServer.roles.cache.get(roleID);
        rolesNames.push(`${strUtils.numberToEmoji(i + 1)} ${role.name}`);
    });

    const msg = embedUtils
        .simpleEmbedMSG(
            config.COLOR_BLUE_STRONG,
            `Aquí tienes una lista de los roles quiénes tienen acceso al bot **(${
                data.length + 1
            })**`
        )
        .setTitle('Roles con acceso')
        .addFields(
            {
                name: 'Roles con acceso',
                value: rolesNames.join('\n\n'),
            },
            {
                name: 'Comandos',
                value: 'Si deseas añadir o remover roles, utiliza **!roles add** ó **roles remove** respectivamente.',
            }
        );
    message.channel.send(msg);
};
