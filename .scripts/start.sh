#!/bin/bash

if [ "${NODE_ENV}" = "production" ]; then 
    node ./src/server.js
elif [ "${NODE_ENV}" = "docker" ]; then 
    npm install -g nodemon
    npm install -g env-cmd
    npm run keys:generate
    nodemon src/server.js
else
    npm run dev:kill && nodemon src/server.js
fi
