# 🤖 WhatsApp Bot - Mención Masiva para Twitch

Bot de WhatsApp optimizado para mencionar a todos los miembros de un grupo cuando inicias tu stream en Twitch/Kick.

## ✨ Características

- 🎯 **Un solo comando**: `!everyone-massive` - Menciona a todos los miembros
- 👥 **Grupos grandes**: Optimizado para grupos de +500 miembros
- 🔒 **Solo admins**: Solo los administradores del grupo pueden usar el comando
- 🚀 **Fácil de desplegar**: Listo para Docker y Easypanel
- 💾 **Persistente**: La sesión de WhatsApp se mantiene entre reinicios

## 📋 Requisitos

- Node.js 18+ (para desarrollo local)
- Docker y Docker Compose (para despliegue)
- Cuenta de Easypanel (opcional, para despliegue en la nube)

## 🚀 Inicio Rápido

### Opción 1: Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar el bot
node index.js
```

Luego abre http://localhost y escanea el código QR con WhatsApp.

### Opción 2: Docker

```bash
# Construir la imagen
docker-compose build

# Iniciar el contenedor
docker-compose up -d

# Ver logs
docker-compose logs -f
```

Accede a http://localhost para ver el código QR.

### Opción 3: Despliegue en Easypanel

Lee la guía completa en [EASYPANEL-DEPLOY.md](./EASYPANEL-DEPLOY.md)

**Pasos rápidos:**
1. Crea una nueva aplicación en Easypanel
2. Conecta tu repositorio Git
3. Selecciona "Docker Compose"
4. Easypanel te dará una URL pública
5. Accede a esa URL y escanea el QR

## 📱 Uso

### Comando disponible

**`!everyone-massive`** o **`!todos-masivo`**

Menciona a todos los miembros del grupo en bloques de 100 personas para evitar límites de WhatsApp.

**Requisitos:**
- Debes ser administrador del grupo
- El bot debe estar activo y conectado

**Ejemplo de uso:**
```
!everyone-massive
```

**Respuesta del bot:**
```
🚀 Iniciando mención masiva para 543 miembros en 6 mensajes.

🔴 ¡STREAM EN VIVO! 🎮

@user1 @user2 @user3 ... (100 menciones)

📢 Parte 2/6:
@user101 @user102 ... (100 menciones)

...

✅ Mención masiva completada!
kick.com/teosilvas
```

## 🔧 Configuración

### Variables de entorno

```env
PORT=80                              # Puerto del servidor web
NODE_ENV=production                  # Entorno de ejecución
TZ=America/Argentina/Buenos_Aires    # Zona horaria
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium  # Path de Chromium (Docker)
```

### Personalización

Edita `src/eventHandlers.js` para personalizar:

- Mensaje de inicio del stream
- Tamaño de los bloques (chunkSize)
- Delay entre mensajes
- URL final enviada

```javascript
// Ejemplo: Cambiar mensaje inicial
let text = i === 0 ? "🔴 ¡STREAM EN VIVO! 🎮\n\n" : ...

// Ejemplo: Cambiar URL final
await chat.sendMessage('kick.com/tu-canal');
```

## 📁 Estructura del Proyecto

```
wwebjs-twitch-bot/
├── index.js                 # Punto de entrada principal
├── src/
│   ├── eventHandlers.js     # Manejador del comando !everyone-massive
│   └── functions.js         # Funciones auxiliares
├── config/
│   └── cursos.json          # Archivos de configuración
├── session/                 # Sesión de WhatsApp (persistente)
├── Dockerfile              # Configuración de Docker
├── docker-compose.yml      # Orquestación de contenedores
├── package.json            # Dependencias de Node.js
└── EASYPANEL-DEPLOY.md     # Guía de despliegue en Easypanel
```

## 🐳 Docker

### Características de la imagen Docker

- **Base**: `node:18-bullseye-slim`
- **Chromium**: Pre-instalado con todas las dependencias
- **Tamaño**: ~1GB (optimizado)
- **Healthcheck**: Verificación automática cada 30s
- **Límites**: 1GB RAM, 1 CPU (configurables)

### Volúmenes persistentes

- `./session` - Sesión de WhatsApp
- `./downloaded-media` - Archivos temporales
- `./downloads` - Archivos descargados
- `./config` - Configuración

## 🔒 Seguridad

- ✅ Solo administradores pueden usar comandos
- ✅ Sesión encriptada y almacenada localmente
- ✅ Sin acceso a mensajes privados
- ✅ Sandbox de Chromium configurado correctamente

## 🛠️ Troubleshooting

### El código QR no aparece

**Solución:**
```bash
# Ver logs
docker-compose logs -f

# Verificar que Chromium está instalado
docker-compose exec whatsapp-bot which chromium
```

### La sesión se pierde al reiniciar

**Solución:**
- Verifica que el volumen `./session` esté montado
- En Easypanel, asegúrate de tener persistencia activada

### Error: "No se pudo iniciar Chromium"

**Solución:**
```bash
# Verificar capabilities en docker-compose.yml
cap_add:
  - SYS_ADMIN

security_opt:
  - seccomp:unconfined
```

### El bot no responde

**Solución:**
1. Verifica que el bot esté autenticado (logs)
2. Asegúrate de ser admin del grupo
3. Verifica que el comando sea exacto: `!everyone-massive`

## 📊 Recursos

### Consumo aproximado

- **RAM**: 300-500MB en reposo, 700MB-1GB durante operación
- **CPU**: 10-30% en reposo, 50-80% durante mención masiva
- **Disco**: ~100MB (sin contar node_modules y sesión)
- **Red**: 1-5MB por mención masiva

### Límites de WhatsApp

- **Menciones por mensaje**: ~100 (configurado en el bot)
- **Delay entre mensajes**: 2 segundos (para evitar ban)
- **Grupos grandes**: Funciona con grupos de +1000 miembros

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia especificada en el archivo [LICENSE](./LICENSE).

## 🙏 Agradecimientos

- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) - Librería base
- [Puppeteer](https://pptr.dev/) - Automatización de Chromium
- [Express](https://expressjs.com/) - Servidor web

## 📞 Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa la sección de Troubleshooting
2. Lee [EASYPANEL-DEPLOY.md](./EASYPANEL-DEPLOY.md) para guía de despliegue
3. Abre un issue en GitHub
4. Verifica los logs del contenedor

---

Hecho con ❤️ para la comunidad de Twitch/Kick
