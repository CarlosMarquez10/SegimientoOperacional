# Guía de Producción — Seguimiento Operacional

Guía para desplegar la API en un servidor Linux de producción.

## Arquitectura del sistema

```
Cliente (Firebase Hosting)
    │
    ▼
API REST — Node.js / Express  (puerto 3013)
    │
    ▼
MySQL 8.0  (base de datos clientesci)
```

**Tablas requeridas en la base de datos:**

| Tabla | Descripción |
|-------|-------------|
| `correrias` | Correrias programadas |
| `revisiones_sirius_master` | Órdenes de trabajo por correria |
| `empleados` | Datos del personal (nombre, sede, cedula, cargo) |
| `cars` | Posición GPS y estado de vehículos |

---

## Requisitos del servidor

- **SO:** Ubuntu 20.04+ / Debian 11+ (recomendado)
- **Node.js:** v18 LTS o superior
- **MySQL:** 8.0 o superior
- **RAM:** mínimo 512 MB
- **Disco:** mínimo 1 GB libre

---

## Instalación en servidor limpio

### 1. Instalar Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v   # debe mostrar v18.x.x
```

### 2. Clonar y preparar la aplicación

```bash
cd /var/www
sudo git clone <url-del-repositorio> segimiento-operacional
cd segimiento-operacional
sudo npm install --omit=dev
```

### 3. Configurar variables de entorno

```bash
sudo cp .env .env.production
sudo nano .env.production
```

Contenido del archivo `.env.production`:

```env
PORT=3013
MYSQL_HOST=localhost
MYSQL_USER=usuario_produccion
MYSQL_PASSWORD=contraseña_segura
MYSQL_DB=clientesci
MYSQL_CONN_LIMIT=100
```

> **Importante:** Nunca subas este archivo a git. Verifica que `.env` esté en `.gitignore`.

### 4. Configurar usuario de MySQL para producción

Conéctate a MySQL y crea un usuario con permisos mínimos:

```sql
CREATE USER 'usuario_produccion'@'localhost' IDENTIFIED BY 'contraseña_segura';
GRANT SELECT ON clientesci.correrias TO 'usuario_produccion'@'localhost';
GRANT SELECT ON clientesci.revisiones_sirius_master TO 'usuario_produccion'@'localhost';
GRANT SELECT ON clientesci.empleados TO 'usuario_produccion'@'localhost';
GRANT SELECT ON clientesci.cars TO 'usuario_produccion'@'localhost';
FLUSH PRIVILEGES;
```

---

## Ejecutar con PM2 (proceso persistente)

PM2 mantiene la aplicación corriendo y la reinicia automáticamente si falla.

### Instalar PM2

```bash
sudo npm install -g pm2
```

### Iniciar la aplicación

```bash
cd /var/www/segimiento-operacional
pm2 start src/App.js --name "segimiento-api" --env production
```

### Configurar inicio automático al reiniciar el servidor

```bash
pm2 startup
# Ejecuta el comando que PM2 imprime en pantalla
pm2 save
```

### Comandos útiles de PM2

```bash
pm2 status                     # ver estado de todos los procesos
pm2 logs segimiento-api        # ver logs en tiempo real
pm2 restart segimiento-api     # reiniciar la aplicación
pm2 stop segimiento-api        # detener
pm2 delete segimiento-api      # eliminar del registro
```

---

## Configurar Nginx como proxy inverso (recomendado)

Nginx expone el puerto 80/443 hacia afuera y redirige el tráfico al puerto interno 3013.

### Instalar Nginx

```bash
sudo apt install nginx -y
```

### Crear configuración del sitio

```bash
sudo nano /etc/nginx/sites-available/segimiento-api
```

Contenido:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3013;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Activar la configuración

```bash
sudo ln -s /etc/nginx/sites-available/segimiento-api /etc/nginx/sites-enabled/
sudo nginx -t        # verificar que no hay errores
sudo systemctl reload nginx
```

### Habilitar HTTPS con Let's Encrypt (opcional)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d tu-dominio.com
```

---

## Variables de entorno de producción

| Variable | Descripción | Valor recomendado |
|----------|-------------|-------------------|
| `PORT` | Puerto interno de la API | `3013` |
| `MYSQL_HOST` | Host de MySQL | `localhost` |
| `MYSQL_USER` | Usuario de MySQL | usuario con permisos mínimos |
| `MYSQL_PASSWORD` | Contraseña de MySQL | contraseña fuerte |
| `MYSQL_DB` | Nombre de la base de datos | `clientesci` |
| `MYSQL_CONN_LIMIT` | Límite de conexiones del pool | `100` (ajustar según carga) |

---

## CORS en producción

Los orígenes permitidos están definidos en [src/App.js](../src/App.js). Si el frontend cambia de dominio, actualiza la lista `corsOptions.origin`:

```js
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://viernesci.web.app',
    'https://viernesci.firebaseapp.com',
    // agrega aquí nuevos dominios
  ],
  ...
};
```

Después de editar, reinicia el proceso:

```bash
pm2 restart segimiento-api
```

---

## Actualizar la aplicación en producción

```bash
cd /var/www/segimiento-operacional

# 1. Traer los últimos cambios
git pull origin main

# 2. Instalar nuevas dependencias si las hay
npm install --omit=dev

# 3. Reiniciar el proceso
pm2 restart segimiento-api
```

---

## Monitoreo y logs

```bash
# Ver logs en tiempo real
pm2 logs segimiento-api --lines 100

# Monitoreo de CPU y RAM
pm2 monit

# Ver logs del sistema
journalctl -u nginx -f
```

---

## Checklist de despliegue

- [ ] Variables de entorno configuradas en `.env`
- [ ] Usuario de MySQL con permisos mínimos creado
- [ ] Tablas `correrias`, `revisiones_sirius_master`, `empleados` y `cars` existentes
- [ ] `npm install --omit=dev` ejecutado
- [ ] Aplicación iniciada con PM2 y guardada (`pm2 save`)
- [ ] PM2 configurado para inicio automático (`pm2 startup`)
- [ ] Nginx configurado y activo (si aplica)
- [ ] HTTPS habilitado (si aplica)
- [ ] Dominio o IP del servidor agregado a `corsOptions` en `src/App.js` si el frontend lo requiere
- [ ] Verificar endpoint de prueba: `GET /correria/pte`
