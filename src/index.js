require("./styles/main.scss");

// Объект с конфигурацией для каждого типа погоды
const WEATHER_CONFIG = {
  summer: {
    // Путь к аудиофайлу лета
    audio: "./assets/sounds/summer.mp3",
    // Путь к фоновому изображению
    background: "./assets/summer-bg.jpg",
  },
  rainy: {
    // Путь к аудиофайлу дождя
    audio: "./assets/sounds/rain.mp3",
    // Путь к фоновому изображению
    background: "./assets/rainy-bg.jpg",
  },
  winter: {
    // Путь к аудиофайлу зимы
    audio: "./assets/sounds/winter.mp3",
    // Путь к фоновому изображению
    background: "./assets/winter-bg.jpg",
  },
};

// Текущее состояние приложения
let currentWeather = null; // Текущая выбранная погода
let isPlaying = false; // Состояние воспроизведения (играет/на паузе)
let currentAudio = null; // Текущий аудиообъект

// Все карточки погоды
const weatherCards = document.querySelectorAll(".weather-card");

// Ползунок громкости
const volumeSlider = document.getElementById("volume-slider");

// Отображение значения громкости
const volumeValue = document.querySelector(".volume-value");

/**
 * Останавливает текущее воспроизведение
 * - Останавливает аудио
 * - Очищает ссылку на текущий аудиообъект
 */
function stopCurrentAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

/**
 * Ставит аудио на паузу
 */
function pauseAudio() {
  if (currentAudio) {
    currentAudio.pause();
    isPlaying = false;
  }
}

/**
 * Возобновляет воспроизведение с паузы
 */
function resumeAudio() {
  if (currentAudio) {
    currentAudio.play();
    isPlaying = true;
  }
}

/**
 * Запускает воспроизведение для выбранной погоды
 * @param {string} weather - Тип погоды (summer, rainy, winter)
 */
function playAudio(weather) {
  // Останавливаем предыдущее аудио (если есть)
  stopCurrentAudio();

  // Создаём новый аудиообъект
  currentAudio = new Audio(WEATHER_CONFIG[weather].audio);

  // Устанавливаем громкость
  currentAudio.volume = volumeSlider.value / 100;

  // Запускаем воспроизведение
  currentAudio.play();
  isPlaying = true;
}

// ==========================================
// ФУНКЦИИ УПРАВЛЕНИЯ ИНТЕРФЕЙСОМ
// ==========================================

/**
 * Устанавливает фоновое изображение для страницы с размытием
 * @param {string} weather - Тип погоды
 */
function setBackground(weather) {
  const body = document.body;
  const backgroundUrl = WEATHER_CONFIG[weather].background;

  // Добавляем класс для активации фона
  body.classList.add("has-background");

  // Создаём стиль для динамического фона
  const style = document.createElement("style");
  style.id = "dynamic-bg-style";
  style.textContent = `
        body.has-background::before {
            background-image: url(${backgroundUrl}) !important;
        }
    `;

  // Удаляем старые стили фона и добавляем новый
  const existingStyle = document.getElementById("dynamic-bg-style");
  if (existingStyle) {
    existingStyle.remove();
  }
  document.head.appendChild(style);
}

/**
 * Обновляет визуальное состояние карточек
 * @param {string} weather - Тип погоды
 * @param {boolean} paused - Состояние паузы
 */
function updateCardsState(weather, paused = false) {
  // Сбрасываем все карточки
  weatherCards.forEach((card) => {
    card.classList.remove("active", "paused");
  });

  // Если погода выбрана, активируем соответствующую карточку
  if (weather) {
    const activeCard = document.querySelector(`[data-weather="${weather}"]`);
    if (activeCard) {
      activeCard.classList.add("active");
      if (paused) {
        activeCard.classList.add("paused");
      }
    }
  }
}

/**
 * Обработчик клика по карточке погоды
 * @param {Event} event - Событие клика
 */
function handleCardClick(event) {
  // Находим ближайшую карточку (если клик по иконке внутри)
  const card = event.currentTarget;
  const weather = card.dataset.weather;

  // Если кликнули по уже активной карточке
  if (currentWeather === weather) {
    if (isPlaying) {
      // Ставим на паузу
      pauseAudio();
      updateCardsState(weather, true);
    } else {
      // Возобновляем воспроизведение
      resumeAudio();
      updateCardsState(weather, false);
    }
  } else {
    // Выбираем новую погоду
    currentWeather = weather;
    playAudio(weather);
    setBackground(weather);
    updateCardsState(weather, false);
  }
}

/**
 * Обработчик изменения громкости
 * @param {Event} event - Событие input
 */
function handleVolumeChange(event) {
  const value = event.target.value;

  // Обновляем отображение значения
  volumeValue.textContent = `${value}%`;

  // Обновляем громкость текущего аудио
  if (currentAudio) {
    currentAudio.volume = value / 100;
  }
}

// Навешиваем обработчики на карточки
weatherCards.forEach((card) => {
  card.addEventListener("click", handleCardClick);
});

// Навешиваем обработчик на ползунок громкости
volumeSlider.addEventListener("input", handleVolumeChange);
