const validateUser = require('../src/validation/validateUser');

module.exports = function (client, message, args) {
    if (validateUser(client, message)) {
        // Do something if the user...
        // 1. Is in a server with a valid key (Non expired, registered).
        // 2. The license selected is valid (Non expired, registered).
        // 3. Has roles (pre-defined for the server's owner).
    }
};
