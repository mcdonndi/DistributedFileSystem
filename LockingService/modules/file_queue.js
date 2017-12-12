class FileQue{
    constructor(fileName) {
        this.name = fileName;
        this.queue = [];
    }

    addToQueue(clientAddress) {
        this.queue.push(clientAddress);
    }

    removeFromQueue(clientAddress) {
        if(this.queue[0] === clientAddress){
            this.queue.shift()
        }
    }

    getAndRemoveFirstInQueue() {
        return this.queue.shift();
    }
}

module.exports = FileQue;