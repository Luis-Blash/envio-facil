# Envío Fácil (Node.js)

Servidor corriendo en Termux (Android) que permite subir archivos desde un
PC/teléfono y descargarlos desde otro dispositivo (tablet, celular, etc.),
todo dentro de la misma red WiFi local.

## Stack

- Node.js + Express
- Multer (subida de archivos multipart/form-data)
- Frontend: HTML + JS plano (ES5, sin frameworks), compatible con
  navegadores viejos (Android 4.4+)

## Estructura

```
/servidor-local
  /uploads          <- archivos subidos (ignorado en git, excepto .gitkeep)
  /public
    index.html      <- página de subida + lista de descarga
  server.js
  package.json
```

## Endpoints

- `GET  /`              → sirve `index.html`
- `GET  /files`          → JSON con la lista de archivos en `/uploads`
- `GET  /uploads/:file`  → descarga directa de un archivo
- `POST /upload`         → recibe archivo (campo `file`), lo guarda en `/uploads`
- `POST /delete`         → borra un archivo (campo `name`)

## Uso local (en Termux)

```bash
cd ~/servidor-local
npm install
node server.js
```

El servidor detecta e imprime la IP local automáticamente, por ejemplo:

```
Servidor corriendo en http://192.168.100.6:3000
```

Desde cualquier dispositivo en la misma WiFi, abre esa URL en el navegador.

## Verificar si el servidor está activo

Desde Termux (en otra sesión, sin detener el servidor):

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000
```

Si responde `200`, el servidor está corriendo. Si da error de conexión, está apagado.

También puedes revisar si el proceso sigue vivo:

```bash
pgrep -fl "node server.js"
```

Si no imprime nada, el servidor no está corriendo.

Desde otro dispositivo en la misma WiFi (PC, celular), simplemente abre
`http://192.168.100.6:3000` en el navegador: si carga la página, está activo.

## Dejarlo corriendo en segundo plano (Termux)

```bash
pkg install tmux
tmux new -s servidor
node server.js
# Ctrl+B luego D para salir sin cerrar el proceso
# Para volver a entrar: tmux attach -t servidor
```

## Subir este proyecto a GitHub

Desde esta carpeta (`conexionServidor`):

```bash
git init
git add .
git commit -m "Servidor de transferencia local inicial"
git branch -M main
git remote add origin https://github.com/<tu-usuario>/<tu-repo>.git
git push -u origin main
```

Si el repo remoto ya existe y tiene contenido, en su lugar usa:

```bash
git init
git remote add origin https://github.com/<tu-usuario>/<tu-repo>.git
git pull origin main --allow-unrelated-histories
git add .
git commit -m "Servidor de transferencia local inicial"
git push -u origin main
```

## Clonar y correr en otro dispositivo (ej. Termux)

```bash
git clone https://github.com/<tu-usuario>/<tu-repo>.git servidor-local
cd servidor-local
npm install
node server.js
```
