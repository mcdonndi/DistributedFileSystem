"use strict";

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

class API {
    constructor() {
        this.lockingServiceIdCookie = null;
    }

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

    static _getFileLock(filePath, cb) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `http://localhost:8004/${filePath}`, true);
        if (this.lockingServiceIdCookie){xhr.setRequestHeader('Set-Cookie', `id=${this.lockingServiceIdCookie}`)}
        xhr.send();

        xhr.addEventListener("readystatechange", processRequest, false);

        function processRequest(e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log(xhr.responseText);
                if(!this.lockingServiceIdCookie){API._setLockingServiceIdCookie(xhr);}
                if (xhr.responseText === "File locked by another client") {
                    setTimeout(() => {
                        API._getFileLock(filePath, cb);
                    }, 5000);
                } else {
                    cb();
                }
            }
        }
    }

    static _returnFileLock(filePath) {
        let xhr = new XMLHttpRequest();
        xhr.open('PUT', `http://localhost:8004/${filePath}`, true);
        if (this.lockingServiceIdCookie){xhr.setRequestHeader('Set-Cookie', `id=${this.lockingServiceIdCookie}`)}
        xhr.send();

        xhr.addEventListener("readystatechange", processRequest, false);

        function processRequest(e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
               console.log(`${filePath} returned`)
            }
        }
    }

    static _setLockingServiceIdCookie(xhr) {
        let cookieHeader = xhr.getResponseHeader('Set-Cookie');
        let cookies = cookieHeader[0].split(';');
        cookies.forEach((cookie) =>{
            if (cookie.includes('id') && this.lockingServiceIdCookie !== null){
                this.lockingServiceIdCookie = cookie.split('=')[1];
            }
        });
    }
}

module.exports = API;