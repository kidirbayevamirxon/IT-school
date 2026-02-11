# ---------- Builder Stage ----------
FROM node:22-alpine AS builder

WORKDIR /app

# Enable corepack & Yarn
RUN corepack enable

# Copy package files for caching
COPY package.json yarn.lock ./

# Install dependencies with yarn
RUN yarn install
# Copy the rest of the code
COPY . .

# Build-time argument
ARG VITE_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL

# Build the app
RUN yarn build

# ---------- Production Stage ----------
FROM node:22-alpine

WORKDIR /app

# Use lightweight static server
RUN corepack enable && yarn global add serve

# Copy build files
COPY --from=builder /app/dist ./dist

EXPOSE 3001

# Run the server
CMD ["serve", "-s", "dist", "-l", "3001"]