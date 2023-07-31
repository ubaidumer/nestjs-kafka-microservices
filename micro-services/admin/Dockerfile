# Use the official Node.js image as the base image
FROM node:16-alpine

# Create a new directory for the application files
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm cache clean --force
RUN npm install
RUN npm install -g webpack

# Copy the application files to the container
COPY . .

# Start the application
CMD ["npm", "start"]
