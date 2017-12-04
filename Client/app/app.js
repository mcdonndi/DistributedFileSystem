const readline = require('readline');
const API = require("../api/api.js");

//let api = new API();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Hello. What would you like to do?\n1) Open file\n2) Close file\n3) Read file\n4) Write to file\n', (choice) => {
    switch(choice){
        case "1":
            console.log("Option 1 selected");
            getFilePath(rl, (filePath) =>{
                API.openFile(filePath);
            });
            break;
        case "2":
            console.log("Option 2 selected");
            getFilePath(rl, (filePath) => {
                API.closeFile(filePath);
            });
            break;
        case "3":
            console.log("Option 3 selected");
            getFilePath(rl, (filePath) => {
                API.readFile(filePath);
            });
            break;
        case "4":
            console.log("Option 4 selected");
            getFilePath(rl, (filePath) => {
                API.writeFile(filePath);
            });
            break;
        default:
            console.log("Invalid selection!");
            rl.close();
    }
});

getFilePath = (rl, cb) => {
    rl.question('Please enter file path: ', (fPath) => {
        cb(fPath);
        rl.close();
    });
};