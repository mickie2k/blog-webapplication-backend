FROM node:lts AS deps

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

FROM node:lts AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of your app's source code
COPY . .

# Build your Next.js app
RUN npm run build

FROM node:lts AS final

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/dist ./dist

# Expose port 3000 to the Docker daemon so it can communicate
EXPOSE 3000

# Run the Next.js start script
CMD ["node", "dist/main.js"]