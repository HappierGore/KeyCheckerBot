const request = require('request');
const filesUtils = require('../utils/filesUtils.js');

/**
 * Generates a new key
 * @param {Number} size The size of the key generated
 */
module.exports = function (size = 20) {
    request(
        `https://random.justyy.workers.dev/api/random/?cached&n=${size}`,
        (err, res, body) => {
            if (err) throw err;

            // Path
            const pathOfJson = `${filesUtils.removeDirFromPath(
                __dirname,
                2
            )}/keys/`;

            const fileName = 'SerialKeys';

            // Convert to string the data.
            const key = JSON.parse(body);

            const objArr = filesUtils.getJSON(pathOfJson, fileName) || [];

            // Structure of key OBJ
            const obj = {
                key,
                used: false,
                claimedBy: 'available',
                claimedDate: 'available',
                lifetime: 15,
            };

            objArr.push(obj);

            // Generate JSON
            filesUtils.createJSON(objArr, pathOfJson, fileName, (err) => {
                if (err)
                    console.error(
                        'Some error occurred while creation of JSON file\n',
                        err
                    );
            });
        }
    );
};
