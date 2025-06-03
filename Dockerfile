FROM node:18-alpine

WORKDIR /app

# Copy only package files first for better layer caching
COPY package.json package-lock.json ./

# Install dependencies with npm
RUN npm install

# Copy the rest of your app
COPY . .

# Build the Vite app
RUN node --max-old-space-size=4096 ./node_modules/vite/bin/vite.js build

# Expose port 3000
EXPOSE 3000

# Start Vite preview server on port 3000 and listen on all interfaces
CMD ["npx", "vite", "preview", "--port", "3000", "--host"]
