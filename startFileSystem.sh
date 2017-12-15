#!/usr/bin/env bash

#Start Directory Service
node DirectoryService/app/app.js &

#Start Locking Serivce
node LockingService/app/app.js &

#Start File Servers
node FileServer/app/app.js &

node FileServer2/app/app.js &

node FileServer3/app/app.js