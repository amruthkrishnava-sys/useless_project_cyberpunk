const STORAGE_KEY = "Do Nothing!-waste-session";
const timerElement = document.querySelector("#timer");
const todayTimeElement = document.querySelector("#todayTime");
const pauseButton = document.querySelector("#pauseButton");
const pauseLabel = document.querySelector("#pauseLabel");
const pauseIcon = document.querySelector("#pauseIcon");
const statusText = document.querySelector("#statusText");
const rankElement = document.querySelector("#rank");
const confessButton = document.querySelector("#confessButton");
const endSessionButton = document.querySelector("#endSessionButton");
const levelElement = document.querySelector("#level");
const questProgress = document.querySelector("#questProgress");
const questCount = document.querySelector("#questCount");
const xpValue = document.querySelector("#xpValue");
const achievementGrid = document.querySelector("#achievementGrid");
const collectionCount = document.querySelector("#collectionCount");
const shootButton = document.querySelector("#shootButton");
const court = document.querySelector("#court");
const ball = document.querySelector("#ball");
const particles = document.querySelector("#particles");
const gameScore = document.querySelector("#gameScore");
const gameStatus = document.querySelector("#gameStatus");
const exitModal = document.querySelector("#exitModal");
const exitButton = document.querySelector("#continueButton");
let exitUnlockTimer;
const analysisModal = document.querySelector("#analysisModal");
const analysisMessage = document.querySelector("#analysisMessage");
const analysisStatus = document.querySelector("#analysisStatus");
const warningModal = document.querySelector("#warningModal");
const warningNumber = document.querySelector("#warningNumber");
const warningTitle = document.querySelector("#warningTitle");
const warningMessage = document.querySelector("#warningMessage");
const toast = document.querySelector("#toast");
const openArcadeButton = document.querySelector("#openArcadeButton");
const gameWindow = document.querySelector("#gameWindow");
const basketballStage = document.querySelector("#basketballStage");
const cloudStage = document.querySelector("#cloudStage");
const cloudSky = document.querySelector("#cloudSky");
const sunGlow = document.querySelector(".sun-glow");
const celestialBody = document.querySelector("#celestialBody");
const weatherMode = document.querySelector("#weatherMode");
const weatherDescription = document.querySelector("#weatherDescription");
const skyStatus = document.querySelector("#skyStatus");
const forecastClock = document.querySelector("#forecastClock");
const hourlyForecast = document.querySelector("#hourlyForecast");
const weeklyForecast = document.querySelector("#weeklyForecast");
const loadingStage = document.querySelector("#loadingStage");
const trajectory = document.querySelector("#trajectory");
const aimControl = document.querySelector("#aimControl");
const powerControl = document.querySelector("#powerControl");
const aimValue = document.querySelector("#aimValue");
const powerValue = document.querySelector("#powerValue");
const openTorchButton = document.querySelector("#openTorchButton");
const closeTorchButton = document.querySelector("#closeTorchButton");
const torchWindow = document.querySelector("#torchWindow");
const torchButton = document.querySelector("#torchButton");
const torchScene = document.querySelector("#torchScene");
const torchStatus = document.querySelector("#torchStatus");
const torchBattery = document.querySelector("#torchBattery");
const torchBrightness = document.querySelector("#torchBrightness");

const achievements = [
  ["01", "Time well wasted", "30 seconds of nothing", 30, "+100 XP"],
  ["02", "5 min club", "Five minutes vanished", 300, "+250 XP"],
  ["03", "The void stares back", "Ten minutes observed", 600, "+500 XP"],
  ["04", "Professional waster", "Thirty minutes misplaced", 1800, "+1K XP"],
  ["05", "Lunch break legend", "One hour escaped", 3600, "+2K XP"],
  ["06", "Nothing matters", "Two hours dissolved", 7200, "+5K XP"],
  ["07", "Certified Do Nothing!", "The final form", 18000, "+10K XP"],
];

const initialState = {
  elapsed: 0,
  startedAt: Date.now(),
  running: true,
  confessionCount: 0,
  score: 0,
  shots: 0,
  freeWinUsed: false,
};

let state = loadState();
let tickHandle;
let lastRenderedElapsed = currentElapsed();
let torchOn = false;
let pauseWarnings = 0;
let weatherType = "clear";
let nextWeatherChange = 0;
const skyCycleStartedAt = Date.now();

const weatherCatalog = {
  clear: { emoji: "☀️", label: "CLEAR SKIES", description: "Warm light, soft breeze", status: "VISIBILITY: PERFECT" },
  cloudy: { emoji: "☁️", label: "CLOUDY", description: "A ceiling of silver", status: "CLOUD COVER: 62%" },
  rain: { emoji: "🌧️", label: "OCCASIONAL RAIN", description: "Passing showers incoming", status: "UMBRELLA: MAYBE" },
  storm: { emoji: "⛈️", label: "THUNDERSTORM", description: "Electric skies approaching", status: "THUNDER: DISTANT" },
};

const weatherTypes = Object.keys(weatherCatalog);
const hourlyWeather = ["clear", "cloudy", "rain", "clear", "cloudy", "storm", "clear", "rain"];
const weeklyWeather = ["clear", "rain", "cloudy", "storm", "clear", "clear", "rain"];

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved
      ? { ...initialState, ...saved, elapsed: 0, startedAt: Date.now(), running: true, score: 0 }
      : { ...initialState, startedAt: Date.now() };
  } catch {
    return { ...initialState, startedAt: Date.now() };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((unit) => String(unit).padStart(2, "0"))
    .join(":");
}

function currentElapsed() {
  if (!state.running) return state.elapsed;
  return state.elapsed + Math.floor((Date.now() - state.startedAt) / 1000);
}

function stopTracking() {
  if (!state.running) return;
  state.elapsed = currentElapsed();
  state.running = false;
  saveState();
}

function resumeTracking() {
  if (state.running) return;
  state.startedAt = Date.now();
  state.running = true;
  render();
}

function render() {
  const elapsed = currentElapsed();
  const displayTime = formatTime(elapsed);
  const xp = Math.floor(elapsed / 5);
  const questPercent = Math.min(Math.floor((elapsed / 60) * 100), 100);
  const confessionLabel =
    state.confessionCount === 0
      ? "Confess another minute"
      : `You confessed ${state.confessionCount} minute${ state.confessionCount === 1 ? "" : "s" }`;
  timerElement.textContent = displayTime;
  todayTimeElement.textContent = displayTime;
  pauseLabel.textContent = state.running
    ? "Pause the inevitable"
    : "Resume the waste";
  pauseIcon.textContent = state.running ? "Ⅱ" : "▶";
  statusText.textContent = state.running ? "actively wasting" : "waste on hold";
  rankElement.textContent = `# ${( 8492 - Math.min(Math.floor(elapsed / 20), 8470) ).toLocaleString()}`;
  confessButton.innerHTML = `${confessionLabel} <span>→</span>`;
  levelElement.textContent = String(Math.floor(xp / 20) + 1).padStart(2, "0");
  xpValue.textContent = xp;
  questProgress.style.width = `${questPercent}%`;
  questCount.textContent = `${questPercent}%`;

  const unlocked = achievements.filter(
    (achievementData) => elapsed >= achievementData[3]
  ).length;
  collectionCount.textContent = `${unlocked} / 7 UNLOCKED`;
  const arcadeUnlocked = elapsed >= achievements[0][3];
  openArcadeButton.disabled = !arcadeUnlocked;
  openArcadeButton.innerHTML = arcadeUnlocked
    ? "Open arcade <span>↗</span>"
    : "Arcade locked <span>⌁</span>";
  achievementGrid.innerHTML = achievements
    .map(([number, title, description, threshold, reward]) => {
      const isUnlocked = elapsed >= threshold;
      return `<article class="achievement-card ${ isUnlocked ? "unlocked" : "" }"><div class="achievement-icon">${ isUnlocked ? "★" : number }</div><div><span class="stat-label">${ isUnlocked ? "UNLOCKED" : "LOCKED" }</span><h3>${title}</h3><p>${description}</p></div><span class="achievement-reward">${ isUnlocked ? "✓" : reward }</span></article>`;
    })
    .join("");
  gameScore.textContent = state.score;
  if (lastRenderedElapsed < 60 && elapsed >= 60) showGameWindow();
  lastRenderedElapsed = elapsed;
}

function formatForecastHour(hour) {
  return `T+${String(hour % 24).padStart(2, "0")}H`;
}

function renderForecasts(hour, currentWeather) {
  const forecastSequence = [currentWeather, ...hourlyWeather.slice(1)];
  const hourlyMarkup = forecastSequence
    .map((type, index) => {
      const forecast = weatherCatalog[type];
      const temperatureByWeather = { clear: 23, cloudy: 19, rain: 16, storm: 15 };
      const temperature = temperatureByWeather[type] + (index % 3) - 1;
      return `<div class="forecast-card"><strong>${index === 0 ? "NOW" : formatForecastHour(hour + index * 2)}</strong><span>${forecast.emoji}</span><small>${temperature}° / ${forecast.label.split(" ")[0]}</small></div>`;
    })
    .join("");
  const dayNames = ["TODAY", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const weeklyMarkup = weeklyWeather
    .map((type, index) => {
      const forecast = weatherCatalog[type];
      const high = 21 + (index % 4);
      const low = 12 + (index % 3);
      return `<div class="forecast-card"><strong>${dayNames[index]}</strong><span>${forecast.emoji}</span><small>${high}° / ${low}°</small></div>`;
    })
    .join("");
  hourlyForecast.innerHTML = hourlyMarkup;
  weeklyForecast.innerHTML = weeklyMarkup;
}

function chooseWeather() {
  const previousWeather = weatherType;
  do {
    weatherType = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
  } while (weatherType === previousWeather);
  nextWeatherChange = Date.now() + 7000 + Math.random() * 7000;
}

function updateCloudWeather() {
  if (!cloudStage || cloudStage.hidden) return;
  const now = Date.now();
  const acceleratedDay = 12 * 30000;
  const dayProgress = ((now - skyCycleStartedAt) % acceleratedDay) / acceleratedDay;
  const lunarProgress = ((now - skyCycleStartedAt) / acceleratedDay / 29.5) % 1;
  const isNight = dayProgress >= 0.5;
  const arcProgress = isNight ? (dayProgress - 0.5) * 2 : dayProgress * 2;
  const arcX = 8 + arcProgress * 84;
  const arcY = 78 - Math.sin(Math.PI * arcProgress) * 66;
  const forecastHour = Math.floor(dayProgress * 24);
  if (now >= nextWeatherChange) chooseWeather();
  const weather = weatherCatalog[weatherType];
  cloudSky.classList.toggle("night", isNight);
  cloudSky.classList.toggle("rain", weatherType === "rain" || weatherType === "storm");
  cloudSky.classList.toggle("thunderstorm", weatherType === "storm");
  celestialBody.classList.toggle("moon", isNight);
  celestialBody.classList.remove("moon-phase-0", "moon-phase-1", "moon-phase-2", "moon-phase-3", "moon-phase-4", "moon-phase-5", "moon-phase-6", "moon-phase-7");
  celestialBody.classList.add(`moon-phase-${Math.floor(lunarProgress * 8)}`);
  celestialBody.setAttribute("aria-label", isNight ? "Moon" : "Sun");
  celestialBody.style.left = `${arcX}%`;
  celestialBody.style.top = `${arcY}%`;
  sunGlow.style.left = `${arcX}%`;
  sunGlow.style.top = `${arcY}%`;
  sunGlow.classList.toggle("hidden-at-night", isNight);
  weatherMode.textContent = isNight ? "NIGHT WATCH" : weather.label;
  weatherDescription.textContent = isNight ? `Moonrise in ${weather.description.toLowerCase()}` : weather.description;
  skyStatus.textContent = weather.status;
  forecastClock.textContent = `${isNight ? "NIGHT" : "DAY"} / CYCLE ${String(forecastHour).padStart(2, "0")}`;
  renderForecasts(forecastHour, weatherType);
}

function startTicking() {
  clearInterval(tickHandle);
  tickHandle = setInterval(render, 1000);
}

const weatherHandle = setInterval(updateCloudWeather, 250);

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopTracking();
  } else {
    resumeTracking();
  }
});

pauseButton.addEventListener("click", () => {
  pauseWarnings += 1;
  const warnings = [
    "Can't you read, huh? Are you stupid? This is your first warning.",
    "This is your last warning. Stop trying to pause absolutely nothing.",
    "You were warned. Taking action now.",
  ];
  if (pauseWarnings < 3) {
    warningNumber.textContent = String(pauseWarnings).padStart(2, "0");
    warningTitle.innerHTML =
      pauseWarnings === 1
        ? "Stop touching<br><em>the inevitable.</em>"
        : "Final warning.<br><em>Do not press again.</em>";
    warningMessage.textContent = warnings[pauseWarnings - 1];
    warningModal.hidden = false;
    return;
  }
  toast.textContent = warnings[2];
  toast.classList.add("visible");
  try {
    window.close();
  } catch {}
  setTimeout(() => {
    document.querySelector("#exitTitle").innerHTML =
      "Tab terminated.<br><em>Probably.</em>";
    document.querySelector("#finalTime").textContent = formatTime(
      currentElapsed()
    );
    document.querySelector("#finalShots").textContent = state.shots;
    document.querySelector("#finalScore").textContent = "0";
    exitModal.hidden = false;
  }, 500);
});

document.querySelector("#dismissWarning").addEventListener("click", () => {
  warningModal.hidden = true;
});

confessButton.addEventListener("click", () => {
  state.confessionCount += 1;
  saveState();
  render();
});

document.querySelector("#footerDate").textContent = new Intl.DateTimeFormat(
  undefined,
  { dateStyle: "medium" }
).format(new Date());

function showGameWindow() {
  if (currentElapsed() < achievements[0][3]) return;
  gameWindow.hidden = false;
  playSound(520, 0.18, "square");
  toast.textContent = "Achievement unlocked. Arcade window opened.";
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 2600);
}

function makeParticles() {
  particles.innerHTML = Array.from(
    { length: 18 },
    (_, index) => `<i style="--i:${index}"></i>`
  ).join("");
  setTimeout(() => {
    particles.innerHTML = "";
  }, 900);
}

function playSound(frequency, duration = 0.12, type = "sine") {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.05, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + duration
  );
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

function animateBallShot(shotResult) {
  const courtWidth = court.clientWidth;
  const courtHeight = court.clientHeight;
  const ballSize = ball.offsetWidth;
  const start = { x: courtWidth * 0.16, y: 32 };
  const rim = document.querySelector(".rim").getBoundingClientRect();
  const courtBounds = court.getBoundingClientRect();
  const rimCenter = rim.left - courtBounds.left + rim.width / 2;
  const idealPower = 78;
  const target = {
    x:
      rimCenter -
      ballSize / 2 +
      (Number(powerControl.value) - idealPower) * 2.4 +
      (Number(aimControl.value) - 52) * 4,
    y:
      courtHeight - (rim.top - courtBounds.top) - rim.height / 2 - ballSize / 2,
  };
  target.x = Math.max(courtWidth * 0.12, Math.min(courtWidth * 0.88, target.x));
  const apex = Math.min(
    courtHeight - 38,
    target.y + Number(powerControl.value) * 1.35
  );
  const outboundDuration = 760;
  const inboundDuration = 760;
  const startedAt = performance.now();
  let reachedTarget = false;

  function positionBall(x, y) {
    ball.style.left = `${x}px`;
    ball.style.bottom = `${y}px`;
  }

  function frame(now) {
    const elapsed = now - startedAt;
    const outboundProgress = Math.min(elapsed / outboundDuration, 1);
    const returningProgress = Math.max(
      (elapsed - outboundDuration) / inboundDuration,
      0
    );
    if (outboundProgress < 1) {
      const x = start.x + (target.x - start.x) * outboundProgress;
      const arc = 4 * apex * outboundProgress * (1 - outboundProgress);
      const y = start.y + (target.y - start.y) * outboundProgress + arc;
      positionBall(x, y);
      if (outboundProgress > 0.78) trajectory.classList.remove("visible");
    } else if (returningProgress <= 1) {
      const x = target.x + (start.x - target.x) * returningProgress;
      const y =
        target.y +
        (start.y - target.y) * returningProgress +
        4 * apex * returningProgress * (1 - returningProgress);
      positionBall(x, y);
    }
    if (!reachedTarget && outboundProgress >= 1) {
      reachedTarget = true;
      shotResult.onReachTarget();
      if (shotResult.teleportOnMiss) {
        positionBall(start.x, start.y);
        ball.classList.remove("shooting");
        shootButton.disabled = false;
        shotResult.onFinish();
        return;
      }
    }
    if (elapsed < outboundDuration + inboundDuration) {
      requestAnimationFrame(frame);
    } else {
      positionBall(start.x, start.y);
      ball.classList.remove("shooting");
      shootButton.disabled = false;
      shotResult.onFinish();
      render();
    }
  }

  requestAnimationFrame(frame);
}

shootButton.addEventListener("click", () => {
  if (ball.classList.contains("shooting")) return;
  state.shots += 1;
  const aim = Number(aimControl.value);
  const power = Number(powerControl.value);
  const rim = document.querySelector(".rim").getBoundingClientRect();
  const courtBounds = court.getBoundingClientRect();
  const ballSize = ball.offsetWidth;
  const rimLeft = rim.left - courtBounds.left;
  const rimRight = rim.right - courtBounds.left;
  const targetBallLeft =
    rimLeft +
    rim.width / 2 -
    ballSize / 2 +
    (power - 78) * 2.4 +
    (aim - 52) * 4;
  const targetBallCenter = targetBallLeft + ballSize / 2;
  const isBasket =
    targetBallCenter >= rimLeft + ballSize / 2 &&
    targetBallCenter <= rimRight - ballSize / 2;
  ball.classList.add("shooting");
  trajectory.classList.add("visible");
  shootButton.disabled = true;
  gameStatus.textContent = "A triumph is approaching... probably.";
  playSound(240, 0.16, "triangle");
  animateBallShot({
    onReachTarget: () => {
      trajectory.classList.remove("visible");
      if (isBasket) {
        makeParticles();
        state.score += 1;
        gameScore.textContent = state.score;
        playSound(680, 0.22, "square");
        gameStatus.textContent = `Ball inside the ring. Arcade score: ${state.score}.`;
      } else {
        playSound(120, 0.16, "sawtooth");
        gameStatus.textContent = "Missed. The ball is going nowhere.";
      }
    },
    teleportOnMiss: !isBasket,
    onFinish: () => {
      saveState();
      gameScore.textContent = state.score;
      if (isBasket) {
        const nextAim = 47 + Math.floor(Math.random() * 11);
        const nextPower = 70 + Math.floor(Math.random() * 21);
        aimControl.value = nextAim;
        powerControl.value = nextPower;
        aimValue.textContent = `${nextAim}°`;
        powerValue.textContent = `${nextPower}%`;
        gameStatus.textContent = `Ball returned. Arcade score: ${state.score}.`;
      } else {
        gameStatus.textContent = "Missed. Ball teleported back. Try again.";
      }
    },
  });
});

aimControl.addEventListener("input", () => {
  aimValue.textContent = `${aimControl.value}°`;
});
powerControl.addEventListener("input", () => {
  powerValue.textContent = `${powerControl.value}%`;
});
torchButton.addEventListener("click", () => {
  torchOn = !torchOn;
  torchScene.classList.toggle("torch-on", torchOn);
  torchStatus.textContent = torchOn ? "ON / STILL Do Nothing!" : "OFFLINE";
  torchBattery.textContent = torchOn ? "0%" : "0%";
  torchBrightness.textContent = torchOn ? "IMAGINARY" : "NONE";
  torchButton.innerHTML = torchOn
    ? "<span>◉</span> Turn off fake torch"
    : "<span>◉</span> Turn on fake torch";
  playSound(torchOn ? 460 : 180, 0.1, "sine");
});
openTorchButton.addEventListener("click", () => {
  torchWindow.hidden = false;
});
closeTorchButton.addEventListener("click", () => {
  torchWindow.hidden = true;
});
document
  .querySelector("#openArcadeButton")
  .addEventListener("click", showGameWindow);
document.querySelector("#closeArcadeButton").addEventListener("click", () => {
  if (!loadingStage.hidden) {
    loadingStage.hidden = true;
    cloudStage.hidden = true;
    basketballStage.hidden = false;
    document
      .querySelectorAll(".game-choice")
      .forEach((item) => item.classList.remove("active"));
    document
      .querySelector('.game-choice[data-game="basketball"]')
      .classList.add("active");
    return;
  }
  gameWindow.hidden = true;
});
document.querySelector("#backToBasketball").addEventListener("click", () => {
  loadingStage.hidden = true;
  cloudStage.hidden = true;
  basketballStage.hidden = false;
  document
    .querySelectorAll(".game-choice")
    .forEach((item) => item.classList.remove("active"));
  document
    .querySelector('.game-choice[data-game="basketball"]')
    .classList.add("active");
});
document.querySelectorAll(".game-choice").forEach((choice) =>
  choice.addEventListener("click", () => {
    document
      .querySelectorAll(".game-choice")
      .forEach((item) => item.classList.remove("active"));
    choice.classList.add("active");
    const isBasketball = choice.dataset.game === "basketball";
    const isClouds = choice.dataset.game === "clouds";
    basketballStage.hidden = !isBasketball;
    cloudStage.hidden = !isClouds;
    loadingStage.hidden = isBasketball || isClouds;
  })
);

function showSummary() {
  const elapsed = currentElapsed();
  const pageName = document.title.split(" — ")[0];
  const xp = Math.floor(elapsed / 5);
  const questPercent = Math.min(Math.floor((elapsed / 60) * 100), 100);
  document.querySelector("#finalTime").textContent = formatTime(elapsed);
  document.querySelector("#finalShots").textContent = xp;
  document.querySelector("#finalScore").textContent = `${questPercent}%`;
  document.querySelector("#reportShotCopy").textContent = xp;
  document.querySelector("#reportScoreCopy").textContent = `${questPercent}%`;
  document.querySelector("#reportPage").textContent = pageName;
  exitButton.style.transform = "translate(0, 0)";
  exitButton.dataset.attempts = "0";
  exitButton.disabled = true;
  exitButton.innerHTML = "Exit in 6s <span>↗</span>";
  clearInterval(exitUnlockTimer);
  let secondsRemaining = 6;
  exitUnlockTimer = setInterval(() => {
    secondsRemaining -= 1;
    exitButton.innerHTML = secondsRemaining > 0
      ? `Exit in ${secondsRemaining}s <span>↗</span>`
      : "Exit <span>↗</span>";
    if (secondsRemaining <= 0) {
      clearInterval(exitUnlockTimer);
      exitButton.disabled = false;
      toast.textContent = "Exit unlocked. The report releases you.";
      toast.classList.add("visible");
      setTimeout(() => toast.classList.remove("visible"), 1800);
    }
  }, 1000);
  analysisModal.hidden = false;
  analysisMessage.textContent = "Reading the evidence of your excellent lack of productivity.";
  analysisStatus.textContent = "CONNECTING TO NOTHING";
  playSound(130, 0.2, "sawtooth");
  setTimeout(() => {
    analysisMessage.textContent = "Loading behavioural data...";
    analysisStatus.textContent = "LOADING... ∿";
  }, 700);
  setTimeout(() => {
    analysisModal.hidden = true;
    exitModal.hidden = false;
  }, 1800);
}

endSessionButton.addEventListener("click", showSummary);

function escapePdfText(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function downloadReport() {
  const elapsed = currentElapsed();
  const arcadeShots = state.shots;
  const arcadeScore = state.score;
  const arcadeAccuracy = arcadeShots === 0
    ? 0
    : Math.round((arcadeScore / arcadeShots) * 100);
  const pageName = document.title.split(" — ")[0];
  const reportDate = new Date().toLocaleString();
  const reportId = `DN-${String(Date.now()).slice(-8)}`;
  const source = window.location.href.length > 67
    ? `${window.location.href.slice(0, 64)}...`
    : window.location.href;
  const commands = [];
  const fill = (red, green, blue) => commands.push(`${red} ${green} ${blue} scn`);
  const stroke = (red, green, blue) => commands.push(`${red} ${green} ${blue} SCN`);
  const rectangle = (x, y, width, height, color) => {
    fill(...color);
    commands.push(`${x} ${y} ${width} ${height} re f`);
  };
  const outline = (x, y, width, height, color, lineWidth = 1) => {
    stroke(...color);
    commands.push(`${lineWidth} w ${x} ${y} ${width} ${height} re S`);
  };
  const text = (value, x, y, size, font = "F1", color = [0.95, 0.97, 0.95]) => {
    fill(...color);
    commands.push(`BT /${font} ${size} Tf ${x} ${y} Td (${escapePdfText(value)}) Tj ET`);
  };
  const line = (x1, y1, x2, y2, color, lineWidth = 1) => {
    stroke(...color);
    commands.push(`${lineWidth} w ${x1} ${y1} m ${x2} ${y2} l S`);
  };

  rectangle(0, 0, 612, 792, [0.03, 0.05, 0.07]);
  rectangle(0, 712, 612, 80, [0.07, 0.11, 0.15]);
  rectangle(0, 712, 16, 80, [1, 0.31, 0.60]);
  rectangle(16, 712, 8, 80, [0.30, 0.91, 1]);
  text("DO NOTHING!", 52, 752, 25, "F2", [0.30, 0.91, 1]);
  text("OFFICIAL WEB SESSION ANALYSIS", 54, 730, 9, "F2", [0.95, 0.97, 0.95]);
  text(`DOCUMENT ${reportId}`, 425, 752, 8, "F2", [0.79, 1, 0.24]);
  text("CLASSIFICATION: OFFICIALLY POINTLESS", 350, 730, 7, "F1", [0.56, 0.63, 0.62]);

  text("CERTIFIED SESSION REPORT", 52, 672, 10, "F2", [1, 0.31, 0.60]);
  text("A statistically serious review", 52, 640, 28, "F2", [0.95, 0.97, 0.95]);
  text("of an unserious amount of time.", 52, 612, 18, "F1", [0.30, 0.91, 1]);
  line(52, 588, 560, 588, [0.30, 0.91, 1], 2);

  rectangle(438, 604, 122, 122, [0.10, 0.06, 0.12]);
  outline(446, 612, 106, 106, [1, 0.31, 0.60], 2);
  outline(453, 619, 92, 92, [0.79, 1, 0.24], 1);
  text("O", 480, 666, 42, "F2", [0.79, 1, 0.24]);
  text("VERIFIED", 474, 642, 8, "F2", [0.30, 0.91, 1]);
  text("NOTHING", 471, 628, 8, "F2", [0.95, 0.97, 0.95]);

  text("SUBJECT OF ANALYSIS", 52, 558, 8, "F2", [0.56, 0.63, 0.62]);
  text(pageName.toUpperCase(), 52, 538, 16, "F2", [0.95, 0.97, 0.95]);
  text("WEB SOURCE", 52, 510, 8, "F2", [0.56, 0.63, 0.62]);
  text(source, 52, 492, 8, "F1", [0.30, 0.91, 1]);
  text("ANALYSED", 52, 466, 8, "F2", [0.56, 0.63, 0.62]);
  text(reportDate, 52, 448, 10, "F1", [0.95, 0.97, 0.95]);

  const metricBoxes = [
    [52, "FINAL WASTE", formatTime(elapsed), [1, 0.31, 0.60]],
    [180, "XP GENERATED", String(Math.floor(elapsed / 5)), [0.30, 0.91, 1]],
    [308, "QUEST PROGRESS", `${Math.min(Math.floor((elapsed / 60) * 100), 100)}%`, [0.79, 1, 0.24]],
    [436, "CONFESSIONS", String(state.confessionCount), [1, 0.31, 0.60]],
  ];
  metricBoxes.forEach(([x, label, value, color]) => {
    rectangle(x, 374, 116, 64, [0.07, 0.11, 0.15]);
    outline(x, 374, 116, 64, [0.16, 0.23, 0.27]);
    text(label, x + 10, 418, 7, "F2", [0.56, 0.63, 0.62]);
    text(value, x + 10, 390, 18, "F2", color);
  });

  rectangle(52, 238, 508, 104, [0.07, 0.11, 0.15]);
  rectangle(52, 238, 5, 104, [0.79, 1, 0.24]);
  text("AUTOMATED FINDINGS / ARCADE APPENDIX", 72, 318, 8, "F2", [0.79, 1, 0.24]);
  text("01", 72, 289, 10, "F2", [1, 0.31, 0.60]);
  text("Productivity was successfully avoided across the web session.", 104, 289, 11, "F1");
  text("02", 72, 267, 10, "F2", [0.30, 0.91, 1]);
  text(`Web session: ${Math.floor(elapsed / 5)} XP, ${Math.min(Math.floor((elapsed / 60) * 100), 100)}% quest progress.`, 104, 267, 10, "F1");
  text("03", 72, 245, 10, "F2", [0.79, 1, 0.24]);
  text(`Arcade: ${arcadeScore} baskets / ${arcadeShots} shots / ${arcadeAccuracy}% accuracy.`, 104, 245, 10, "F1");

  line(52, 202, 560, 202, [0.16, 0.23, 0.27]);
  text("FINAL DETERMINATION", 52, 178, 8, "F2", [0.56, 0.63, 0.62]);
  text("A FLAWLESS PERFORMANCE: YOU SCORED ABSOLUTELY NOTHING.", 52, 154, 12, "F2", [0.30, 0.91, 1]);
  text("This document was generated from local web-session data. No external service was consulted.", 52, 124, 8, "F1", [0.56, 0.63, 0.62]);
  text("AUTHORIZED BY THE INSTITUTE OF UNNECESSARY ANALYTICS", 52, 82, 7, "F2", [1, 0.31, 0.60]);
  text("DO NOTHING!  /  REPORT 01  /  PAGE 1 OF 1", 52, 58, 7, "F1", [0.56, 0.63, 0.62]);

  const stream = commands.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    "<< /Title (Do Nothing! Official Web Session Analysis) /Author (Institute of Unnecessary Analytics) /Subject (Certified pointless activity report) >>",
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info 8 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  const url = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "do-nothing-session-analysis.pdf";
  link.click();
  URL.revokeObjectURL(url);
}

document.querySelector("#downloadReportButton").addEventListener("click", downloadReport);

document.querySelector("#modalClose").addEventListener("click", () => {
  exitModal.hidden = true;
});
function evadeExitButton(event) {
  event.preventDefault();
  if (exitButton.disabled) {
    toast.textContent = "Exit is locked for 6 seconds.";
    toast.classList.add("visible");
    setTimeout(() => toast.classList.remove("visible"), 1200);
    return;
  }
  if (event.type === "click") {
    exitModal.hidden = true;
    window.close();
  }
}

exitButton.addEventListener("pointerenter", evadeExitButton);
exitButton.addEventListener("focus", evadeExitButton);
exitButton.addEventListener("click", evadeExitButton);

render();
startTicking();