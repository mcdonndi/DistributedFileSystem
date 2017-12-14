const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const LockingService = require('../modules/locking_service');
// you can pass the parameter in the command line. e.g. node static_server.js 3000
const port = process.argv[2] || 8004;
let clientIdNo = 100000;

let ls = new LockingService();

http.createServer(function (req, res) {
    console.log(`${req.method} ${req.url}`);
    // parse URL
    const parsedUrl = url.parse(req.url);
    // extract URL path
    let pathname = `.${parsedUrl.pathname}`;

    let clientIdCookie = getClientIdCookie(req);

    if (req.method === "GET") {
        ls.tryLock(clientIdCookie || clientIdNo.toString(), pathname);
        ls.tryGetKey(clientIdCookie || clientIdNo.toString(), pathname, (keyGranted) => {
            res.setHeader('Content-type', 'text/plain');
            if (!clientIdCookie) {
                res.setHeader('Set-Cookie', [`id=${clientIdNo}`]);
                clientIdNo++;
            } else {
                res.setHeader('Set-Cookie', [`id=${clientIdCookie}`]);
            }
            if (keyGranted) {
                res.end(`File key granted for ${pathname}`);
            } else {
                res.end(`File locked by another client`);
            }
        });
    } else if (req.method === "PUT") {
        ls.unlock(clientIdCookie || clientIdNo.toString(), pathname, () => {
            console.log(`${pathname} unlocked`)
        })
    }
}).listen(parseInt(port));
console.log(`Server listening on port ${port}`);

getClientIdCookie = (req) => {
    let cookieHeader = req.headers['set-cookie'];
    let idCookie = null;
    if (cookieHeader) {
        cookieHeader.forEach((cookie) => {
            if (cookie.includes('id')) {
                idCookie = cookie.split('=')[1];
            }
        });
    }
    return idCookie
};