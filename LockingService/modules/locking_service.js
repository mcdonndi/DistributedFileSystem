const FileQueue = require('./file_queue');

class LockingService {
    constructor() {
        this.lockedFiles = [];
        this.fileQueues = [];
    }

    tryLock(clientAddress, filePath){
        console.log(`Client ${clientAddress} attempting to lock file ${filePath}`);
        if (this.checkForFileQueues(filePath)){
            let fq = this.getFileQueue(filePath);
            fq.addToQueue(clientAddress);
        } else if (this.checkFileLocked(filePath)){
            this.createFileQueue(clientAddress, filePath);
        } else {
            this.addToLockedFiles(filePath);
        }
    }

    waitForKey(clientAddress, filePath, cb){
        if (this.checkForFileQueues()) {
            while (this.clientInQueue(clientAddress, filePath)) {
                //Do nothing
            }
        }
        cb()
    }

    unlock(clientAddress, filePath, cb){
        if (this.checkForFileQueues(filePath)){
            console.log(`Client ${clientAddress} unlocking file ${filePath}`);
            let fq = this.getFileQueue(filePath);
            fq.removeFromQueue(clientAddress);
            if (fq.length === 0){
                this.removeFileQueue(filePath);
            }
        }
        cb();
    }

    addToLockedFiles(filePath){
        console.log(`Adding ${filePath} to locked files list`);
        this.lockedFiles.push(filePath);

    }

    checkForFileQueues(filePath){
        this.fileQueues.forEach((value) => {
            if (value.name === filePath){
                return true;
            }
        });
        return false;
    }

    getFileQueue(filePath){
        this.fileQueues.forEach((value) => {
            if (value.name === filePath){
                return value;
            }
        });
    }

    createFileQueue(clientAddress, filePath){
        let fq = new FileQueue(filePath);
        fq.addToQueue(clientAddress);
        this.addFileQueue(fq);
    }

    addFileQueue(fq){
        this.fileQueues.push(fq);
    }

    removeFileQueue(filePath){
        let fq = this.getFileQueue(filePath);
        let i = this.fileQueues.indexOf(fq);
        this.fileQueues.splice(i, 1);
    }

    checkFileLocked(filePath){
        this.lockedFiles.forEach((value) => {
            if (value === filePath){
                return true;
            }
        });
        return false;
    }

    clientInQueue(clientAddress, filePath){
        let fq = this.getFileQueue(filePath);
        fq.que.forEach((value) => {
            if (value === clientAddress){
                return true;
            }
        });
        return false;
    }
}

module.exports = LockingService;