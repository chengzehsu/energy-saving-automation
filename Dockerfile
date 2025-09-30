FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

RUN npx playwright install chromium
RUN apk add --no-cache chromium

COPY . .

ENV PLAYWRIGHT_BROWSERS_PATH=/usr/bin

CMD ["npm", "start"]