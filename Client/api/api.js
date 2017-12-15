"use strict";

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const Cache = require("../cache/cache");

let cache = new Cache();

class API {
    constructor() {
        this.lockingServiceIdCookie = null;
    }

    static openFile(filePath, cb) {
        console.log("Opening file: " + filePath);
        this._getFileServerPort(filePath, (portNumber) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', `http://localhost:${portNumber}/${filePath}`, true);
            xhr.send();

            xhr.addEventListener("readystatechange", processRequest, false);

            function processRequest(e) {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    cache.addFileToCache(filePath, xhr.responseText, () => {
                        console.log(xhr.responseText);
                        cb();
                    });
                }
            }
        });
    }

    static closeFile(filePath,cb) {
        console.log("Closing file: " + filePath);
        cb();
    }

    static readWriteFile(rl, filePath, cb) {
        this._retrieveFileForReadWrite(filePath, (fileText, portNumber) => {
            this._EditFile(rl, fileText, (fileContents) => {
                this._writeToFileServer(fileContents, portNumber, filePath, () => {
                    this._returnFileLock(filePath);
                    cb();
                });
            });
        });
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

    static _retrieveFileForReadWrite(filePath, cb){
        console.log("Reading file: " + filePath);
        this._getFileLock(filePath, () => {
            this._getFileServerPort(filePath, (portNumber) => {
                let xhr = new XMLHttpRequest();
                xhr.open('GET', `http://localhost:${portNumber}/${filePath}`, true);
                xhr.send();

                xhr.addEventListener("readystatechange", processRequest, false);

                function processRequest(e) {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        console.log(xhr.responseText);
                        cb(xhr.responseText, portNumber);
                    }
                }
            });
        });
    }

    static _EditFile(rl, fileText, cb){
        rl.question('Would you like to:\n1) Change all contents of the file?\n2) Append to the end of the file?\n', (choice) => {
            switch (choice) {
                case "1":
                    this._changeFileContents(rl, (fileContents) => {
                        cb(fileContents);
                    });
                    break;
                case "2":
                    this._appendFile(rl, fileText, (fileContents) => {
                        cb(fileContents);
                    });
                    break;
            }
        })
    }

    static _changeFileContents(rl, cb){
        rl.question('Write the new file contents:\n', (fileContents) => {
            cb(fileContents);
        })
    }

    static _appendFile(rl, fileText, cb){
        rl.question('Write the new file contents:\n', (appendedText) => {
            let fileContents = fileText + appendedText;
            cb(fileContents);
        })
    }

    static _writeToFileServer(fileContents, portNumber, filePath, cb){
        console.log("Writing to File Server");
        let xhr = new XMLHttpRequest();
        xhr.open('PUT', `http://localhost:${portNumber}/${filePath}`, true);
        xhr.send(fileContents);

        xhr.addEventListener("readystatechange", processRequest, false);

        function processRequest(e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log(`${filePath} Updated in file server`);
                cb();
            }
        }
    }
}

module.exports = API;