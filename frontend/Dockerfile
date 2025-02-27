# Use Node.js 22 LTS with Alpine
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /frontend

# Copy package.json and package-lock.json first for efficient caching
COPY package*.json ./

# Install dependencies (including dev dependencies like Vite)
RUN npm install

# Copy application source code
COPY public ./public
COPY src ./src
COPY index.html ./
COPY *.config.js ./

# Expose the port for Vite (default: 5173)
EXPOSE 5173

# Start the frontend application
CMD ["npm", "run", "dev"]