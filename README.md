# DistributedFileSystem
This is a Distributed File System for the CS7NS1-Scalable Computing module in Trinity College Dublin. There are 4 main components in this DFS. They are:
1. Client Application
2. File Server
3. Directory Service
4. Locking Service

## Client Application
This application allows the user to read files that are stored on the File Server. The enters the file path and the contents of the file is then displayed on the console. The application also saves a copy of this file in its cache. An API is used to request data from different service. These include:
- The Locking Service
- The Directory Service
- The File Server

## File Server
The file server holds all the files on its machine. It listens for requests and then gets the requested file and returns a respons containing the file contents in plain text. The file system is a flat file system so there is a number of servers each with a different top level directory name.

## Directory Service
As this system is a flat system, the directory service takes in the file path from the client and parses it for the top level folder. Using this filder name it then sends a response to the client with the corresponding address of the deired file system.

## Locking Service
When a client wishes to make changes to a file they first make a request to the locking service in order to prevent any other clients from making changes to the file at the same time. The locking service loxks the file and then keeps a queue of all the clients that wish to make changes to the file during this time. Once the original client is finished with the file, the next client in the queue for that file is granted access to the file.
While a client is waiting in the queue, it polls. It makes a requet every 5 seconds until access is granted to the file by the locking service.
