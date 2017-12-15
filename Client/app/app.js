const readline = require('readline');
const API = require("../api/api.js");

const PROMPT = 'Hello. What would you like to do?\n1) Open file\n2) Close file\n3) Read and write to file\n\nType "quit" to quit\n\n';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.setPrompt(PROMPT);
rl.prompt();

rl.on('line', (choice) => {
    switch (choice) {
        case "1":
            console.log("Option 1 selected");
            getFilePath((filePath) => {
                API.openFile(filePath, () => {
                    repeatApplication(rl);
                });
            });
            break;
        case "2":
            console.log("Option 2 selected");
            getFilePath((filePath) => {
                API.closeFile(filePath, () => {
                    repeatApplication(rl);
                });
            });
            break;
        case "3":
            console.log("Option 3 selected");
            getFilePath((filePath) => {
                API.readWriteFile(rl, filePath, () => {
                    repeatApplication(rl);;
                });
            });
            break;
        case "quit":
            rl.close();
            break;
        default:
            console.log("Invalid selection!");
            rl.setPrompt(PROMPT);
            rl.prompt();
    }
}).on('close', () => {
    console.log('Have a great day!');
    process.exit(0);
});

getFilePath = (cb) => {
    rl.question('Please enter file path: ', (fPath) => {
        cb(fPath);
    });
};

repeatApplication = (rl) => {
    rl.question('\n\nWould you like to make another selection? (Y/N)', (answer) => {
        switch (answer) {
            case 'Y':
                rl.prompt();
                break;
            case 'N':
                rl.close();
                break;
            default:
                repeatApplication(rl);
        }
    });
};