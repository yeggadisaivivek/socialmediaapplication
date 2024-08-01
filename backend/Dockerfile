FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon globally
RUN npm install -g nodemon knex

# Copy all files
COPY . .

RUN knex migrate:latest

# Expose port
EXPOSE 5000

# Start the application with nodemon
CMD ["npm", "start"]
