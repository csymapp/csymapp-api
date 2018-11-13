#!/bin/bash


killall familyfe-challenge.update.sh
./familyfe-challenge.update.sh &

npm install
node bin/app.js
