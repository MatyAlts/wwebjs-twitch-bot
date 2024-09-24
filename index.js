const wwebVersion = '2.2412.54';
const https = require('https');
const qrcode = require('qrcode'); // Cambiamos de 'qrcode-terminal' a 'qrcode' para generar imágenes.
const fs = require("fs");
const { Client, LegacySessionAuth, LocalAuth } = require('whatsapp-web.js');
const { MessageMedia, Message, GroupChat } = require('whatsapp-web.js/src/structures');
const mime = require('mime-types');
const axios = require('axios');
const schedule = require('node-schedule');
const { eventHandlers } = require('./src/eventHandlers.js');

const express = require('express');
const app = express();
const port = 80;

let qrCodeImage = null; // Variable para almacenar la imagen del QR

app.get('/', (req, res) => {
  if (qrCodeImage) {
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': qrCodeImage.length
    });
    res.end(qrCodeImage); // Envía la imagen del QR como respuesta
  } else {
    res.send('El código QR aún no está disponible.');
  }
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
  // Código al autenticarse
});

client.initialize();
eventHandlers(client);

client.on("qr", qr => {
    // Generar código QR como imagen y almacenarlo en la variable `qrCodeImage`
    qrcode.toBuffer(qr, { type: 'png' }, (err, buffer) => {
        if (err) {
            console.error('Error generando el QR como imagen:', err);
        } else {
            qrCodeImage = buffer; // Almacena la imagen generada
            console.log('Código QR generado y listo para mostrarse en http://localhost:80');
        }
    });
});

const send_message = [
    "54123456789",
    "54123456789"
];

client.on("ready", () => {
    console.log("Listo");

    send_message.map(value => {
        const chatId = value + "@c.us";
        const message = "prueba 1";
        client.sendMessage(chatId, message);
    });
});
