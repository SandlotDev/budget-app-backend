#!/bin/bash

if [ "${NODE_ENV}" = "production" ]; then 
    node ./src/server.js
else
    npm install -g nodemon
    npm install -g env-cmd
    npm run keys:generate
    npm run dev:kill && nodemon src/server.js
fi
