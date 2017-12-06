"use strict";

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

class API {
    static openFile(filePath) {
        console.log("Opening file: " + filePath);
        let xhr = new XMLHttpRequest();
        xhr.open('GET', "http://localhost:8000" + filePath, true);
        xhr.send();

        xhr.addEventListener("readystatechange", processRequest, false);

        function processRequest(e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                //let response = JSON.parse(xhr.responseText);
                console.log(xhr.responseText);
            }
        }
    }

    static closeFile(filePath) {
        console.log("Closing file: " + filePath);
    }

    static readFile(filePath) {
        console.log("Reading file: " + filePath);
    }

    static writeFile(filePath) {
        console.log("Writing to file: " + filePath);
    }
}

module.exports = API;