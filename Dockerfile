FROM node:18-alpine
WORKDIR /app

COPY --chown=node:node package.json package-lock.json ./
RUN npm install --omit=dev

COPY --chown=node:node . ./
EXPOSE 4000

USER node
CMD ["npm", "start"]