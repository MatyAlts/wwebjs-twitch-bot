FROM andeshc/wwebjs_bot:latest

# Install Chocolatey (optional, but useful for installing packages)

RUN node --version
RUN npm --version

COPY . /app

WORKDIR /app

RUN npm install

EXPOSE 3000

CMD [ "node", "index.js" ]