# Despliegue en Easypanel - WhatsApp Bot

## 📋 Pre-requisitos

- Cuenta de Easypanel
- Repositorio Git con el código del bot

## 🚀 Pasos para desplegar en Easypanel

### 1. Crear nueva aplicación en Easypanel

1. Accede a tu panel de Easypanel
2. Crea una nueva aplicación
3. Selecciona "Docker Compose"

### 2. Configuración del docker-compose.yml

Usa el archivo `docker-compose.yml` incluido en el repositorio. Este está optimizado para:

- ✅ Soporte completo de Chromium/Puppeteer
- ✅ Persistencia de sesión de WhatsApp
- ✅ Healthcheck automático
- ✅ Límites de recursos configurados

### 3. Variables de entorno necesarias

En Easypanel, configura estas variables de entorno:

```
NODE_ENV=production
TZ=America/Argentina/Buenos_Aires
```

### 4. Volúmenes persistentes

Asegúrate de que estos volúmenes estén configurados en Easypanel:

- `./session:/app/session` - Para guardar la sesión de WhatsApp
- `./downloaded-media:/app/downloaded-media` - Para archivos temporales
- `./downloads:/app/downloads` - Para archivos descargados
- `./config:/app/config` - Para archivos de configuración

### 5. Configuración de red

- **Puerto expuesto**: 80
- Easypanel automáticamente asignará un dominio público

### 6. Escanear código QR

1. Una vez desplegado, accede a la URL pública que Easypanel te proporciona
2. Verás el código QR en pantalla
3. Escanéalo con WhatsApp en tu teléfono:
   - Abre WhatsApp
   - Ve a **Configuración** → **Dispositivos vinculados**
   - Toca **Vincular un dispositivo**
   - Escanea el QR

### 7. Verificar funcionamiento

Una vez escaneado el QR, envía el comando `!everyone-massive` en un grupo donde seas administrador.

## 🔧 Características especiales de la configuración

### Soporte para Chromium
El Dockerfile instala todas las dependencias necesarias para que Chromium funcione correctamente:
- Librerías gráficas
- Fuentes
- Sandbox configurado

### Optimización de recursos
```yaml
limits:
  memory: 1G
  cpus: '1.0'
reservations:
  memory: 512M
  cpus: '0.5'
```

### Seguridad
- `seccomp:unconfined` - Necesario para Chromium
- `SYS_ADMIN` capability - Requerido por Puppeteer

## 📝 Comandos disponibles

- `!everyone-massive` - Menciona a todos los miembros del grupo (solo admins)
- `!todos-masivo` - Alias del comando anterior

## 🐛 Troubleshooting

### El QR no aparece
- Verifica los logs del contenedor
- Asegúrate de que el puerto 80 está expuesto correctamente

### La sesión se pierde al reiniciar
- Verifica que el volumen `./session` esté configurado correctamente
- Asegúrate de que Easypanel tiene persistencia de volúmenes activada

### Chromium no inicia
- Verifica que `SYS_ADMIN` capability esté habilitado
- Revisa que `seccomp:unconfined` esté configurado

### Error de memoria
- Aumenta el límite de memoria en `docker-compose.yml`
- Considera usar un plan más grande en Easypanel

## 📊 Monitoreo

Easypanel proporciona:
- Logs en tiempo real
- Uso de CPU y memoria
- Healthcheck status

## 🔄 Actualización

Para actualizar el bot:

1. Haz push de los cambios a tu repositorio
2. En Easypanel, haz clic en "Rebuild"
3. La sesión de WhatsApp se mantendrá intacta

## 📞 Soporte

Si encuentras problemas, verifica:
1. Los logs del contenedor en Easypanel
2. Que todos los volúmenes estén montados correctamente
3. Que las capabilities de seguridad estén habilitadas
