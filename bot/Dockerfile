FROM node:latest
RUN mkdir -p /app
WORKDIR /app
COPY package.json /app/
RUN npm install \
 && npm install -g nodemon \
 && npm ls \
 && npm cache clean --force \
 && mv /app/node_modules /node_modules
COPY . /app
EXPOSE 3000
CMD [ "node", "index.js"]