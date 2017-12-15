const fs = require('fs');

class Cache {
    constructor() {
        this.files = [];
    }

    addFileToCache(filePath, fileText, cb) {
        console.log(`Adding ${filePath} to cache`);
        this.files.push(filePath);
        let splitFilePath = filePath.split('/');
        splitFilePath.pop();
        let dirPath = splitFilePath.join('/');
        this.createDirectory(dirPath, () => {
            fs.writeFile(`./cache/files/${filePath}`, fileText, (err) => {
                if (err) throw err;
                console.log('The file has been saved to cache');
            });
            cb();
        });
    }

    checkIfFileInCache(filePath){
        return this.files.includes(filePath);
    }

    createDirectory(dirPath, cb){
        if (!fs.existsSync(`./cache/files/${dirPath}/`)){
            fs.mkdirSync(`./cache/files/${dirPath}/`);
        }
        cb()
    }
}

module.exports = Cache;