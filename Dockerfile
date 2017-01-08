FROM node
ADD . .
RUN npm install
EXPOSE 3000
CMD ["node", "server.js"]
