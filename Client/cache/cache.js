const fs = require('fs');

class Cache {
    constructor() {
        this.files = [];
    }

    addFileToCache(filePath, fileText) {
        console.log(`Adding ${filePath} to cache`);
        this.files.push(filePath);
        let splitFilePath = filePath.split('/');
        console.log(splitFilePath);
        splitFilePath.pop();
        let dirPath = splitFilePath.join('/');
        console.log(dirPath);
        if (!fs.existsSync(`./cache/files/${dirPath}/`)){
            fs.mkdirSync(`./cache/files/${dirPath}/`);
            fs.writeFile(`./cache/files/${filePath}`, fileText, (err) => {
                if (err) throw err;
                console.log('The file has been saved to cache');
            });
        }
    }

    checkIfFileInCache(filePath){
        return this.files.includes(filePath);
    }
}

module.exports = Cache;