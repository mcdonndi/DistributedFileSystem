const readline = require('readline');
const API = require("../api/api.js");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.setPrompt('Hello. What would you like to do?\n1) Open file\n2) Close file\n3) Read file\n4) Write to file\n');
rl.prompt();

rl.on('line', (choice) => {
    switch (choice) {
        case "1":
            console.log("Option 1 selected");
            getFilePath((filePath) => {
                API.openFile(filePath);
            });
            break;
        case "2":
            console.log("Option 2 selected");
            getFilePath((filePath) => {
                API.closeFile(filePath);
            });
            break;
        case "3":
            console.log("Option 3 selected");
            getFilePath((filePath) => {
                API.readFile(filePath);
            });
            break;
        case "4":
            console.log("Option 4 selected");
            getFilePath((filePath) => {
                API.writeFile(filePath);
            });
            break;
        case "quit":
            rl.close();
            break;
        default:
            console.log("Invalid selection!");
    }
    rl.prompt();
}).on('close', () => {
    console.log('Have a great day!');
    process.exit(0);
});

getFilePath = (cb) => {
    rl.question('Please enter file path: ', (fPath) => {
        cb(fPath);
    });
};