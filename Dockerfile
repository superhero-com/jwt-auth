FROM node:lts

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN ./gen-keys.sh
RUN npm run build

EXPOSE 3000
CMD [ "npm", "run", "express:run" ]
