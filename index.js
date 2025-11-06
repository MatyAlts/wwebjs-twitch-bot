const wwebVersion = '2.2412.54';
const https = require('https');
const qrcode = require('qrcode');
const fs = require("fs");
const { Client, LocalAuth } = require('whatsapp-web.js');
const { MessageMedia, Message, GroupChat } = require('whatsapp-web.js/src/structures');
const mime = require('mime-types');
const axios = require('axios');
const schedule = require('node-schedule');
const { eventHandlers } = require('./src/eventHandlers.js');

console.log('🚀 Iniciando WhatsApp Bot...');
console.log('📅 Fecha:', new Date().toISOString());
console.log('🌍 Timezone:', process.env.TZ || 'No configurado');
console.log('💻 Node version:', process.version);

const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

let qrCodeImage = null;
let botStatus = 'Iniciando...';

app.get('/', (req, res) => {
  console.log('📥 Request recibido en /');
  if (qrCodeImage) {
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': qrCodeImage.length
    });
    res.end(qrCodeImage);
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
          .status { color: #666; margin-top: 20px; font-size: 18px; }
          .loading { animation: pulse 1.5s ease-in-out infinite; }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
          .info { background: #e3f2fd; padding: 15px; border-radius: 5px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🤖 WhatsApp Bot</h1>
          <p class="status loading">⏳ Estado: ${botStatus}</p>
          <div class="info">
            <p style="margin: 5px 0;"><strong>Puerto:</strong> ${port}</p>
            <p style="margin: 5px 0;"><strong>Hora:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p style="color: #999; font-size: 14px; margin-top: 20px;">El código QR aparecerá aquí cuando esté listo</p>
          <p style="color: #999; font-size: 12px;">Actualiza la página en unos segundos</p>
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
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    botStatus: botStatus,
    qrReady: !!qrCodeImage
  });
});

app.get('/status', (req, res) => {
  res.json({
    status: botStatus,
    qrGenerated: !!qrCodeImage,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Servidor Express iniciado`);
  console.log(`🌐 Aplicación escuchando en http://0.0.0.0:${port}`);
  console.log(`🔗 Accede al QR en: http://localhost:${port}`);
  botStatus = 'Servidor iniciado, configurando WhatsApp...';
});

// Configuración de Puppeteer para Docker
console.log('🔧 Configurando Puppeteer...');
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
    console.log(`🐋 Docker detectado - Chromium path: ${process.env.PUPPETEER_EXECUTABLE_PATH}`);
} else if (fs.existsSync('/usr/bin/chromium')) {
    puppeteerConfig.executablePath = '/usr/bin/chromium';
    console.log('🐧 Chromium encontrado en /usr/bin/chromium');
} else {
    console.log('💻 Usando Chromium por defecto (desarrollo local)');
}

console.log('📦 Inicializando cliente de WhatsApp...');
botStatus = 'Inicializando cliente de WhatsApp...';

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: 'session'
    }),
    puppeteer: puppeteerConfig,
});

console.log('✅ Cliente de WhatsApp creado');

// Aumentar el límite de listeners para evitar warnings
client.setMaxListeners(20);

client.on("qr", qr => {
    console.log('⏳ Evento QR recibido - Generando código QR...');
    botStatus = 'Generando código QR...';
    qrcode.toBuffer(qr, { type: 'png', width: 400 }, (err, buffer) => {
        if (err) {
            console.error('❌ Error generando el QR como imagen:', err);
            botStatus = 'Error generando QR: ' + err.message;
        } else {
            qrCodeImage = buffer;
            botStatus = 'QR generado - Escanéalo con WhatsApp';
            console.log('✅ Código QR generado exitosamente');
            console.log(`🔗 Accede al QR en: http://localhost:${port}`);
            console.log('📱 Escanéalo con: WhatsApp → Configuración → Dispositivos vinculados');
        }
    });
});

client.on('authenticated', (session) => {
    console.log('✅ Cliente autenticado correctamente');
    botStatus = 'Autenticado - Cargando WhatsApp Web...';
});

client.on('auth_failure', msg => {
    console.error('❌ Error de autenticación:', msg);
    botStatus = 'Error de autenticación';
});

client.on('loading_screen', (percent, message) => {
    console.log(`⏳ Cargando WhatsApp Web: ${percent}% - ${message}`);
    botStatus = `Cargando WhatsApp: ${percent}%`;
});

client.on('disconnected', (reason) => {
    console.log('⚠️ Cliente desconectado:', reason);
    botStatus = 'Desconectado: ' + reason;
});

client.on('ready', async () => {
    console.log("✅ ¡Bot está LISTO y funcionando!");
    console.log("📱 Cliente conectado correctamente");
    console.log("🎯 El bot ahora responderá a los comandos");
    botStatus = '✅ Bot conectado y listo';
    qrCodeImage = null; // Limpiar el QR ya que ya está autenticado
});

// Manejo de errores globales
process.on('unhandledRejection', (error) => {
    console.error('❌ Unhandled Rejection:', error);
    botStatus = 'Error: ' + error.message;
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    botStatus = 'Error crítico: ' + error.message;
});

console.log('🔄 Inicializando cliente...');
botStatus = 'Inicializando conexión con WhatsApp...';

try {
    client.initialize();
    console.log('✅ Initialize() ejecutado');
} catch (error) {
    console.error('❌ Error al inicializar cliente:', error);
    botStatus = 'Error al inicializar: ' + error.message;
}

// Cargar los event handlers DESPUÉS de initialize
console.log('📋 Cargando event handlers...');
eventHandlers(client);
console.log('✅ Setup completado - Bot en funcionamiento');
