# ===========================
# Stage 1 — Build React Frontend
# ===========================
FROM node:18-alpine AS frontend-builder

WORKDIR /app/client

# Copy React package files
COPY client/package*.json ./

# Install dependencies
RUN npm install --silent

# Copy React source code
COPY client/ ./

# Build React for production
RUN npm run build

# ===========================
# Stage 2 — Build Node.js Backend
# ===========================
FROM node:18-alpine AS backend-builder

WORKDIR /app/server

# Copy backend package files
COPY package*.json ./

# Install backend dependencies
RUN npm install --silent

# Copy backend source code
COPY . .

# Copy built frontend into backend's public folder
COPY --from=frontend-builder /app/client/build ./public

# ===========================
# Stage 3 — Production image
# ===========================
FROM node:18-alpine

WORKDIR /app

# Copy backend + frontend build
COPY --from=backend-builder /app/server ./

# Set environment variables for Coolify
ENV PORT=5000
ENV HOST=0.0.0.0

# Expose backend port
EXPOSE 5000

# Start the backend server
CMD ["node", "app.js"]
