const embedUtils = require('../src/Utils/embedUtils.js');
const config = require('../configuration/config');

module.exports = (client, message) => {
    // const date = new Date(); // Now
    // const future = new Date();
    // future.setDate(date.getDate() + 30);

    // const mil = date.getTime();

    // console.log(date.toLocaleDateString() + ' ' + date.getTime());
    // console.log(future.toLocaleDateString() + ' ' + future.getTime());
    // console.log(new Date(mil).toLocaleDateString());

    // console.log(date > future);

    if (message.author.bot) return;

    if (!message.content.startsWith(client.config.prefix)) return;

    // Definiendo los argumentos y comandos.
    const args = message.content
        .slice(client.config.prefix.length)
        .trim()
        .split(/ +/g);

    const command = args.shift().toLowerCase();

    // Manejando los eventos.
    const cmd = client.comandos.get(command); // Obtiene el comando de la colección client.commandos

    // Si no hay comandos, borrar mensaje y notificar inexistencia
    if (!cmd) {
        message.author.send(
            embedUtils.simpleEmbedMSG(
                config.COLOR_ERROR,
                `El comando **${
                    message.content.split(' ')[0]
                }** no existe, utiliza **!help** para ver todos los comandos disponibles`
            )
        );
        return;
    }

    if (cmd)
        // Ejecuta el comando enviando el client, el mensaje y los argumentos.
        cmd(client, message, args);
};
