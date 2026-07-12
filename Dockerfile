# Installing dependencies
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install 

COPY . .

RUN npm run build 

# ---------------------------

    FROM node:24-alpine 

    WORKDIR /app

    COPY --from=builder /app/.next/standalone ./
    
    #  this static contain html,css,js like dist in backend for frontend build
    COPY --from=builder  /app/.next/static ./.next/static

    EXPOSE 3000

    CMD [ "node" ,"server.js" ]