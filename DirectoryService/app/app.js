const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
// you can pass the parameter in the command line. e.g. node static_server.js 3000
const port = process.argv[2] || 8000;
http.createServer(function (req, res) {
    console.log(`${req.method} ${req.url}`);
    // parse URL
    const parsedUrl = url.parse(req.url);
    // extract URL path
    let pathname = `.${parsedUrl.pathname}`;
    let rootDir = pathname.split("/")[1];
    switch (rootDir){
        case "Files":
            console.log("Sending address for File Server: Files");
            res.setHeader('Content-type', 'text/plain' );
            res.end("8001");
            break;
        case "src":
            console.log("Sending address for File Server: src");
            res.setHeader('Content-type', 'text/plain' );
            res.end("8002");
            break;
        case "Files2":
            console.log("Sending address for File Server: Files2");
            res.setHeader('Content-type', 'text/plain' );
            res.end("8003");
            break;
        default:
            console.log("Sending 404 Response");
            res.statusCode = 404;
            res.end(`File ${rootDir} not found!`);
    }

}).listen(parseInt(port));
console.log(`Server listening on port ${port}`);