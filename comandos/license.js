const changeLicense = require('../src/licenseManager/changeLicense.js');

module.exports = async function (client, message, args) {
    if (args[0]) {
        changeLicense.final(client, message, args[0]);
        return;
    }

    changeLicense.changeLicense(client, message);
};
