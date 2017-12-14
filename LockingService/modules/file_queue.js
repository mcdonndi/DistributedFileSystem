class FileQueue{
    constructor(fileName) {
        this.name = fileName;
        this.queue = [];
    }

    addToQueue(clientAddress) {
        this.queue.push(clientAddress);
    }

    removeFirstInQueue() {
        this.queue.shift()
    }
}

module.exports = FileQueue;