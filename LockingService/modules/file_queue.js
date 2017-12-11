class FileQue{
    constructor(fileName) {
        this.name = fileName;
        this.que = [];
    }

    addToQueue(clientAddress) {
        this.que.push(clientAddress);
    }

    removeFromQueue(clientAddress) {
        if(this.que[0] === clientAddress){
            this.que.shift()
        }
    }

    getAndRemoveFirstInQueue() {
        return this.que.shift();
    }
}

module.exports = FileQue;