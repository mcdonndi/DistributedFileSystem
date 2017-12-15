#!/usr/bin/env bash

#Directory Service
cd DirectoryService/
npm install
cd ..

#Locking Serivce
cd LockingService/
npm install
cd ..

#File Servers
cd FileServer/
npm install
cd ..

cd FileServer2/
npm install
cd ..

cd FileServer3/
npm install
cd ..

#Client Application
cd Client/
npm install