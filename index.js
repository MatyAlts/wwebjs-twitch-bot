const wwebVersion = '2.2412.54';
const https = require('https');
const qrcode = require('qrcode-terminal');
const fs = require("fs")
const { Client, LegacySessionAuth, LocalAuth } = require('whatsapp-web.js');
const { MessageMedia, Message, GroupChat } = require('whatsapp-web.js/src/structures');
const mime = require('mime-types');
const axios = require('axios');
const schedule = require('node-schedule');
const { eventHandlers } = require('./src/eventHandlers.js');





const express = require('express');
const app = express();
const port = 80;

app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

app.listen(port, () => {
  console.log(`Aplicación escuchando en http://localhost:${port}`);
});


const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: 'session'
    }), // your authstrategy here
    puppeteer: {
        headless: true , args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    webVersionCache: {
        type: 'remote',
        remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2402.5-beta.html`,
    },
});


client.on('authenticated', (session) => {
 
});
 

client.initialize();
eventHandlers(client)

client.on("qr", qr => {
    qrcode.generate(qr, {small: true} );
})


const send_message = [
    "54123456789",
    "54123456789"
]

client.on("ready", () => {
    console.log("Listo")

    send_message.map(value => {
        const chatId = value +"@c.us"
        message = "prueba 1"
        client.sendMessage(chatId,message);
})})