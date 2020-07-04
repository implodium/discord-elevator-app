FROM node:10
WORKDIR /usr/src/app/
CMD ["node", "./dist/index.js"]
COPY . .
RUN npm install