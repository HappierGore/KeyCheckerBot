const generateKey = require('../src/keyChecker/generateKey.js');
module.exports = async function (client, message, args) {
    generateKey();
};
