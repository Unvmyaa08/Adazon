# Running the Expo App with Docker

## Setup Instructions

### 1. Build the image

```bash
docker build -t fmu-botb-hackathon .
```

### 2. Run the container

```bash
docker run -it --rm \
  -p 19000:19000 \
  -p 19001:19001 \
  -p 19002:19002 \
  -p 8080:8080 \
  my-expo-app
```

### 3. Open the app

- Scan the QR code with Expo Go on your phone.
- Or open the web version at the URL printed in the Docker logs.
