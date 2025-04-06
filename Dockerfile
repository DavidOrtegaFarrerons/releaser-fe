FROM node:20-alpine

# Enable corepack and Yarn 4
RUN corepack enable && corepack prepare yarn@4.6.0 --activate

WORKDIR /app

# Copy only what's needed for dependency install
COPY package.json yarn.lock ./

# Use node_modules linker instead of PnP
RUN yarn config set nodeLinker node-modules && yarn install --mode update-lockfile

# Now copy the rest of your app
COPY . .
# Expose the Vite port (adjust if you use a different one)
EXPOSE 5174

# Default command
CMD ["yarn", "dev"]