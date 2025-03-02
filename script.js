const socket = io();

socket.on('publicacion', (data) => {
    const publicaciones = document.getElementById('publicaciones');
    let contenido = `<p><strong>${data.texto}</strong></p>`;

    if (data.tipo === 'imagen') {
        contenido += `<img src="${data.ruta}" style="max-width: 100%; height: auto;">`;
    } else if (data.tipo === 'video') {
        contenido += `<video src="${data.ruta}" controls style="max-width: 100%; height: auto;"></video>`;
    }

    publicaciones.innerHTML += contenido;
    publicaciones.scrollTop = publicaciones.scrollHeight;
});

async function enviarPublicacion() {
    const inputTexto = document.getElementById('texto');
    const inputArchivo = document.getElementById('archivo');
    const texto = inputTexto.value.trim();
    const archivo = inputArchivo.files[0];

    if (texto || archivo) {
        if (archivo) {
            const formData = new FormData();
            formData.append('file', archivo);

            const respuesta = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
            const data = await respuesta.json();
            const ruta = data.filePath;
            const tipo = archivo.type.startsWith('image') ? 'imagen' : 'video';

            socket.emit('publicacion', { texto, ruta, tipo });
        } else {
            socket.emit('publicacion', { texto });
        }

        inputTexto.value = '';
        inputArchivo.value = '';
    }
}
