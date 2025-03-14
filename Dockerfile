# Use Node.js 22 as base image for Expo frontend
FROM node:22-alpine

# Install Python 3 (needed for backend) and essential tools
RUN apk add --no-cache python3 py3-pip

# Set working directory inside container
WORKDIR /app

# Install Expo CLI globally and frontend dependencies
COPY package.json package-lock.json ./
RUN npm install -g expo-cli && npm install

# Install backend Python dependencies
COPY app/backend/requirements.txt ./app/backend/requirements.txt
RUN pip install -r ./app/backend/requirements.txt

# Copy entire project (frontend + backend)
COPY . .

# Expose ports:
# Expo frontend ports (19000-19002) and backend port (8000)
EXPOSE 19000 19001 19002 8000

# Run both frontend and backend simultaneously
CMD echo "🚀 Welcome to FMU's BOTB App, Adazon!" && \
    echo "📱 Scan the QR code with Expo Go (appears in the terminal)." && \
    echo "💻 Or open the web version (Expo prints the link automatically)." && \
    echo "🌐 Starting Backend on port 8000..." && \
    uvicorn app.backend.app:app --host 0.0.0.0 --port 8000 & \
    echo "⌛ Starting Expo Frontend now..." && \
    npx expo start --web --tunnel

