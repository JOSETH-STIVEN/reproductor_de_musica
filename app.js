// ==== app.js ====
// Reproductor de música dinámico con carga de canciones desde un JSON (songs.json)
// Ahora usa íconos de Font Awesome 🎨

// Variables globales
let songs = [];               // Aquí se almacenan todas las canciones cargadas del JSON
let currentSongIndex = 0;     // Canción actual
let isPlaying = false;        // Estado de reproducción (true = sonando)
let repeatMode = false;       // Estado del modo repetir
let audio = new Audio();      // Objeto de audio dinámico

// ==== 1️⃣ ESPERAR A QUE CARGUE EL DOCUMENTO ====
// Cuando todo el HTML haya cargado, buscamos el archivo JSON
document.addEventListener('DOMContentLoaded', () => {
  fetch("songs.json")
    .then(response => response.json())
    .then(data => {
      songs = data;          // Guardamos las canciones del archivo
      createPlayerUI();      // Creamos el reproductor en el DOM
      loadSong(0);           // Cargamos la primera canción
    })
    .catch(error => {
      console.log("Error al cargar songs.json:", error);
    });
});

// ==== 2️⃣ CREAR TODA LA INTERFAZ DEL REPRODUCTOR ====
function createPlayerUI() {
  const container = document.createElement("div");
  container.classList.add("player");

  // Imagen del álbum 🎨
  const albumArt = document.createElement("div");
  albumArt.classList.add("album-art");
  const img = document.createElement("img");
  albumArt.appendChild(img);

  // Información de la canción 🎶
  const title = document.createElement("h2");
  title.classList.add("song-title");

  const artist = document.createElement("p");
  artist.classList.add("artist-name");

  // Barra de progreso 📊
  const progressContainer = document.createElement("div");
  progressContainer.id = "progressBar";
  progressContainer.classList.add("progress-bar-custom");

  const progressFill = document.createElement("div");
  progressFill.id = "progressFill";
  progressFill.classList.add("progress-fill");

  progressContainer.appendChild(progressFill);

  // Tiempos ⏱️
  const timeContainer = document.createElement("div");
  timeContainer.classList.add("time-display");

  const currentTime = document.createElement("span");
  currentTime.id = "currentTime";
  currentTime.textContent = "00:00";

  const totalTime = document.createElement("span");
  totalTime.id = "totalTime";
  totalTime.textContent = "-00:00";

  timeContainer.append(currentTime, totalTime);

  // Controles principales 🎛️
  const controls = document.createElement("div");
  controls.classList.add("controls", "d-flex", "justify-content-center", "align-items-center", "gap-4", "py-4");

  // Botones con íconos de Font Awesome
  const prevBtn = document.createElement("button");
  prevBtn.id = "prevBtn";
  prevBtn.classList.add("control-btn");
  prevBtn.innerHTML = '<i class="fas fa-step-backward"></i>';

  const playPauseBtn = document.createElement("button");
  playPauseBtn.id = "playPauseBtn";
  playPauseBtn.classList.add("play-pause-btn", "d-flex", "align-items-center", "justify-content-center");
  playPauseBtn.innerHTML = '<i class="fas fa-play" id="playIcon"></i>';

  const nextBtn = document.createElement("button");
  nextBtn.id = "nextBtn";
  nextBtn.classList.add("control-btn");
  nextBtn.innerHTML = '<i class="fas fa-step-forward"></i>';

  const repeatBtn = document.createElement("button");
  repeatBtn.id = "repeatBtn";
  repeatBtn.classList.add("control-btn");
  repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';

  // Agregar botones al contenedor
  controls.append(prevBtn, playPauseBtn, nextBtn, repeatBtn);

  // Insertar todo al contenedor principal
  container.append(albumArt, title, artist, progressContainer, timeContainer, controls);
  document.body.appendChild(container);

  // ==== Eventos de los botones ====
  playPauseBtn.addEventListener("click", togglePlayPause);
  nextBtn.addEventListener("click", nextSong);
  prevBtn.addEventListener("click", prevSong);
  repeatBtn.addEventListener("click", toggleRepeat);
  progressContainer.addEventListener("click", setProgress);
}

// ==== 3️⃣ CARGAR UNA CANCIÓN DEL JSON ====
function loadSong(index) {
  const song = songs[index];
  if (!song) return;

  document.querySelector(".song-title").textContent = song.title;
  document.querySelector(".artist-name").textContent = song.artist;
  document.querySelector(".album-art img").src = song.cover;

  audio.src = song.src;
  audio.load();
}

// ==== 4️⃣ FUNCIONES DE CONTROL ====
function playSong() {
  audio.play();
  isPlaying = true;
  document.getElementById("playIcon").classList.replace("fa-play", "fa-pause");
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  document.getElementById("playIcon").classList.replace("fa-pause", "fa-play");
}

function togglePlayPause() {
  if (isPlaying) pauseSong();
  else playSong();
}

function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  if (isPlaying) playSong();
}

function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
  if (isPlaying) playSong();
}

function toggleRepeat() {
  repeatMode = !repeatMode;
  audio.loop = repeatMode;
  document.getElementById("repeatBtn").style.opacity = repeatMode ? "1" : "0.5";
}

// ==== 5️⃣ BARRA DE PROGRESO Y TIEMPO ====
audio.addEventListener("timeupdate", () => {
  const progress = (audio.currentTime / audio.duration) * 100;
  document.getElementById("progressFill").style.width = `${progress}%`;

  document.getElementById("currentTime").textContent = formatTime(audio.currentTime);
  document.getElementById("totalTime").textContent =
    "-" + formatTime(audio.duration - audio.currentTime);
});

// Permite adelantar la canción al hacer clic en la barra
function setProgress(e) {
  const width = e.currentTarget.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
}

// Formatear el tiempo (segundos → mm:ss)
function formatTime(time) {
  if (isNaN(time)) return "00:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// ==== 6️⃣ CUANDO TERMINA LA CANCIÓN ====
audio.addEventListener("ended", () => {
  if (repeatMode) playSong();
  else nextSong();
});
