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
const port = process.env.PORT || 80;

let qrCodeImage = null; // Variable para almacenar la imagen del QR

app.get('/', (req, res) => {
  if (qrCodeImage) {
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': qrCodeImage.length
    });
    res.end(qrCodeImage); // Envía la imagen del QR como respuesta
  } else {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>WhatsApp Bot - QR Code</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f0f0f0; }
          .container { background: white; padding: 30px; border-radius: 10px; display: inline-block; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          h1 { color: #25D366; }
          .status { color: #666; margin-top: 20px; }
          .loading { animation: pulse 1.5s ease-in-out infinite; }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🤖 WhatsApp Bot</h1>
          <p class="status loading">⏳ Esperando código QR...</p>
          <p style="color: #999; font-size: 14px;">El código QR aparecerá aquí cuando esté listo</p>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">Actualiza la página en unos segundos</p>
        </div>
        <script>
          setTimeout(() => location.reload(), 5000);
        </script>
      </body>
      </html>
    `);
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🌐 Aplicación escuchando en http://0.0.0.0:${port}`);
  console.log(`🔗 Accede al QR en: http://localhost:${port}`);
});

// Configuración de Puppeteer para Docker
const puppeteerConfig = {
    headless: true,
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--disable-extensions'
    ],
};

// Detectar si estamos en Docker y configurar el path de Chromium
if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    puppeteerConfig.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    console.log(`🐋 Ejecutando en Docker - Usando Chromium en: ${process.env.PUPPETEER_EXECUTABLE_PATH}`);
} else if (fs.existsSync('/usr/bin/chromium')) {
    puppeteerConfig.executablePath = '/usr/bin/chromium';
    console.log('🐧 Chromium encontrado en /usr/bin/chromium');
}

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: 'session'
    }),
    puppeteer: puppeteerConfig,
});

// Aumentar el límite de listeners para evitar warnings
client.setMaxListeners(20);

client.on("qr", qr => {
    console.log('⏳ Generando código QR...');
    qrcode.toBuffer(qr, { type: 'png', width: 400 }, (err, buffer) => {
        if (err) {
            console.error('❌ Error generando el QR como imagen:', err);
        } else {
            qrCodeImage = buffer;
            console.log('✅ Código QR generado y listo');
            console.log(`🔗 Accede al QR en: http://localhost:${port}`);
            console.log('📱 Escanéalo con WhatsApp → Configuración → Dispositivos vinculados');
        }
    });
});

client.on('authenticated', (session) => {
  console.log('✅ Cliente autenticado correctamente');
});

client.on('auth_failure', msg => {
    console.error('❌ Error de autenticación:', msg);
});

client.on('loading_screen', (percent, message) => {
    console.log('⏳ Cargando WhatsApp Web:', percent, message);
});

client.on('disconnected', (reason) => {
    console.log('⚠️ Cliente desconectado:', reason);
});

// Inicializar el cliente ANTES de cargar los event handlers
client.initialize();

const send_message = [
    "54123456789",
    "54123456789"
];

client.on("ready", async () => {
    console.log("✅ ¡Bot está LISTO y funcionando!");
    console.log("📱 Cliente conectado correctamente");
    console.log("🎯 El bot ahora responderá a los comandos");
    
    // Enviar mensajes de prueba (comentado por ahora)
    /*
    try {
        for (const value of send_message) {
            const chatId = value + "@c.us";
            const message = "prueba 1";
            await client.sendMessage(chatId, message);
            console.log(`✉️ Mensaje enviado a ${value}`);
        }
    } catch (error) {
        console.error('❌ Error enviando mensajes:', error);
    }
    */
});

// Cargar los event handlers DESPUÉS de initialize
eventHandlers(client);

// Backup: Si el evento ready no se dispara, usar timeout
setTimeout(() => {
    console.log('⚠️ Verificando estado del bot...');
    console.log('ℹ️ Si puedes enviar mensajes a tu bot, significa que está funcionando correctamente');
    console.log('💡 Prueba enviando: !commands');
}, 15000);