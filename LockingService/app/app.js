const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const LockingService = require('../modules/locking_service');
// you can pass the parameter in the command line. e.g. node static_server.js 3000
const port = process.argv[2] || 8004;

let ls = new LockingService();

http.createServer(function (req, res) {
    console.log(`${req.method} ${req.url}`);
    // parse URL
    const parsedUrl = url.parse(req.url);
    // extract URL path
    let pathname = `.${parsedUrl.pathname}`;

    if (req.method === "GET") {
        ls.tryLock(req.connection.remotePort, pathname);
        ls.waitForKey(req.connection.remotePort, pathname, () => {
            res.setHeader('Content-type', 'text/plain');
            res.end(`File key granted for ${pathname}`);
        });
    } else if (req.method === "PUT") {
        ls.unlock(req.connection.remotePort, pathname, () => {
            console.log(`${pathname} unlocked`)
        })
    }
}).listen(parseInt(port));
console.log(`Server listening on port ${port}`);