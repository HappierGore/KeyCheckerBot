const { MessageEmbed } = require('discord.js');
const strUtils = require('./strUtils.js');

const simpleEmbedMSG = (color, description, footer = '') =>
    new MessageEmbed()
        .setColor(color)
        .setDescription(description)
        .setFooter(
            `${footer}\n© Copyright 2021 Edgar Uriel Herrera Franco (HappierGore). All rights reserved.\nPatreon: https://www.patreon.com/user?u=65750721`
        );

/**
 * Creará un conjunto de objetos con el formato necesario para los fields de los mensajes Embed. {name 'someName', value: 'someValue'}
 * @param {Object} obj Datos en formato {Nombre: 'Pepe'}
 * @param {Boolean} line Los fields deberían estar en columnas?
 * @returns {Object} Información convertida en formato "Field" para mensajes embed
 */
const createFields = function (obj, line = false) {
    const objArr = Object.entries(obj);
    const newObj = objArr.map((el) => {
        return {
            name: `${strUtils.firstUpperCase(el[0])}`,
            value: el[1],
            inline: line,
        };
    });
    return newObj;
};

module.exports = {
    simpleEmbedMSG,
    createFields,
};
