// === Состояние приложения ===
let currentScene = "cafe";
let isPlaying = false;
let timerSeconds = 0;
let timerInterval = null;

// Аудио-объект
const audio = new Audio();
audio.loop = true;  // Зацикливаем воспроизведение
audio.volume = 0.5; // Начальная громкость 50%

// Маппинг сцен на файлы
const scenes = {
    cafe:    "audio/cafe.mp3",
    office:  "audio/office.mp3",
    library: "audio/library.mp3"
};

// === Элементы интерфейса ===
const playBtn = document.getElementById("playBtn");
const volumeSlider = document.getElementById("volumeSlider");
const timerDisplay = document.getElementById("timerDisplay");
const sceneBtns = document.querySelectorAll(".scene-btn");

// === Выбор сцены ===
sceneBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // Убираем active у всех кнопок
        sceneBtns.forEach(b => b.classList.remove("active"));
        // Ставим active на нажатую
        btn.classList.add("active");

        // Меняем сцену
        currentScene = btn.dataset.scene;

        // Если уже играет — переключаем звук
        if (isPlaying) {
            audio.src = scenes[currentScene];
            audio.play();
        }
    });
});

// === Play / Pause ===
playBtn.addEventListener("click", () => {
    if (isPlaying) {
        // Пауза
        audio.pause();
        playBtn.textContent = "▶ Play";
        playBtn.classList.remove("playing");
        stopTimer();
    } else {
        // Воспроизведение
        audio.src = scenes[currentScene];
        audio.play();
        playBtn.textContent = "⏸ Pause";
        playBtn.classList.add("playing");
        startTimer();
    }
    isPlaying = !isPlaying;
});

// === Громкость ===
volumeSlider.addEventListener("input", (e) => {
    audio.volume = e.target.value / 100;
});

// === Таймер (считает время работы) ===
function startTimer() {
    timerInterval = setInterval(() => {
        timerSeconds++;
        timerDisplay.textContent = formatTime(timerSeconds);
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function formatTime(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return [h, m, s].map(v => String(v).padStart(2, "0")).join(":");
}