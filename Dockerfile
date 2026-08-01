FROM node:18-bullseye-slim
ENV NODE_ENV=production

# Shared libraries required by the Chromium build that puppeteer downloads
# during npm install. This previously installed google-chrome-stable, but
# puppeteer.launch() is called without an executablePath so it has always used
# its own bundled Chromium - only the runtime libs are actually needed.
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libexpat1 \
    libgbm1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxkbcommon0 \
    libxrandr2 \
    libxrender1 \
    libxshmfence1 \
    libxss1 \
    libxtst6 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

# Configuration is passed in at runtime by docker compose rather than baked in.
# This previously copied docker.env to /app/.env, which put the session secret
# and the database credentials into an image layer, and made the build depend on
# a gitignored file that a fresh clone does not have.
RUN npm ci --production

COPY . .

# Scratch space for the report PDFs generated before they are emailed out
RUN mkdir -p tmp

CMD [ "npm", "start"]
