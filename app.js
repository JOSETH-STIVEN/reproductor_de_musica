const portada = document.getElementById('portada');
const tituloCancion = document.getElementById('titulo');
const artistaCancion = document.getElementById('artista');
const inicioCancion = document.getElementById('inicio');
const progresoCancion = document.getElementById('progreso');
const finalCancion = document.getElementById('final');
const btnRepetir = document.getElementById('btn_repetir2');
const btnAtras = document.getElementById('btn_atras');
const btnPlay = document.getElementById('btn_play');
const btnAdelante = document.getElementById('btn_adelante');
const btnLista = document.getElementById('btn_lista');
const menuLateral = document.getElementById('menu_lateral');
const listaLateral = document.getElementById('lista_lateral');

let indiceActual = 0;
let canciones = [];
let audio = new Audio();
let reproduciendo = false;

document.addEventListener('DOMContentLoaded', () => {
    fetch('songs.json')
        .then(response => response.json())
        .then(data => {
            canciones = data;
            mostrarCancion(indiceActual);
            cargarListaLateral();
        })
        .catch(error => console.log('Error al cargar las canciones:', error));
});

function mostrarCancion(indice) {
    const cancion = canciones[indice];
    portada.src = cancion.caratula;
    tituloCancion.textContent = cancion.nombre;
    artistaCancion.textContent = cancion.artista;
    finalCancion.textContent = cancion.duracion;
    audio.src = cancion.cancion;
    if (reproduciendo) audio.play();
}

function cargarListaLateral() {
    listaLateral.innerHTML = "";
    canciones.forEach((cancion, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${cancion.caratula}" alt="Carátula">
            <div class="info">
                <p class="nombre">${cancion.nombre}</p>
                <p class="artista">${cancion.artista}</p>
            </div>
        `;
        li.addEventListener('click', () => {
            indiceActual = index;
            mostrarCancion(indiceActual);
            audio.play();
            reproduciendo = true;
            btnPlay.textContent = '⏸️';
        });
        listaLateral.appendChild(li);
    });
}

// Mostrar / ocultar el menú lateral
btnLista.addEventListener('click', () => {
    menuLateral.classList.toggle('visible');
});

btnAdelante.addEventListener('click', () => {
    indiceActual = (indiceActual + 1) % canciones.length;
    mostrarCancion(indiceActual);
    if (reproduciendo) audio.play();
});

btnAtras.addEventListener('click', () => {
    indiceActual = (indiceActual - 1 + canciones.length) % canciones.length;
    mostrarCancion(indiceActual);
    if (reproduciendo) audio.play();
});

btnPlay.addEventListener('click', () => {
    if (!reproduciendo) {
        audio.play();
        reproduciendo = true;
        btnPlay.textContent = '⏸️';
    } else {
        audio.pause();
        reproduciendo = false;
        btnPlay.textContent = '▶️';
    }
});

audio.addEventListener('timeupdate', () => {
    const progreso = (audio.currentTime / audio.duration) * 100;
    progresoCancion.value = progreso || 0;
    inicioCancion.textContent = formatearTiempo(audio.currentTime);
});

progresoCancion.addEventListener('input', () => {
    const nuevoTiempo = (progresoCancion.value / 100) * audio.duration;
    audio.currentTime = nuevoTiempo;
});

btnRepetir.addEventListener('click', () => {
    audio.loop = !audio.loop;
    btnRepetir.style.color = audio.loop ? 'gold' : 'white';
});

audio.addEventListener('ended', () => {
    if (!audio.loop) {
        indiceActual = (indiceActual + 1) % canciones.length;
        mostrarCancion(indiceActual);
        audio.play();
    }
});

function formatearTiempo(segundos) {
    const min = Math.floor(segundos / 60);
    const seg = Math.floor(segundos % 60);
    return `${min}:${seg < 10 ? '0' + seg : seg}`;
}
