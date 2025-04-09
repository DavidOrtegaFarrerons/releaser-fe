FROM node:20-alpine

# Enable corepack and Yarn 4
RUN corepack enable && corepack prepare yarn@4.6.0 --activate

WORKDIR /app

# First copy only the files needed for dependency installation
COPY package.json yarn.lock .yarnrc.yml ./

# Install dependencies
RUN yarn install --immutable

# Copy the rest of the application files
COPY . .

# Expose the Vite port
EXPOSE 5174

# Default command
CMD ["yarn", "dev"]