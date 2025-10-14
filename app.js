app.js 


const contImagenCancion = document.getElementById('imagen_cancion');
const portada = document.getElementById('portada');
const infoCancion = document.getElementById('info_cancion');
const tituloCancion = document.getElementById('titulo');
const artistaCancion = document.getElementById('artista');
const barraProgreso = document.getElementById('barra_progreso');
const inicioCancion = document.getElementById('inicio');
const progresoCancion = document.getElementById('progreso');
const finalCancion = document.getElementById('final');
const btnRepetir = document.getElementById('btn_repetir2');
const btnAtras = document.getElementById('btn_atras');
const btnPlay = document.getElementById('btn_play');
const btnAdelante = document.getElementById('btn_adelante');

let indiceActual = 0; /*Índice de la canción actual */
let canciones = [];   /*Arreglo donde se guardan todas las canciones del JSON*/
let audio = new Audio(); /*Elemento de audio que reproducirá la canción*/
let reproduciendo = false; /*Estado del reproductor (true = sonando, false = pausado)*/

/*CARGA DE DATOS DESDE EL ARCHIVO JSON*/
document.addEventListener('DOMContentLoaded', () => {
    fetch('canciones.json')
        .then(response => response.json())
        .then(data => {
            canciones = data; /*Se guardan las canciones obtenidas del archivo JSON */
            mostrarCancion(indiceActual); /*Se muestra la primera canción*/
        })
        .catch(error => {
            console.log('Error al cargar las canciones:', error);
        });
});

/*FUNCIÓN PARA MOSTRAR LA CANCIÓN ACTUAL*/
function mostrarCancion(indice) {
    const cancion = canciones[indice];
    portada.setAttribute('src', cancion.caratula);
    tituloCancion.textContent = cancion.nombre;
    artistaCancion.textContent = cancion.artista;
    finalCancion.textContent = cancion.duracion;

    /*Se actualiza el objeto de audio con la canción seleccionada*/
    audio.src = cancion.cancion;

    /*Si estaba reproduciendo, se inicia automáticamente la nueva */
    if (reproduciendo) {
        audio.play();
    }
}

/*BOTÓN ADELANTAR → PASA A LA SIGUIENTE CANCIÓN-*/
btnAdelante.addEventListener('click', () => {
    if (indiceActual === canciones.length - 1) {
        indiceActual = 0; /* Si está en la última, vuelve a la primera*/
    } else {
        indiceActual++;
    }
    mostrarCancion(indiceActual);
});

/*BOTÓN ATRASAR ← RETROCEDE A LA CANCIÓN ANTERIOR*/
btnAtras.addEventListener('click', () => {
    if (indiceActual === 0) {
        indiceActual = canciones.length - 1; /* Si está en la primera, va a la última*/
    } else {
        indiceActual--;
    }
    mostrarCancion(indiceActual);
});

/*BOTÓN PLAY / PAUSA*/
btnPlay.addEventListener('click', () => {
    if (!reproduciendo) {
        /*Si no está reproduciendo, se inicia*/
        audio.play();
        reproduciendo = true;
        btnPlay.textContent = '⏸️'; /*Cambia ícono a pausa*/
    } else {
        /*Si ya está reproduciendo, se pausa*/
        audio.pause();
        reproduciendo = false;
        btnPlay.textContent = '▶️'; /*Cambia ícono a play*/
    }
});

/*ACTUALIZAR LA BARRA DE PROGRESO MIENTRAS SUENA*/
audio.addEventListener('timeupdate', () => {
    /*Calcula el porcentaje de progreso*/
    const progreso = (audio.currentTime / audio.duration) * 100;
    progresoCancion.value = progreso || 0;

    /*Actualiza el tiempo actual (min:seg)*/
    inicioCancion.textContent = formatearTiempo(audio.currentTime);
});

/*PERMITE ADELANTAR O RETROCEDER DESDE LA BARRA*/
progresoCancion.addEventListener('input', () => {
    /*Cambia el tiempo del audio según la posición del input*/
    const nuevoTiempo = (progresoCancion.value / 100) * audio.duration;
    audio.currentTime = nuevoTiempo;
});

/*BOTÓN REPETIR (ACTIVA / DESACTIVA REPETICIÓN)*/
btnRepetir.addEventListener('click', () => {
    /* Cambia el estado de repetición*/
    audio.loop = !audio.loop;
    if (audio.loop) {
        btnRepetir.style.color = 'gold'; /*Color activo */
    } else {
        btnRepetir.style.color = 'white'; /*Color normal*/
    }
});

/*CUANDO TERMINA UNA CANCIÓN, PASA AUTOMÁTICAMENTE*/
audio.addEventListener('ended', () => {
    if (!audio.loop) {
        if (indiceActual === canciones.length - 1) {
            indiceActual = 0;
        } else {
            indiceActual++;
        }
        mostrarCancion(indiceActual);
        audio.play();
    }
});

/*FUNCIÓN PARA FORMATEAR EL TIEMPO (min:seg)*/
function formatearTiempo(segundos) {
    const min = Math.floor(segundos / 60);
    const seg = Math.floor(segundos % 60);
    return `${min}:${seg < 10 ? '0' + seg : seg}`;
}