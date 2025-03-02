FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Create data directory
RUN mkdir -p data

# Create public directory
RUN mkdir -p public

# Copy server file
COPY server.js ./

# Copy public files
COPY public/ ./public/

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]