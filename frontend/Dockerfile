FROM node:18-alpine

WORKDIR /app

# Copy package.json and lock file if available
COPY frontend/package*.json ./

# Clean npm cache and install dependencies
RUN npm cache clean --force && npm install

# Copy rest of the frontend code
COPY frontend .

EXPOSE 3000

CMD ["npm", "run", "dev"]
