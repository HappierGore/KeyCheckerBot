const changeLicense = require('../src/licenseManager/changeLicense.js');
const timingUtils = require('../src/Utils/timingUtils');
const embedUtils = require('../src/Utils/embedUtils');
const config = require('../configuration/config');

module.exports = async function (client, message, args) {
    if (args[0]) {
        changeLicense.final(client, message, args[0]);
        return;
    }

    changeLicense.changeLicense(client, message);
};
