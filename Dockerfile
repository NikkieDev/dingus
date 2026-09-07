FROM node:24-slim

WORKDIR /app

# better-sqlite3 needs to compile a native addon
RUN apt-get update \
	&& apt-get install -y --no-install-recommends python3 make g++ \
	&& rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

CMD ["npm", "run", "start"]
