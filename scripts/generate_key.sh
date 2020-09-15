ssh-keygen -t rsa -b 4096 -m PEM -f ./keys/jwtRS256.key -N ''
openssl rsa -in jwtRS256.key -pubout -outform PEM -out ./keys/jwtRS256.key.pub