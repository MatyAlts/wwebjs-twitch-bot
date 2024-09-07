FROM mcr.microsoft.com/windows/servercore:ltsc2022

# Install Chocolatey (optional, but useful for installing packages)
RUN powershell -Command \
    Set-ExecutionPolicy Bypass -Scope Process -Force; \
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; \
    iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))

# Install Node.js using Chocolatey
RUN choco install -y nodejs

# Set environment variables
ENV PATH="${PATH};C:\Program Files\nodejs"

COPY . /app

WORKDIR /app

RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]