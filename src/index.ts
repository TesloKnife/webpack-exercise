import "./styles/main.scss";

type WeatherType = "summer" | "rainy" | "winter";

interface WeatherConfig {
	audio: string;
	background: string;
}

// Объект с конфигурацией для каждого типа погоды
const WEATHER_CONFIG: Record<WeatherType, WeatherConfig> = {
	summer: {
		audio: "./assets/sounds/summer.mp3",
		background: "./assets/summer-bg.jpg",
	},
	rainy: {
		audio: "./assets/sounds/rain.mp3",
		background: "./assets/rainy-bg.jpg",
	},
	winter: {
		audio: "./assets/sounds/winter.mp3",
		background: "./assets/winter-bg.jpg",
	},
};

// Текущее состояние приложения
let currentWeather: WeatherType | null = null;
let isPlaying: boolean = false;
let currentAudio: HTMLAudioElement | null = null;

const weatherCards = document.querySelectorAll<HTMLElement>(".weather-card");

const volumeSlider = document.getElementById(
	"volume-slider",
) as HTMLInputElement;

const volumeValue = document.querySelector<HTMLElement>(".volume-value");

/**
 * Останавливает текущее воспроизведение
 * - Останавливает аудио
 * - Очищает ссылку на текущий аудиообъект
 */
function stopCurrentAudio(): void {
	if (currentAudio) {
		currentAudio.pause();
		currentAudio.currentTime = 0;
		currentAudio = null;
	}
}

/**
 * Ставит аудио на паузу
 */
function pauseAudio(): void {
	if (currentAudio) {
		currentAudio.pause();
		isPlaying = false;
	}
}

/**
 * Возобновляет воспроизведение с паузы
 */
function resumeAudio(): void {
	if (currentAudio) {
		currentAudio.play();
		isPlaying = true;
	}
}

// Запускает воспроизведение для выбранной погоды
function playAudio(weather: WeatherType): void {
	stopCurrentAudio();

	currentAudio = new Audio(WEATHER_CONFIG[weather].audio);
	currentAudio.volume = Number(volumeSlider.value) / 100;

	currentAudio.play();
	isPlaying = true;
}

// ==========================================
// ФУНКЦИИ УПРАВЛЕНИЯ ИНТЕРФЕЙСОМ
// ==========================================

function setBackground(weather: WeatherType): void {
	const body = document.body;
	const backgroundUrl = WEATHER_CONFIG[weather].background;

	body.classList.add("has-background");

	const style = document.createElement("style");
	style.id = "dynamic-bg-style";
	style.textContent = `
        body.has-background::before {
            background-image: url(${backgroundUrl}) !important;
        }
    `;

	const existingStyle = document.getElementById("dynamic-bg-style");
	if (existingStyle) {
		existingStyle.remove();
	}
	document.head.appendChild(style);
}

function updateCardsState(
	weather: WeatherType | null,
	paused: boolean = false,
): void {
	weatherCards.forEach((card) => {
		card.classList.remove("active", "paused");
	});

	if (weather) {
		const activeCard = document.querySelector<HTMLElement>(
			`[data-weather="${weather}"]`,
		);
		if (activeCard) {
			activeCard.classList.add("active");
			if (paused) {
				activeCard.classList.add("paused");
			}
		}
	}
}

function handleCardClick(event: Event): void {
	const card = event.currentTarget as HTMLElement;

	const weather = card.dataset.weather as WeatherType;

	if (currentWeather === weather) {
		if (isPlaying) {
			pauseAudio();
			updateCardsState(weather, true);
		} else {
			resumeAudio();
			updateCardsState(weather, false);
		}
	} else {
		currentWeather = weather;
		playAudio(weather);
		setBackground(weather);
		updateCardsState(weather, false);
	}
}

function handleVolumeChange(event: Event): void {
	const input = event.target as HTMLInputElement;
	const value = input.value;

	if (volumeValue) {
		volumeValue.textContent = `${value}%`;
	}

	if (currentAudio) {
		currentAudio.volume = Number(value) / 100;
	}
}

// --- Инициализация ---

weatherCards.forEach((card) => {
	card.addEventListener("click", handleCardClick);
});

volumeSlider.addEventListener("input", handleVolumeChange);
