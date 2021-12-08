const filesUtils = require('../Utils/filesUtils.js');
module.exports = function (client, message, key) {
    const pathOfJson = `${filesUtils.removeDirFromPath(__dirname, 2)}/keys/`;

    const fileName = 'SerialKeys';

    const keyData = filesUtils.getJSON(pathOfJson, fileName);

    let valid = false;

    // Structure Key
    // {
    //     "key": "2Pny0QU!1%K5881(PDz^",
    //     "used": false,
    //     "claimedBy": "available",
    //     "claimedDate": "available",
    //     "createdDate": "7/12/2021 11:29:24"
    // },

    let keyFoundData;
    keyData.forEach((k) => {
        if (k.key === key && !k.used) {
            keyFoundData = k;
            valid = true;
        }
    });

    if (valid) {
        client.registerProgress.set(message.author.id, keyFoundData);
    }

    return valid;
};
