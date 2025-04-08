//Player, Hole, and PopUp
document.addEventListener("DOMContentLoaded", function () {
  let playerName = localStorage.getItem("playerName");
  let selectedCharacterImage = localStorage.getItem("selectedCharacterImage");

  document.getElementById("player-name").textContent = playerName;
  document.getElementById("player-welcome-name").textContent = playerName;
  document.getElementById("player-name-profile").textContent = playerName;
  document.getElementById("player-img").src = selectedCharacterImage;

  if (selectedCharacterImage) {
    let imgElement = document.getElementById("player-character-img");
    imgElement.src = selectedCharacterImage;
    imgElement.classList.remove("hidden");
  }

  updateMoneyDisplay();
  updateTime();
  updateDate();
  updateBars();
});

let visitedLocations = new Set();

const locationPoints = {
  home: { x: 60, y: 90 },
  bromo: { x: 760, y: 470 },
  kuta: { x: 270, y: 445 },
  borobudur: { x: 680, y: 240 },
  lake_toba: { x: 380, y: 60 },
};

function checkPlayerLocation(px, py) {
  for (let [name, point] of Object.entries(locationPoints)) {
    let dx = point.x - px;
    let dy = point.y - py;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 50 && !visitedLocations.has(name)) {
      visitedLocations.add(name);
      console.log(`Visited: ${name}`);
    }
  }
}

//Click Backsound
function setDieSound() {
  const sound = document.getElementById("hole-death-sound");
  sound.currentTime = 0;
  sound.play();
}

function setClickSoundForLocation() {
  const sound = document.getElementById("location-sound");
  sound.currentTime = 0;
  sound.play();
}

function playClickSound() {
  const sound = document.getElementById("click-sound");
  sound.currentTime = 0;
  sound.play();
}
document.querySelectorAll("button[id^='action']").forEach((btn) => {
  btn.addEventListener("click", playClickSound);
});
window.addEventListener("load", () => {
  const sound = document.getElementById("click-sound");
  sound
    .play()
    .then(() => {
      sound.pause();
      sound.currentTime = 0;
    })
    .catch(() => {});
});

//Theme
function updateTheme() {
  let currentHour = new Date().getHours();
  let body = document.body;
  let statusBar = document.querySelector(".status-bar");
  let taskTexts = document.querySelectorAll(
    "#health-text, #energy-text, #hygiene-text, #happiness-text"
  );

  let gameTitle = document.querySelector(".status-bar strong");
  let gameTime = document.getElementById("game-time");
  let gameDay1 = document.getElementById("game-day1");
  let gameDay2 = document.getElementById("game-day2");
  let volumeLabel = document.querySelector("label[for='volumeSlider']");

  if (currentHour >= 18 || currentHour < 6) {
    gameTitle.style.color = "white";
    gameTime.style.color = "black";
    gameDay1.style.color = "white";
    gameDay2.style.color = "white";
    taskTexts.forEach((text) => {
      text.style.color = "white";
    });

    if (volumeLabel) volumeLabel.style.color = "white";
  } else {
    gameTitle.style.color = "";
    gameTime.style.color = "";
    gameDay1.style.color = "";
    gameDay2.style.color = "";
    taskTexts.forEach((text) => {
      text.style.color = "black";
    });

    if (volumeLabel) volumeLabel.style.color = "";
  }
}

setInterval(updateTheme, 1000);
updateTheme();

//Player movement & position
let position = { x: 50, y: 40 }; // Starting position in percentage
let step = 2; // Step size in percentage

let hole = document.querySelector(
  "img[src='./assets/logo-and-character/hole.png']"
);
let player = document.getElementById("player");
player.style.opacity = "0";
player.style.transform = "scale(0.2) translateY(20px)";

setTimeout(() => {
  player.style.animation = "emerge 0.5s forwards";
}, 500);

function closePopup() {
  playClickSound();
  document.getElementById("welcome-popup").style.display = "none";
  setTimeout(() => {
    player.style.opacity = "1";
    player.style.animation = "emergeFromHole 0.5s forwards";
  }, 500);
}

//Time and Date
const realStartTime = performance.now();
const gameStartTime = new Date();
const timeSpeedMultiplier = 10;
let lastMoveTime = Date.now();

const now = performance.now();
const elapsedReal = now - realStartTime;
const elapsedGame = elapsedReal * timeSpeedMultiplier;
const currentGameTime = new Date(gameStartTime.getTime() + elapsedGame);

function updateGameClock() {
  const now = performance.now();
  const elapsedReal = now - realStartTime;
  const elapsedGame = elapsedReal * timeSpeedMultiplier;
  const currentGameTime = new Date(gameStartTime.getTime() + elapsedGame);

  const optionsTime = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  const optionsDate = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const hours = currentGameTime.getHours();
  const greeting =
    hours < 12
      ? "Good Morning!"
      : hours < 18
      ? "Good Afternoon!"
      : "Good Evening!";

  document.getElementById("game-time").innerHTML =
    currentGameTime.toLocaleTimeString("en-US", optionsTime);

  document.getElementById("game-day1").innerHTML =
    currentGameTime.toLocaleDateString("en-US", optionsDate);

  document.getElementById("game-day2").innerHTML = greeting;

  requestAnimationFrame(updateGameClock);
}

requestAnimationFrame(updateGameClock);

//Movement and Energy
let stepCount = 0;

function getMapBounds() {
  const mapContainer = document.querySelector('.map-container');
  return {
    width: mapContainer.offsetWidth,
    height: mapContainer.offsetHeight
  };
}

function updatePlayerPosition() {
  const player = document.getElementById('player');
  if (!player) return;

  // Clamp position between 0% and 100%
  position.x = Math.max(0, Math.min(100, position.x));
  position.y = Math.max(0, Math.min(100, position.y));

  player.style.left = `${position.x}%`;
  player.style.top = `${position.y}%`;
}

function move(direction) {
  if (!player) return;
  let prevX = position.x;
  let prevY = position.y;

  if (statusValues.energy != 0) {
    switch (direction) {
      case "up":
        if (position.y - step >= 0) position.y -= step;
        break;
      case "down":
        if (position.y + step <= 100) position.y += step;
        break;
      case "left":
        if (position.x - step >= 0) position.x -= step;
        document.getElementById('player-img').style.transform = 'scaleX(-1)';
        break;
      case "right":
        if (position.x + step <= 100) position.x += step;
        document.getElementById('player-img').style.transform = 'scaleX(1)';
        break;
    }
  }

  if (position.x === prevX && position.y === prevY) {
    player.style.animation = "shake 0.2s";
    setTimeout(() => (player.style.animation = ""), 200);
  }

  updatePlayerPosition();
  updateButtonsAndThemes();

  if (position.x !== prevX || position.y !== prevY) {
    stepCount++;
    if (stepCount % 2 === 0) {
      statusValues.energy = Math.max(statusValues.energy - 1, 0);
      updateBars();
    }
    checkTrapCollision();
  }
}

function checkIfDead() {
  if (
    statusValues.health <= 0 ||
    statusValues.energy <= 0 ||
    statusValues.hygiene <= 0 ||
    statusValues.happiness <= 0
  ) {
    const player = document.getElementById("player");
    const holeDeath = document.getElementById("hole-death");

    const playerLeft = player.offsetLeft;
    const playerTop = player.offsetTop;

    holeDeath.style.left = `${playerLeft}px`;
    holeDeath.style.top = `${playerTop + 25}px`;
    holeDeath.classList.remove("hidden");
    holeDeath.classList.add("hole-fade-in");

    setDieSound();

    setTimeout(() => {
      player.classList.add("sink");
    }, 200);

    setTimeout(() => {
      window.location.href = "die.html";
    }, 2000);
  }
  updateBars();
}
setInterval(checkIfDead, 1000);

document.addEventListener("keydown", function (event) {
  const keyMap = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
  };
  if (keyMap[event.key]) move(keyMap[event.key]);
});

// Level
const profileBtn = document.getElementById("profile-btn");
const profileBox = document.getElementById("profile-box");
const closeProfile = document.getElementById("close-profile");
const expBar = document.getElementById("exp-bar");
const expText = document.getElementById("exp");
const levelText1 = document.getElementById("level1");
const levelText2 = document.getElementById("level2");
const addExpBtn = document.getElementById("add-exp");
let achievements = {
  photography: false,
  map: false,
  artifact: false,
  Composting: false,
};

document.getElementById("profile-btn").addEventListener("click", () => {
  document.getElementById("profile-box").classList.remove("hidden");
});

document.getElementById("close-profile").addEventListener("click", () => {
  document.getElementById("profile-box").classList.add("hidden");
});

function updateAchievementsDisplay() {
  document.querySelectorAll(".achievement-item").forEach((item) => {
    const key = item.dataset.achievement;
    if (achievements[key]) {
      item.classList.remove("opacity-40");
    } else {
      item.classList.add("opacity-40");
    }
  });
}

document.querySelectorAll(".achievement-item").forEach((item) => {
  item.addEventListener("click", () => {
    const key = item.dataset.achievement;

    let taskMessage = "";
    switch (key) {
      case "photography":
        taskMessage = "Take 2 pictures around the map."; //tlg kasi tampilan
        break;
      case "map":
        taskMessage = "Explore at least 5 unique locations."; //tlg kasi tampilan
        break;
      case "artifact":
        taskMessage = "Collect 3.000.000 IDR."; //tlg kasi tampilan
        break;
      case "Composting":
        taskMessage = "Collect 10 trash at Beach."; //tlg kasi tampilan
        break;
    }

    alert(`Task to unlock "${key}":\n${taskMessage}`);
  });
});

function unlockAchievement(key) {
  if (achievements.hasOwnProperty(key) && !achievements[key]) {
    achievements[key] = true;
    updateAchievementsDisplay();
    console.log(`Achievement "${key}" unlocked!`);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateAchievementsDisplay();
});
const maxExp = 100;

profileBtn.addEventListener("click", () => {
  profileBox.classList.remove("hidden");
});

closeProfile.addEventListener("click", () => {
  profileBox.classList.add("hidden");
});

profileBox.addEventListener("click", (event) => {
  if (event.target === profileBox) {
    profileBox.classList.add("hidden");
  }
});

function addAchievement(name) {
  const li = document.createElement("li");
  li.textContent = name;
}

function updateExpBar() {
  const expPercentage = (statusValues.exp / maxExp) * 100;
  expBar.style.width = `${expPercentage}%`;
  expText.textContent = `${statusValues.exp}`;
  if (statusValues.exp >= maxExp) {
    statusValues.exp = 0;
    statusValues.level++;
    alert(`Congratulations! You've leveled up to Level ${statusValues.level}!`); //tlg kasi tampilan
  }
  levelText1.textContent = `${statusValues.level}`;
  levelText2.textContent = `${statusValues.level}`;
}

// Status and Money System
let statusValues = {
  health: 50,
  energy: 50,
  hygiene: 50,
  happiness: 50,
  money: 100000,
  exp: 0,
  level: 1,
};

function updateBars() {
  document.getElementById("health-bar").style.width = statusValues.health + "%";
  document.getElementById("energy-bar").style.width = statusValues.energy + "%";
  document.getElementById("hygiene-bar").style.width =
    statusValues.hygiene + "%";
  document.getElementById("happiness-bar").style.width =
    statusValues.happiness + "%";

  document.getElementById("health-text").textContent =
    statusValues.health + "%";
  document.getElementById("energy-text").textContent =
    statusValues.energy + "%";
  document.getElementById("hygiene-text").textContent =
    statusValues.hygiene + "%";
  document.getElementById("happiness-text").textContent =
    statusValues.happiness + "%";

  updateMoneyDisplay();
}

function gainExp(amount) {
  statusValues.exp += amount;
  if (statusValues.exp >= 100) {
    statusValues.exp -= 100;
    statusValues.level++;
  }
}

function updateMoneyDisplay() {
  const moneySpan = document.getElementById("money");
  if (moneySpan) {
    moneySpan.textContent = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(statusValues.money);
  }
}

// Actions
let compostingAchievement = 0;
let photographyAchievement1 = false;
let photographyAchievement2 = false;

function performAction(action) {
  switch (action) {
    case "getMeal":
      statusValues.health = Math.min(statusValues.health + 10, 100);
      statusValues.energy = Math.min(statusValues.energy + 20, 100);
      gainExp(20);
      break;
    case "takeBath":
      statusValues.hygiene = Math.min(statusValues.hygiene + 30, 100);
      statusValues.happiness = Math.min(statusValues.happiness + 10, 100);
      gainExp(20);
      showShowerPopup();
      break;
    case "sleep":
      statusValues.energy = Math.min(statusValues.energy + 40, 100);
      statusValues.health = Math.max(statusValues.health - 20, 0);
      gainExp(10);
      break;
    case "chores":
      statusValues.energy = Math.max(statusValues.energy - 3, 0);
      statusValues.health = Math.max(statusValues.health - 1, 0);
      statusValues.hygiene = Math.max(statusValues.hygiene - 2, 0);
      gainExp(30);
      statusValues.money += 100000;
      if (statusValues.money >= 3000000) {
        unlockAchievement("artifact");
      }
      break;
    case "sandPlay":
      statusValues.happiness = Math.min(statusValues.happiness + 3, 100);
      statusValues.energy = Math.max(statusValues.energy - 2, 0);
      statusValues.hygiene = Math.max(statusValues.hygiene - 3, 0);
      gainExp(5);
      break;
    case "buyDrink":
      if (statusValues.money >= 10000) {
        statusValues.health = Math.min(statusValues.health + 3, 100);
        statusValues.energy = Math.min(statusValues.energy + 3, 100);
        statusValues.happiness = Math.min(statusValues.happiness + 3, 100);
        statusValues.money = Math.max(statusValues.money - 10000, 0);
        gainExp(5);
      }
      break;
    case "buySnack":
      if (statusValues.money >= 25000) {
        statusValues.health = Math.min(statusValues.health + 2, 100);
        statusValues.energy = Math.min(statusValues.energy + 2, 100);
        statusValues.happiness = Math.min(statusValues.happiness + 1, 100);
        statusValues.money = Math.max(statusValues.money - 25000, 0);
        gainExp(5);
      }
      break;
    case "pickTrash":
      statusValues.happiness = Math.min(statusValues.happiness + 1, 100);
      statusValues.energy = Math.max(statusValues.energy - 2, 0);
      statusValues.hygiene = Math.max(statusValues.hygiene - 4, 0);
      gainExp(40);
      if (compostingAchievement < 10) {
        compostingAchievement++;
        if (compostingAchievement >= 10) {
          unlockAchievement("Composting");
        }
      }
      statusValues.money += 115000;
      break;
    case "takePicture1":
      statusValues.happiness = Math.min(statusValues.happiness + 4, 100);
      statusValues.energy = Math.max(statusValues.energy - 2, 0);
      gainExp(15);
      photographyAchievement1 = true;
      if (photographyAchievement1 && !photographyAchievement2) {
        unlockAchievement("photography");
      }
      showPhotoPopup();

      break;
    case "takePicture2":
      statusValues.happiness = Math.min(statusValues.happiness + 4, 100);
      statusValues.energy = Math.max(statusValues.energy - 2, 0);
      gainExp(15);
      photographyAchievement2 = true;
      if (photographyAchievement1 && photographyAchievement2) {
        unlockAchievement("photography");
      }
      showPhotoPopup();

      break;
    case "buyFood":
      if (statusValues.money >= 50000) {
        statusValues.health = Math.min(statusValues.health + 2, 100);
        statusValues.happiness = Math.min(statusValues.happiness + 1, 100);
        statusValues.energy = Math.min(statusValues.energy + 2, 100);
        statusValues.money = Math.max(statusValues.money - 50000, 0);
        gainExp(5);
      }
      break;
    case "buySouvenir":
      if (statusValues.money >= 30000) {
        statusValues.happiness = Math.min(statusValues.happiness + 3, 100);
        statusValues.money = Math.max(statusValues.money - 30000, 0);
        gainExp(10);
      }
      break;
    case "rentCostume":
      if (statusValues.money >= 30000) {
        statusValues.happiness = Math.min(statusValues.happiness + 3, 100);
        statusValues.money = Math.max(statusValues.money - 80000, 0);
        gainExp(15);
      }
      break;
    case "takeShower":
      statusValues.hygiene = Math.min(statusValues.hygiene + 20, 100);
      showShowerPopup();
      gainExp(20);
      break;
    case "catchFish":
      statusValues.health = Math.min(statusValues.health + 10, 100);
      gainExp(10);
      break;
    case "washClothes":
      statusValues.hygiene = Math.min(statusValues.hygiene + 10, 100);
      statusValues.energy = Math.max(statusValues.energy - 5, 0);
      gainExp(30);
      break;
    case "makeVideo":
      statusValues.happiness = Math.min(statusValues.happiness + 15, 100);
      statusValues.energy = Math.max(statusValues.energy - 10, 0);
      gainExp(10);
      break;
    case "plantFlag":
      statusValues.happiness = Math.min(statusValues.happiness + 20, 100);
      gainExp(5);
      break;
    case "pray":
      statusValues.happiness = Math.min(statusValues.happiness + 25, 100);
      gainExp(40);
      break;
    default:
      break;
  }
  updateBars();
  updateExpBar();
}

// Location and Button Updates
let uniqueLocations1 = false;
let uniqueLocations2 = false;
let uniqueLocations3 = false;
let uniqueLocations4 = false;
let uniqueLocations5 = false;

function updateButtonsAndThemes() {
  let locationText = document.getElementById("location-text");
  let locationBox = document.getElementById("location");
  let actions = ["action1", "action2", "action3", "action4"].map((id) =>
    document.getElementById(id)
  );
  let currentGameTime = new Date(
    gameStartTime.getTime() +
      (performance.now() - realStartTime) * timeSpeedMultiplier
  ).getHours();
  let body = document.body;

  const locationChecks = [
    {
      name: "Tangerang",
      x: 7.06,
      y: 13.24,
      radius: 6,
      night: './assets/background/default-night.jpg',
      day: './assets/background/default.jpg',
      actions: [
        { text: "Get Some Meal", action: "getMeal" },
        { text: "Take a Bath", action: "takeBath" },
        { text: "Sleep", action: "sleep" },
        { text: "🛈 Do Chores", action: "chores" }
      ]
    },
    {
      name: "Kuta Beach",
      x: 31.76,
      y: 65.44,
      radius: 6,
      night: './assets/background/kuta-night.jpg',
      day: './assets/background/kuta.jpg',
      actions: [
        { text: "Sand Play", action: "sandPlay" },
        { text: "🛈 Buy Drink", action: "buyDrink" },
        { text: "🛈 Buy Snack", action: "buySnack" },
        { text: "🛈 Pick-up Trash", action: "pickTrash" }
      ]
    },
    {
      name: "Lake Toba",
      x: 44.7,
      y: 8.82,
      radius: 6,
      night: './assets/background/toba-night.jpg',
      day: './assets/background/toba.jpg',
      actions: [
        { text: "Take Picture", action: "takePicture" },
        { text: "Buy Food", action: "buyFood" },
        { text: "Buy Souvenir", action: "buySouvenir" },
        { text: "Catch Fish", action: "catchFish" }
      ]
    },
    {
      name: "Borobudur Temple",
      x: 80,
      y: 35.29,
      radius: 6,
      night: './assets/background/borobudur-night.jpg',
      day: './assets/background/borobudur.jpg',
      actions: [
        { text: "Take Picture", action: "takePicture" },
        { text: "Rent Costume", action: "rentCostume" },
        { text: "Make Video", action: "makeVideo" },
        { text: "Pray", action: "pray" }
      ]
    },
    {
      name: "Mount Bromo",
      x: 89.41,
      y: 69.12,
      radius: 6,
      night: './assets/background/bromo-night.jpg',
      day: './assets/background/bromo.jpg',
      actions: [
        { text: "Take Picture", action: "takePicture" },
        { text: "Plant Flag", action: "plantFlag" },
        { text: "Buy Souvenir", action: "buySouvenir" },
        { text: "Make Video", action: "makeVideo" }
      ]
    }
  ];

  let currentLocation = locationChecks.find(loc => 
    Math.abs(position.x - loc.x) < loc.radius && 
    Math.abs(position.y - loc.y) < loc.radius
  );

  if (currentLocation) {
    locationText.innerHTML = `You're at ${currentLocation.name}`;
    localStorage.setItem("currentLocation", currentLocation.name.toLowerCase().replace(" ", "-"));
    
    // Add the at-location class for larger box
    locationBox.classList.add('at-location');
    
    currentLocation.actions.forEach((action, index) => {
      actions[index].innerHTML = action.text;
      actions[index].onclick = () => performAction(action.action);
    });

    body.style.backgroundImage = `url('${
      currentGameTime >= 18 || currentGameTime < 6 
        ? currentLocation.night 
        : currentLocation.day
    }')`;
  } else {
    locationText.innerHTML = "You're Lost!";
    localStorage.setItem("currentLocation", "unknown");
    // Remove the at-location class when not at a location
    locationBox.classList.remove('at-location');
    actions.forEach(action => {
      action.innerHTML = "";
      action.onclick = null;
    });
    body.style.backgroundImage = `url('${
      currentGameTime >= 18 || currentGameTime < 6
        ? './assets/background/default-night.jpg'
        : './assets/background/default.jpg'
    }')`;

  }
}

// Trap and Music
const trap = document.getElementById("trap-net");
function moveTrapRandomly() {

  const randomXPercent = Math.random() * 100;
  const randomYPercent = Math.random() * 100;
  const trap = document.getElementById("trap-net");
  if (trap) {
    trap.style.left = `${randomXPercent}%`;
    trap.style.top = `${randomYPercent}%`;
  }
  const randomXPixel = Math.floor(Math.random() * (850 - 64));
  const randomYPixel = Math.floor(Math.random() * (600 - 64));
  trap.style.left = `${randomXPixel}px`;
  trap.style.top = `${randomYPixel}px`;
}
setInterval(moveTrapRandomly, 20000);

function checkTrapCollision() {
  const trapRect = trap.getBoundingClientRect();
  const playerRect = player.getBoundingClientRect();

  const shrinkTrap = 30;
  const trapHitbox = {
    left: trapRect.left + shrinkTrap,
    right: trapRect.right - shrinkTrap,
    top: trapRect.top + shrinkTrap,
    bottom: trapRect.bottom - shrinkTrap,
  };

  const isColliding =
    trapHitbox.left < playerRect.right &&
    trapHitbox.right > playerRect.left &&
    trapHitbox.top < playerRect.bottom &&
    trapHitbox.bottom > playerRect.top;

  if (isColliding) {
    statusValues.health = Math.max(statusValues.health - 2, 0);
    updateBars();
    player.style.animation = "shake 0.2s";
    setTimeout(() => {
      player.style.animation = "";
    }, 200);
  }
}

const bgMusic = document.getElementById("bgMusic");
const volumeSlider = document.getElementById("volumeSlider");
function updateVolume() {
  bgMusic.volume = volumeSlider.value;
}
volumeSlider.addEventListener("input", updateVolume);

// Decay System
function decay() {
  statusValues.health = Math.max(statusValues.health - 5, 0);
  statusValues.hygiene = Math.max(statusValues.hygiene - 5, 0);
  statusValues.happiness = Math.max(statusValues.happiness - 5, 0);
  updateBars();
}
setInterval(decay, 60000);

// Initial setup
updateBars();
updateButtonsAndThemes();

//Pop Up
function playShower() {
  const sound = document.getElementById("shower-sound");
  sound.currentTime = 0;
  sound.play();
}

function showPhotoPopup() {
  const popup = document.getElementById("photo-popup");
  const flash = document.getElementById("camera-flash");
  const bg = document.getElementById("popup-bg");
  const characterImg = document.getElementById("popup-character-img");

  const isNight = new Date().getHours() >= 18 || new Date().getHours() < 6;
  const currentLocation = localStorage.getItem("currentLocation");

  if (currentLocation === "lake-toba") {
    bg.src = isNight
      ? "assets/background/toba-night.jpg"
      : "assets/background/toba.jpg";
  } else {
    bg.src = isNight
      ? "assets/background/borobudur-night.jpg"
      : "assets/background/borobudur.jpg";
  }
  const selectedCharacterImage = localStorage.getItem("selectedCharacterImage");
  if (selectedCharacterImage && characterImg) {
    characterImg.src = selectedCharacterImage;
    characterImg.classList.remove("hidden");
  }
  popup.classList.remove("hidden");

  setTimeout(() => {
    flash.classList.add("opacity-100");
  }, 300);

  setTimeout(() => {
    flash.classList.remove("opacity-100");
  }, 600);

  setTimeout(() => {
    popup.classList.add("hidden");
  }, 2000);
}

function showShowerPopup() {
  playShower();
  document.getElementById("shower-popup").classList.remove("hidden");
  const sound = document.getElementById("shower-sound");
  sound.currentTime = 0;
  sound.play();

  setTimeout(() => {
    document.getElementById("shower-popup").classList.add("hidden");

  }, 9000);
}
 

const ProfileManager = {
  init() {
    const characterImage =
      localStorage.getItem("selectedCharacterImage") ||
      "./assets/logo-and-character/wayang1.png";
    const playerName = localStorage.getItem("playerName") || "Player";

    document.getElementById("wayang-image").src = characterImage;
    document.getElementById("wayang-name").textContent = characterDesc;
    document.getElementById("player-name-profile").textContent = playerName;
  },

  showProfile() {
    this.init();
    document.getElementById("profile-box").classList.remove("hidden");
  },
};

document.addEventListener("DOMContentLoaded", () => {
  ProfileManager.init();

  document.getElementById("close-profile").addEventListener("click", () => {
    document.getElementById("profile-box").classList.add("hidden");
  });
});

function showProfile() {
  ProfileManager.showProfile();
}

//Energy Regeneration
function energyRegeneration() {
  const currentTime = Date.now();
  if (currentTime - lastMoveTime >= 30000) {
    if (statusValues.energy < 50) {
      statusValues.energy = Math.min(statusValues.energy + 1, 50);
    }
    updateBars();
  }
}
setInterval(energyRegeneration, 1000);


window.addEventListener('resize', () => {
  updatePlayerPosition();
});
