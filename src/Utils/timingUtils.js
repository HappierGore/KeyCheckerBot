const wait = function (seconds) {
    return new Promise(function (resolve) {
        setTimeout(resolve, seconds * 1000);
    });
};
const checkCooldown = function (cooldowns, message, userDiscord, timeSeg) {
    const command = message.content.slice(1);
    const prefix = message.content[0];

    const commandInfo = {};

    const updateData = function (data) {
        data[command] = Date.now() + timeSeg * 1000;
    };

    if (!cooldowns.has(userDiscord.id)) {
        updateData(commandInfo);
        cooldowns.set(userDiscord.id, cloneDeep(commandInfo));
        return;
    }
    const cmdUserData = cooldowns.get(userDiscord.id);

    if (!cmdUserData[command]) {
        updateData(cmdUserData);
        return;
    }

    if (cmdUserData[command] > Date.now()) {
        const timeRemaining = Math.floor(
            (cmdUserData[command] - Date.now()) / 1000
        );
        throw new Error(
            `Has usado el comando **${prefix}${command}** recientemente, por favor, espera ${formatTime(
                timeRemaining
            )} antes de volver a utilizarlo 😊`
        );
    } else {
        updateData(cmdUserData);
    }
};
module.exports = {
    wait,
    checkCooldown,
};
