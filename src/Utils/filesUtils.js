const request = require('request');
const fs = require('fs');
const path = require('path');
const strUtils = require('./strUtils');

/**
 *  Download a file from URL to some path
 * @param {String} url URL
 * @param {String} filename File name
 * @param {String} path Folder Path where file downloaded will be saved, path must end with /
 * @param {Function} callback What to execute after done
 */
const download = function (url, filename, path, callback) {
    const fixedPath = strUtils.replaceAll(path, '\\', '/');
    request.head(url, function (err, res, body) {
        if (err) throw err;
        request(url).pipe(
            fs
                .createWriteStream(`${fixedPath}/${filename}`)
                .on('close', callback)
        );
    });
};

const deletePath = function (path) {
    const fixedPath = strUtils.replaceAll(path, '\\', '/');
    try {
        fs.rmdirSync(
            fixedPath.endsWith('/') ? fixedPath.slice(0, -1) : fixedPath,
            {
                recursive: true,
            }
        );
    } catch (err) {
        console.error(err);
    }
};

/**
 *  Go back from a path
 * @param {String} pathTo Path to execute the "back" action
 * @param {Number} numberOfDirs Number of directories to back.
 * @returns {String} Path returned
 */
const removeDirFromPath = (pathTo, numberOfDirs) => {
    const fixedPath = strUtils.replaceAll(pathTo, '\\', '/');
    const newPath = fixedPath.split('/').slice(0, -numberOfDirs).join('/');
    return newPath;
};

/**
 * Create a JSON file in some path
 * @param {Object} obj Object to transform to JSON
 * @param {String} path Folder Path where JSON will be saved, path must end with /
 * @param {String} fileName Name of the JSON file, don't include .json
 * @param {Function} callback What to execute after done, recibies (error) as parameter
 */
const createJSON = function (obj, path, fileName, callback) {
    const jsonObj = JSON.stringify(obj);
    const exists = fs.existsSync(path);
    if (!exists) {
        fs.mkdirSync(path);
    }
    fs.writeFile(`${path}${fileName}.json`, jsonObj, (error) => {
        callback(error);
    });
    if (!exists)
        console.warn(`A JSON file (${fileName}) has been created at ${path}`);
    else console.warn(`A JSON file (${fileName}) has been updated at ${path}`);
};

/**
 * Get data from JSON file
 * @param {String} path Path of the json file, must ends with /
 * @param {String} fileName Name of the file, don't include .json
 * @returns {Object} JSON data
 */
const getJSON = function (path, fileName) {
    if (fs.existsSync(`${path}${fileName}.json`)) {
        const file = fs.readFileSync(`${path}${fileName}.json`);
        const jsonData = JSON.parse(file);
        return jsonData;
    }
};

module.exports = {
    download,
    removeDirFromPath,
    deletePath,
    createJSON,
    getJSON,
};
