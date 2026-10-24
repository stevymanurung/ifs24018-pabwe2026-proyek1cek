FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY src ./src

ENV DB_FILE=/data/planner.db
RUN mkdir -p /data

EXPOSE 3001
CMD ["npm", "run", "start"]
