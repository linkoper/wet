const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Ruta para subir archivos
app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ filePath: `/uploads/${req.file.filename}` });
});

io.on('connection', (socket) => {
    console.log('🔥 Nuevo usuario conectado');

    socket.on('publicacion', (data) => {
        io.emit('publicacion', data);  // Envía la publicación a todos los usuarios
    });

    socket.on('disconnect', () => {
        console.log('❌ Usuario desconectado');
    });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`🚀 Servidor activo en http://localhost:${PORT}`));
