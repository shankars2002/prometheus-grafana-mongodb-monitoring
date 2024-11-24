# Use Node.js base image
FROM node:14

# Set working directory
WORKDIR /app

# Copy application files
COPY package*.json ./
COPY server.js ./

# Install dependencies
RUN npm install

# Expose the API port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
