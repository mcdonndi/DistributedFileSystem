const FileQueue = require('./file_queue');

class LockingService {
    constructor() {
        this.lockedFiles = [];
        this.fileQueues = [];
    }

    tryLock(clientAddress, filePath) {
        console.log(`Client ${clientAddress} attempting to lock file ${filePath}`);
        this.checkFileLocked(filePath, (fileLocked) => {
            this.checkForFileQueues(filePath, (fileQueues) => {
                if (fileLocked && fileQueues) {
                    this.clientInQueue(clientAddress, filePath, (inQueue) => {
                        if(!inQueue) {
                            console.log(`Adding ${clientAddress} to fileQueue`);
                            this.getFileQueue(filePath, (fq) => {
                                fq.addToQueue(clientAddress);
                            });
                        }
                    });
                } else if (fileLocked && !fileQueues) {
                    console.log(`Creating file queue for ${filePath}`);
                    this.createFileQueue(clientAddress, filePath);
                } else if (!fileLocked && !fileQueues) {
                    this.addToLockedFiles(filePath);
                }
            });
        });
    }

    tryGetKey(clientAddress, filePath, cb) {
        this.checkForFileQueues(filePath, (fileQueues) => {
            let grantKey = false;
            if (fileQueues) {
                this.clientInQueue(clientAddress, filePath, (inQueue) => {
                    if (!inQueue) {
                        grantKey = true;
                    }
                });
            } else {
                grantKey = true;
            }
            cb(grantKey);
        });
    }

    unlock(clientAddress, filePath, cb){
        this.checkForFileQueues(filePath, (fileQueues) => {
            this.removeFromLockedFiles(filePath);
            if (fileQueues) {
                console.log(`Client ${clientAddress} unlocking file ${filePath}`);
                this.getFileQueue(filePath, (fq) => {
                    fq.removeFirstInQueue();
                    if (fq.queue.length === 0) {
                        this.removeFileQueue(filePath);
                    }
                });
            }
            cb();
        });
    }

    addToLockedFiles(filePath){
        console.log(`Adding ${filePath} to locked files list`);
        this.lockedFiles.push(filePath);

    }

    removeFromLockedFiles(filePath){
        console.log(`Removing ${filePath} from locked files list`);
        this.lockedFiles.shift(filePath);
    }

    checkForFileQueues(filePath, cb){
        let fileQueuesExist = false;
        this.fileQueues.forEach((value) => {
            if (value.name === filePath){
                fileQueuesExist = true;
            }
        });
        cb(fileQueuesExist);
    }

    getFileQueue(filePath, cb){
        this.fileQueues.forEach((value) => {
            if (value.name === filePath){
                cb(value);
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
        this.getFileQueue(filePath, (fq) => {
            let i = this.fileQueues.indexOf(fq);
            this.fileQueues.splice(i, 1);
        });
    }

    checkFileLocked(filePath, cb){
        let fileLocked = false;
        this.lockedFiles.forEach((value) => {
            if (value === filePath){
                fileLocked = true;
            }
        });
        cb(fileLocked);
    }

    clientInQueue(clientAddress, filePath, cb){
        this.getFileQueue(filePath, (fq) => {
            let clientQueing = false;
            fq.queue.forEach((value) => {
                if (value === clientAddress){
                    clientQueing = true;
                }
            });
            cb(clientQueing);
        });
    }
}

module.exports = LockingService;