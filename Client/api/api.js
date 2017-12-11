"use strict";

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

class API {
    static openFile(filePath) {
        console.log("Opening file: " + filePath);
        this._getFileLock(filePath, () => {
            this._getFileServerPort(filePath, (portNumber) => {
                let xhr = new XMLHttpRequest();
                xhr.open('GET', `http://localhost:${portNumber}/${filePath}`, true);
                xhr.send();

                xhr.addEventListener("readystatechange", processRequest, false);

                function processRequest(e) {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        console.log(xhr.responseText);
                    }
                }
            });
        });
    }

    static closeFile(filePath) {
        console.log("Closing file: " + filePath);
        this._returnFileLock(filePath);
    }

    static readFile(filePath) {
        console.log("Reading file: " + filePath);
    }

    static writeFile(filePath) {
        console.log("Writing to file: " + filePath);
    }

    static _getFileServerPort(filePath, cb) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', "http://localhost:8000/" + filePath, true);
        xhr.send();

        xhr.addEventListener("readystatechange", processRequest, false);

        function processRequest(e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log(`File server port number: ${xhr.responseText}`);
                cb(xhr.responseText);
            }
            else {
                cb(null);
            }
        }
    }

    static  _getFileLock(filePath, cb) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `http://localhost:8004/${filePath}`, true);
        xhr.send();

        xhr.addEventListener("readystatechange", processRequest, false);

        function processRequest(e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                cb();
            }
        }
    }

    static _returnFileLock(filePath) {
        let xhr = new XMLHttpRequest();
        xhr.open('PUT', `http://localhost:8004/${filePath}`, true);
        xhr.send();

        xhr.addEventListener("readystatechange", processRequest, false);

        function processRequest(e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
               console.log(`${filePath} returned`)
            }
        }
    }
}

module.exports = API;