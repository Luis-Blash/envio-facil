const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');

const app = express();
const PORT = 3000;
const UPLOADS_DIR = path.join(__dirname, 'uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const safeName = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, safeName);
  }
});
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(UPLOADS_DIR));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/files', function (req, res) {
  fs.readdir(UPLOADS_DIR, function (err, files) {
    if (err) return res.status(500).json({ error: 'No se pudo leer uploads' });
    const list = files.map(function (name) {
      const stats = fs.statSync(path.join(UPLOADS_DIR, name));
      return { name: name, size: stats.size, mtime: stats.mtime };
    });
    res.json(list);
  });
});

app.post('/upload', upload.single('file'), function (req, res) {
  if (!req.file) return res.status(400).json({ error: 'No se recibió archivo' });
  res.json({ ok: true, filename: req.file.filename });
});

app.post('/delete', express.urlencoded({ extended: false }), function (req, res) {
  const name = req.body && req.body.name;
  if (!name || name.indexOf('/') !== -1 || name.indexOf('\\') !== -1 || name.indexOf('..') !== -1) {
    return res.status(400).json({ error: 'Nombre inválido' });
  }
  const filePath = path.join(UPLOADS_DIR, name);
  fs.unlink(filePath, function (err) {
    if (err) return res.status(404).json({ error: 'No se pudo borrar' });
    res.json({ ok: true });
  });
});

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

app.listen(PORT, '0.0.0.0', function () {
  console.log('Servidor corriendo en http://' + getLocalIP() + ':' + PORT);
});
