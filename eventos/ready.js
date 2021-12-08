module.exports = async (client) => {
    client.user.setPresence({
        status: 'online',
        activity: {
            name: '¡Esperando órdenes!',
            type: 'PLAYING',
        },
    });
};
