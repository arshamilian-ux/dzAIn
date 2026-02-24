// === Состояние приложения ===
let currentScene = "cafe";
let currentLoopIndex = 0; // индекс варианта внутри сцены
let isPlaying = false;
let timerSeconds = 0;
let timerInterval = null;

// Аудио-объект
const audio = new Audio();
audio.loop = true;  // Зацикливаем воспроизведение
audio.volume = 0.5; // Начальная громкость 50%

// === Карта сцен и вариантов лупов ===
// Для начала можно положить по 2 файла на сцену:
// audio/cafe_1.mp3, audio/cafe_2.mp3 и т.д.
const scenes = {
    cafe: [
        "audio/cafe_1.mp3",
        "audio/cafe_2.mp3"
    ],
    office: [
        "audio/office_1.mp3",
        "audio/office_2.mp3"
    ],
    library: [
        "audio/library_1.mp3",
        "audio/library_2.mp3"
    ]
};

// === Элементы интерфейса ===
const playBtn = document.getElementById("playBtn");
const volumeSlider = document.getElementById("volumeSlider");
const timerDisplay = document.getElementById("timerDisplay");
const sceneBtns = document.querySelectorAll(".scene-btn");
const nextLoopBtn = document.getElementById("nextLoopBtn");
const loopLabel = document.getElementById("loopLabel");

// Установить подпись "Вариант N" для текущего лупа
function updateLoopLabel() {
    const humanIndex = currentLoopIndex + 1;
    loopLabel.textContent = `Вариант ${humanIndex}`;
}

// Получить текущий файл по сцене и индексу
function getCurrentAudioSrc() {
    const sceneLoops = scenes[currentScene];
    return sceneLoops[currentLoopIndex % sceneLoops.length];
}

// === Выбор сцены ===
sceneBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // Убираем active у всех кнопок
        sceneBtns.forEach(b => b.classList.remove("active"));
        // Ставим active на нажатую
        btn.classList.add("active");

        // Меняем сцену и сбрасываем индекс варианта
        currentScene = btn.dataset.scene;
        currentLoopIndex = 0;
        updateLoopLabel();

        // Если уже играет — переключаем звук
        if (isPlaying) {
            audio.src = getCurrentAudioSrc();
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
        audio.src = getCurrentAudioSrc();
        audio.play();
        playBtn.textContent = "⏸ Pause";
        playBtn.classList.add("playing");
        startTimer();
    }
    isPlaying = !isPlaying;
});

// === Переключение варианта лупа внутри сцены ===
nextLoopBtn.addEventListener("click", () => {
    const sceneLoops = scenes[currentScene];
    if (!sceneLoops || sceneLoops.length === 0) return;

    // Переходим к следующему варианту
    currentLoopIndex = (currentLoopIndex + 1) % sceneLoops.length;
    updateLoopLabel();

    // Если играет — сразу переключаем источник и продолжаем
    if (isPlaying) {
        const currentTime = audio.currentTime; // можно игнорировать, т.к. у нас loop
        audio.src = getCurrentAudioSrc();
        audio.currentTime = 0;
        audio.play();
    }
});

// === Громкость ===
volumeSlider.addEventListener("input", (e) => {
    audio.volume = e.target.value / 100;
});

// === Таймер (считает время работы) ===
function startTimer() {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
        timerSeconds++;
        timerDisplay.textContent = formatTime(timerSeconds);
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function formatTime(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return [h, m, s].map(v => String(v).padStart(2, "0")).join(":");
}

// Инициализация подписи при загрузке страницы
updateLoopLabel();
