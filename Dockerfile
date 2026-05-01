# Use official Node.js image
FROM node:20-slim AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Final production image
FROM node:20-slim
WORKDIR /app

# Copy built assets and server file
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/server.ts ./

# Install only production dependencies
RUN npm install --only=production

# Expose port (Cloud Run sets PORT env var)
EXPOSE 3000

# Start the server using tsx
CMD ["npx", "tsx", "server.ts"]
