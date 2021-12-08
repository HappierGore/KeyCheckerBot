const changeLicense = require('../src/licenseManager/changeLicense.js');
const timingUtils = require('../src/Utils/timingUtils');
const embedUtils = require('../src/Utils/embedUtils');
const config = require('../configuration/config');

const resetProgress = function (client, message) {
    client.registerProgress.delete(message.author.id);
    client.registerMode.delete(message.author.id);
    const msg = embedUtils.simpleEmbedMSG(
        config.COLOR_ORANGE_STRONG,
        'El tiempo para cambiar la licencia ha expirado. Puedes volver a utilizar **!license** si así lo deseas.'
    );
    message.author.send(msg);
};
module.exports = async function (client, message, args) {
    if (args[0]) {
        changeLicense.final(client, message, args[0]);
        return;
    }

    changeLicense.changeLicense(client, message);
    timingUtils.wait(30).then(() => resetProgress(client, message));
};
