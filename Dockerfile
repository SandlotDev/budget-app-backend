FROM node:12

RUN mkdir -p /home/budgetApp

WORKDIR /home/budgetApp

COPY ./src ./src
COPY ./.scripts ./.scripts
COPY ./package.json .
COPY  ./package-lock.json .

EXPOSE 3000

RUN npm install
RUN ls

CMD [ "npm", "start" ]
