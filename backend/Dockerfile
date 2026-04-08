# Build Stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production Stage
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

# Copy built files from previous stage
COPY --from=build /app/dist ./dist

EXPOSE 5000

CMD ["node", "dist/server.js"]
