FROM node:20.19-alpine
RUN apk add --no-cache \
    build-base \
    python3 \
    bash
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
