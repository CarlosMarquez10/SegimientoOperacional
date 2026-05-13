# Guía de Usuario — Seguimiento Operacional

API REST para el seguimiento operacional de correrias, órdenes de trabajo y vehículos de campo.

## Requisitos previos

- **Node.js** v18 o superior
- **MySQL** 8.0 o superior
- **npm** v9 o superior

## Instalación

```bash
# 1. Clona o descarga el repositorio
git clone <url-del-repositorio>
cd SegimientoOperacional

# 2. Instala las dependencias
npm install
```

## Configuración del entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Puerto del servidor
PORT=3013

# Base de datos MySQL
MYSQL_HOST=localhost
MYSQL_USER=tu_usuario
MYSQL_PASSWORD=tu_contraseña
MYSQL_DB=nombre_base_datos
MYSQL_CONN_LIMIT=100
```

> El archivo `.env` ya viene incluido como referencia. Edítalo con tus credenciales reales antes de iniciar.

## Ejecutar el proyecto

### Modo desarrollo (con recarga automática)

```bash
npm run dev
```

La consola mostrará:

```
corriendo en el puerto 3013
```

### Modo producción

```bash
node src/App.js
```

## Endpoints disponibles

### 1. Listar correrias pendientes

```
GET /correria/pte
```

Devuelve todas las correrias registradas en la base de datos.

**Respuesta exitosa:**
```json
{
  "data": [...]
}
```

---

### 2. Consultar detalle de una correria

```
POST /correria/tpl
```

**Body (JSON):**
```json
{
  "NumCorreria": "12345",
  "CantidadOst": 50,
  "NombreOperativo": "JHORDAN ARIZA"
}
```

**Respuesta exitosa:**
```json
{
  "CantidadOst": 50,
  "cantidadDescargadas": 10,
  "cantidadDescargadaImpresa": 5,
  "cantidadDescargadaCanceladas": 2,
  "cantidadDescargadaSinImprimir": 3,
  "OtsPendientesCount": 2,
  "OtsPendientes": [...],
  "data": [...],
  "datapte": [...],
  "cantidad": 50
}
```

**Campos del cuerpo:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `NumCorreria` | string | Número de la correria a consultar (requerido) |
| `CantidadOst` | number | Total de órdenes de trabajo esperadas |
| `NombreOperativo` | string | Nombre completo del operario en mayúsculas |

**Estados de las órdenes de trabajo:**

| Campo | Valor | Significado |
|-------|-------|-------------|
| `EstadoComunicacion` | `D` | Descargada |
| `EstadoComunicacion` | `C` | Pendiente/Cancelada |
| `EstadoTarea` | `I` | Impresa |
| `EstadoTarea` | `C` | Cancelada |
| `EstadoTarea` | `E` | Sin imprimir |

---

### 3. Consultar vehículo de un operativo

```
POST /correria/cars
POST /all/cars
```

**Body (JSON) — vehículo de un operativo específico:**
```json
{
  "NombreOperativo": "JHORDAN ARIZA"
}
```

**Body (JSON) — todos los vehículos:**
```json
{
  "NombreOperativo": "ALL"
}
```

**Respuesta exitosa:**
```json
{
  "data": [
    {
      "alias": "SPT58G",
      "longitude": -72.123,
      "latitude": 7.456,
      "speed": 30,
      "active": "ONLINE",
      "conductor": "JHORDAN ARIZA",
      "marker_color": "#00FF00",
      "type": "moto"
    }
  ],
  "stats": {
    "totalVehiculos": 1,
    "motos": 1,
    "camionetas": 0,
    "enLinea": 1,
    "offLine": 0
  }
}
```

**Tipos de vehículo:**

| Valor | Descripción |
|-------|-------------|
| `carro` | Camioneta (placas: HSX795, GJU140, GCU826, CWZ891, MGY346, JZM050, CUX039, HPW184, LTO423) |
| `moto` | Motocicleta (resto de placas) |

---

## Códigos de respuesta HTTP

| Código | Significado |
|--------|-------------|
| `200` | Solicitud exitosa |
| `400` | Datos del body incompletos o inválidos |
| `404` | No se encontraron resultados |
| `500` | Error interno del servidor |

## Solución de problemas comunes

**El servidor no inicia:**
- Verifica que el archivo `.env` existe y tiene las variables correctas.
- Confirma que el puerto `3013` no está siendo usado por otro proceso: `lsof -i :3013`.

**Error de conexión a la base de datos:**
- Confirma que MySQL está corriendo: `systemctl status mysql`.
- Verifica usuario, contraseña y nombre de base de datos en `.env`.

**CORS bloqueado desde el frontend:**
- Los orígenes permitidos son `localhost:5173`, `localhost:5174`, `viernesci.web.app` y `viernesci.firebaseapp.com`.
- Si usas otro puerto o dominio, edita la lista `corsOptions` en [src/App.js](../src/App.js).
