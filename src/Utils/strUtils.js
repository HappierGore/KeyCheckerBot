/**
 * Convierte la primera letra de la palabra en mayúscula
 * @param {String} word Palabra a modificar
 * @returns La misma palabra pero con la primera letra en mayúsculas
 */
const firstUpperCase = function (word) {
    const first = word.slice(0, 1).toUpperCase();
    return first + word.slice(1);
};
const numberToEmoji = function (number) {
    const numberArr = number.toString().split('');
    const newNumber = numberArr
        .map((value) => {
            switch (+value) {
                case 0:
                    return ':zero:';
                case 1:
                    return ':one:';
                case 2:
                    return ':two:';
                case 3:
                    return ':three:';
                case 4:
                    return ':four:';
                case 5:
                    return ':five:';
                case 6:
                    return ':six:';
                case 7:
                    return ':seven:';
                case 8:
                    return ':eight:';
                case 9:
                    return ':nine:';
            }
        })
        .join('');
    return newNumber;
};

const formatTime = function (timeSeg) {
    // Minutes
    let seconds, minutes, hours, days, weeks;

    if (timeSeg > 60) {
        minutes = Math.floor(timeSeg / 60);
        seconds = timeSeg % 60;
        if (minutes > 60) {
            hours = Math.floor(minutes / 60);
            minutes = minutes % 60;
            if (hours > 24) {
                days = Math.floor(hours / 24);
                hours = hours % 24;
                if (days > 7) {
                    weeks = Math.floor(days / 7);
                    days = days % 7;
                }
            }
        }
    } else {
        seconds = timeSeg;
    }
    const weeksText = `${weeks ? `${weeks} semana` : ''}`;
    const daysText = `${days ? `${days} día` : ''}`;
    const hoursText = `${hours ? `${hours} hora` : ''}`;
    const minutesText = `${minutes ? `${minutes} minuto` : ''}`;
    const secondsText = `${seconds ? `${seconds} segundo` : ''}`;
    const texts = [weeksText, daysText, hoursText, minutesText, secondsText];

    const filteredTexts = texts.filter((txt) => txt);
    const newTexts = filteredTexts.map((txt, i) => {
        const nText = +txt.split(' ')[0] > 1 ? `${txt}s` : txt;
        if (txt && filteredTexts.length - 2 > i) return `${nText},`;
        if (filteredTexts.length - 1 === i) return `y ${nText}`;
        return nText;
    });
    return newTexts.join(' ').trim();
};
const findWord = function (word, wordsToFind, wordOmitted, separador = '_') {
    let found = false;
    const arr = wordOmitted
        ? word.slice(0, -wordOmitted.length).toLowerCase().split(separador)
        : word.toLowerCase().split(separador);
    for (let i = 0; i < arr.length; i++) {
        if (found) break;
        for (let j = 0; j < wordsToFind.length; j++) {
            if (arr[i] === wordsToFind[j].toLowerCase()) {
                found = true;
                break;
            }
        }
    }
    return found;
};
const replaceAll = function (string, word, replacement) {
    const result = string.split('').map((w) => {
        if (w === word) return replacement;
        return w;
    });
    return result.join('');
};

module.exports = {
    firstUpperCase,
    numberToEmoji,
    formatTime,
    findWord,
    replaceAll,
};
