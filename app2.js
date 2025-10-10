// Esperamos a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {
  // 🎶 Referencias a los elementos del DOM
  const audio = document.getElementById('audio'); // Elemento <audio>
  const playPauseBtn = document.getElementById('play-pause'); // Botón play/pause
  const prevBtn = document.getElementById('prev'); // Botón anterior
  const nextBtn = document.getElementById('next'); // Botón siguiente
  const repeatBtn = document.getElementById('repeat'); // Botón de repetir
  const progress = document.getElementById('progress'); // Barra de progreso
  const currentTimeEl = document.getElementById('current-time'); // Tiempo actual
  const totalTimeEl = document.getElementById('total-time'); // Tiempo total
  const coverImg = document.getElementById('cover'); // Imagen del álbum
  const titleEl = document.getElementById('title'); // Título de la canción
  const artistEl = document.getElementById('artist'); // Artista

  let songs = []; // Arreglo donde guardaremos las canciones del JSON
  let currentSongIndex = 0; // Índice de la canción actual
  let isRepeating = false; // Controla si la canción se repite

  // 📦 Cargar las canciones desde songs.json
  fetch('songs.json')
    .then(response => response.json())
    .then(data => {
      songs = data;
      loadSong(songs[currentSongIndex]); // Cargar la primera canción al inicio
    })
    .catch(error => console.error('Error al cargar las canciones:', error));

  // 🎧 Función que carga una canción en el reproductor
  function loadSong(song) {
    titleEl.textContent = song.title; // Muestra el título
    artistEl.textContent = song.artist; // Muestra el artista
    coverImg.src = song.cover; // Cambia la portada
    audio.src = song.src; // Asigna el archivo de audio
  }

  // ▶️ Función para reproducir la canción
  function playSong() {
    audio.play();
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>'; // Cambia icono a pausa
  }

  // ⏸️ Función para pausar la canción
  function pauseSong() {
    audio.pause();
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>'; // Cambia icono a play
  }

  // 🔁 Alternar entre reproducir/pausar
  playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
      playSong();
    } else {
      pauseSong();
    }
  });

  // ⏭️ Pasar a la siguiente canción
  nextBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(songs[currentSongIndex]);
    playSong();
  });

  // ⏮️ Regresar a la canción anterior
  prevBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(songs[currentSongIndex]);
    playSong();
  });

  // 🔁 Activar/desactivar modo repetir
  repeatBtn.addEventListener('click', () => {
    isRepeating = !isRepeating;
    repeatBtn.classList.toggle('active', isRepeating); // Añade clase visual
  });

  // 🎶 Si termina una canción
  audio.addEventListener('ended', () => {
    if (isRepeating) {
      playSong(); // Repetir la misma canción
    } else {
      currentSongIndex = (currentSongIndex + 1) % songs.length;
      loadSong(songs[currentSongIndex]);
      playSong();
    }
  });

  // 📊 Actualizar la barra de progreso y el tiempo
  audio.addEventListener('timeupdate', () => {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progress.value = progressPercent || 0; // Controla el llenado del input range
    updateTimes();
  });

  // ⏩ Permite cambiar el progreso al arrastrar la barra
  progress.addEventListener('input', () => {
    audio.currentTime = (progress.value / 100) * audio.duration;
  });

  // ⏱️ Mostrar el tiempo actual y total del audio
  function updateTimes() {
    const currentMinutes = Math.floor(audio.currentTime / 60) || 0;
    const currentSeconds = Math.floor(audio.currentTime % 60) || 0;
    const durationMinutes = Math.floor(audio.duration / 60) || 0;
    const durationSeconds = Math.floor(audio.duration % 60) || 0;

    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds
      .toString()
      .padStart(2, '0')}`;
    totalTimeEl.textContent = `${durationMinutes}:${durationSeconds
      .toString()
      .padStart(2, '0')}`;
  }
});
