FROM node:10
WORKDIR /rest-api-express
COPY . /rest-api-express
RUN npm install
CMD npm start
EXPOSE 8080