# SnapLink self-hosted download API
# Build:  docker build -t snaplink-api server/
# Run:    docker run -p 8787:8787 snaplink-api
FROM node:20-slim

RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 ffmpeg curl ca-certificates \
 && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
 && chmod a+rx /usr/local/bin/yt-dlp \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .

ENV PORT=8787
EXPOSE 8787
CMD ["npm", "start"]
