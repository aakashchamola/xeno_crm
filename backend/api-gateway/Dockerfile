FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN apk add --no-cache bash
COPY . .

EXPOSE 8002

CMD ["node", "src/app.js"]