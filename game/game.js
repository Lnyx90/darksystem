// Player, Hole, and PopUp
document.addEventListener("DOMContentLoaded", function () {
  let playerName = localStorage.getItem("playerName");
  let selectedCharacterImage = localStorage.getItem("selectedCharacterImage");

  document.getElementById("player-name").textContent = playerName;
  document.getElementById("player-welcome-name").textContent = playerName;
  document.getElementById("player-name-profile").textContent = playerName;
  document.getElementById("player-img").src = selectedCharacterImage;
  document.getElementById("wayang-image").src = selectedCharacterImage;

  if (selectedCharacterImage) {
    let imgElement = document.getElementById("player-character-img");
    imgElement.src = selectedCharacterImage;
    imgElement.classList.remove("hidden");
  }


  document.getElementById("profile-btn").addEventListener("click", function() {
    document.getElementById("profile-box").classList.remove("hidden");
  });

  document.getElementById("close-profile").addEventListener("click", function() {
    document.getElementById("profile-box").classList.add("hidden");
  });


  updateMoneyDisplay();
  updateGameClock();

  updateDate();
  updateBars();
  initGame();
});

// Coordinate conversion functions
function getPositionInPixels(percentX, percentY) {
  const mapContainer = document.querySelector('.map-container');
  return {
    x: (percentX / 100) * mapContainer.offsetWidth,
    y: (percentY / 100) * mapContainer.offsetHeight
  };
}

function getPositionInPercent(pixelX, pixelY) {
  const mapContainer = document.querySelector('.map-container');
  return {
    x: (pixelX / mapContainer.offsetWidth) * 100,
    y: (pixelY / mapContainer.offsetHeight) * 100
  };
}

// Location system
let visitedLocations = new Set();
const locationPoints = {
  home: { x: 60, y: 90 },
  bromo: { x: 760, y: 470 },
  kuta: { x: 270, y: 445 },
  borobudur: { x: 680, y: 240 },
  lake_toba: { x: 380, y: 60 },
};

// Player movement
let position = { x: 50, y: 40 }; // Percentage-based starting position
let step = 2; // Percentage-based step size
let stepCount = 0;
let lastMoveTime = Date.now();

let hole = document.querySelector("img[src='./assets/logo-and-character/hole.png']");
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

// Time and Date
const realStartTime = performance.now();
const gameStartTime = new Date();
const timeSpeedMultiplier = 10;

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

// Movement functions
function updatePlayerPosition() {
  const player = document.getElementById('player');
  if (!player) return;

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
        position.y = Math.max(0, position.y - step);
        break;
      case "down":
        position.y = Math.min(100, position.y + step);
        break;
      case "left":
        position.x = Math.max(0, position.x - step);
        document.getElementById('player-img').style.transform = 'scaleX(-1)';
        break;
      case "right":
        position.x = Math.min(100, position.x + step);
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
  checkPlayerLocation();

  if (position.x !== prevX || position.y !== prevY) {
    stepCount++;
    if (stepCount % 2 === 0) {
      statusValues.energy = Math.max(statusValues.energy - 1, 0);
      updateBars();
    }
    checkTrapCollision();
    lastMoveTime = Date.now();
  }
}

function checkPlayerLocation() {
  const playerPixels = getPositionInPixels(position.x, position.y);
  
  for (let [name, point] of Object.entries(locationPoints)) {
    let dx = point.x - playerPixels.x;
    let dy = point.y - playerPixels.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 50 && !visitedLocations.has(name)) {
      visitedLocations.add(name);
      console.log(`Visited: ${name}`);
      
      switch(name) {
        case 'home': uniqueLocations1 = true; break;
        case 'kuta': uniqueLocations2 = true; break;
        case 'borobudur': uniqueLocations3 = true; break;
        case 'bromo': uniqueLocations4 = true; break;
        case 'lake_toba': uniqueLocations5 = true; break;
      }
      
      if (uniqueLocations1 && uniqueLocations2 && uniqueLocations3 && 
          uniqueLocations4 && uniqueLocations5) {
        unlockAchievement("map");
      }
    }
  }
}

document.addEventListener("keydown", function (event) {
  const keyMap = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
  };
  if (keyMap[event.key]) move(keyMap[event.key]);
});

// Status system
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

// Level and achievements
const maxExp = 100;
let achievements = {
  photography: false,
  map: false,
  artifact: false,
  Composting: false,
};
let uniqueLocations1 = false;
let uniqueLocations2 = false;
let uniqueLocations3 = false;
let uniqueLocations4 = false;
let uniqueLocations5 = false;

function updateExpBar() {
  const expPercentage = (statusValues.exp / maxExp) * 100;
  document.getElementById("exp-bar").style.width = `${expPercentage}%`;
  document.getElementById("exp").textContent = `${statusValues.exp}`;
  if (statusValues.exp >= maxExp) {
    statusValues.exp = 0;
    statusValues.level++;
    alert(`Congratulations! You've leveled up to Level ${statusValues.level}!`);
  }
  document.getElementById("level1").textContent = `${statusValues.level}`;
  document.getElementById("level2").textContent = `${statusValues.level}`;
}

function gainExp(amount) {
  statusValues.exp += amount;
  updateExpBar();
}

function unlockAchievement(key) {
  if (achievements.hasOwnProperty(key) && !achievements[key]) {
    achievements[key] = true;
    updateAchievementsDisplay();
    console.log(`Achievement "${key}" unlocked!`);
  }
}

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
}

// Location and button updates
function updateButtonsAndThemes() {
  const playerPixels = getPositionInPixels(position.x, position.y);
  let currentLocation = null;
  let locationText = document.getElementById("location-text");
  let actions = ["action1", "action2", "action3", "action4"].map((id) =>
    document.getElementById(id)
  );
  let currentGameTime = new Date(
    gameStartTime.getTime() +
      (performance.now() - realStartTime) * timeSpeedMultiplier
  ).getHours();
  let body = document.body;

  // Check against original pixel coordinates
  for (let [name, point] of Object.entries(locationPoints)) {
    let dx = point.x - playerPixels.x;
    let dy = point.y - playerPixels.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 50) {
      currentLocation = name;
      break;
    }
  }

  if (currentLocation === "home") {
    setClickSoundForLocation();
    locationText.innerHTML = "You're at Tangerang";
    actions[0].innerHTML = "Get Some Meal";
    actions[0].onclick = () => performAction("getMeal");
    actions[1].innerHTML = "Take a Bath";
    actions[1].onclick = () => performAction("takeBath");
    actions[2].innerHTML = "Sleep";
    actions[2].onclick = () => performAction("sleep");
    actions[3].innerHTML = "🛈 Do Chores";
    actions[3].onclick = () => performAction("chores");
    body.style.backgroundImage =
      currentGameTime >= 18 || currentGameTime < 6
        ? "url('./assets/background/default-night.jpg')"
        : "url('./assets/background/default.jpg')";
  } 
  else if (currentLocation === "kuta") {
    setClickSoundForLocation();
    locationText.innerHTML = "You're at Kuta Beach";
    actions[0].innerHTML = "Sand Play";
    actions[0].onclick = () => performAction("sandPlay");
    actions[1].innerHTML = "🛈 Buy Drink";
    actions[1].onclick = () => performAction("buyDrink");
    actions[2].innerHTML = "🛈 Buy Snack";
    actions[2].onclick = () => performAction("buySnack");
    actions[3].innerHTML = "🛈 Pick-up Trash";
    actions[3].onclick = () => performAction("pickTrash");
    body.style.backgroundImage =
      currentGameTime >= 18 || currentGameTime < 6
        ? "url('./assets/background/kuta-night.jpg')"
        : "url('./assets/background/kuta.jpg')";
  }
  else if (currentLocation === "borobudur") {
    setClickSoundForLocation();
    locationText.innerHTML = "You're at Borobudur Temple";
    localStorage.setItem("currentLocation", "borobudur");
    actions[0].innerHTML = "Take a Picture";
    actions[0].onclick = () => performAction("takePicture1");
    actions[1].innerHTML = "🛈 Buy Local Food";
    actions[1].onclick = () => performAction("buyFood");
    actions[2].innerHTML = "🛈 Buy Souvenir";
    actions[2].onclick = () => performAction("buySouvenir");
    actions[3].innerHTML = "🛈 Rent Local Costume";
    actions[3].onclick = () => performAction("rentCostume");
    body.style.backgroundImage =
      currentGameTime >= 18 || currentGameTime < 6
        ? "url('./assets/background/borobudur-night.jpg')"
        : "url('./assets/background/borobudur.jpg')";
  }
  else if (currentLocation === "bromo") {
    setClickSoundForLocation();
    locationText.innerHTML = "You're at Bromo Mountain";
    actions[0].innerHTML = "Make a Cinematic Video";
    actions[0].onclick = () => performAction("makeVideo");
    actions[1].innerHTML = "🛈 Buy Drink";
    actions[1].onclick = () => performAction("buyDrink");
    actions[2].innerHTML = "🛈 Plant a Flag";
    actions[2].onclick = () => performAction("plantFlag");
    actions[3].innerHTML = "Pray to God";
    actions[3].onclick = () => performAction("pray");
    body.style.backgroundImage =
      currentGameTime >= 18 || currentGameTime < 6
        ? "url('./assets/background/bromo-night.jpg')"
        : "url('./assets/background/bromo.jpg')";
  }
  else if (currentLocation === "lake_toba") {
    setClickSoundForLocation();
    locationText.innerHTML = "You're at Toba Lake";
    localStorage.setItem("currentLocation", "lake-toba");
    actions[0].innerHTML = "Take a Shower";
    actions[0].onclick = () => performAction("takeShower");
    actions[1].innerHTML = "Catch a Fish";
    actions[1].onclick = () => performAction("catchFish");
    actions[2].innerHTML = "Take a Picture";
    actions[2].onclick = () => performAction("takePicture2");
    actions[3].innerHTML = "Wash Clothes";
    actions[3].onclick = () => performAction("washClothes");
    body.style.backgroundImage =
      currentGameTime >= 18 || currentGameTime < 6
        ? "url('./assets/background/toba-night.jpg')"
        : "url('./assets/background/toba.jpg')";
  }
  else {
    locationText.innerHTML = "You're Lost!";
    actions.forEach((action) => {
      action.innerHTML = "";
      action.onclick = null;
    });
    body.style.backgroundImage =
      currentGameTime >= 18 || currentGameTime < 6
        ? "url('./assets/background/default-night.jpg')"
        : "url('./assets/background/default.jpg')";
  }
}

// Trap system
const trap = document.getElementById("trap-net");
function moveTrapRandomly() {
  const xPercent = (Math.random() * 80) + 10;
  const yPercent = (Math.random() * 80) + 10;
  trap.style.left = `${xPercent}%`;
  trap.style.top = `${yPercent}%`;
}

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

// Death check
function checkIfDead() {
  if (
    statusValues.health <= 0 ||
    statusValues.energy <= 0 ||
    statusValues.hygiene <= 0 ||
    statusValues.happiness <= 0
  ) {
    const player = document.getElementById("player");
    const holeDeath = document.getElementById("hole-death");

    holeDeath.style.left = `${position.x}%`;
    holeDeath.style.top = `${position.y}%`;
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

// Sound system
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

// Theme system
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

// Popups
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
  }, 3000);
}

function playShower() {
  const sound = document.getElementById("shower-sound");
  sound.currentTime = 0;
  sound.play();
}

// Energy regeneration
function energyRegeneration() {
  const currentTime = Date.now();
  if (currentTime - lastMoveTime >= 30000) {
    if (statusValues.energy < 50) {
      statusValues.energy = Math.min(statusValues.energy + 1, 50);
      updateBars();
    }
  }
}
setInterval(energyRegeneration, 1000);

// Decay system
function decay() {
  statusValues.health = Math.max(statusValues.health - 5, 0);
  statusValues.hygiene = Math.max(statusValues.hygiene - 5, 0);
  statusValues.happiness = Math.max(statusValues.happiness - 5, 0);
  updateBars();
}
setInterval(decay, 60000);

// Initialize game
function initGame() {
  // Convert starting position from original pixels to percentages
  const startPos = getPositionInPercent(435, 260);
  position = { x: startPos.x, y: startPos.y };
  step = 2; // Percentage-based step size
  
  updatePlayerPosition();
  moveTrapRandomly();
  setInterval(moveTrapRandomly, 20000);
  
  // Set up button sounds
  document.querySelectorAll("button[id^='action']").forEach((btn) => {
    btn.addEventListener("click", playClickSound);
  });
  
  // Initialize achievements display
  updateAchievementsDisplay();
  
  // Start game systems
  requestAnimationFrame(updateGameClock);
  setInterval(checkIfDead, 1000);
  setInterval(energyRegeneration, 1000);
  setInterval(decay, 60000);
  
  // Initialize volume control
  const volumeSlider = document.getElementById("volumeSlider");
  function updateVolume() {
    document.getElementById("bgMusic").volume = volumeSlider.value;
  }
  volumeSlider.addEventListener("input", updateVolume);
  updateVolume();
}

// Handle window resize
window.addEventListener('resize', () => {
  updatePlayerPosition();
});

// Initialize achievements click handlers
document.querySelectorAll(".achievement-item").forEach((item) => {
  item.addEventListener("click", () => {
    const key = item.dataset.achievement;
    let taskMessage = "";
    switch (key) {
      case "photography":
        taskMessage = "Take 2 pictures around the map.";
        break;
      case "map":
        taskMessage = "Explore at least 5 unique locations.";
        break;
      case "artifact":
        taskMessage = "Collect 3.000.000 IDR.";
        break;
      case "Composting":
        taskMessage = "Collect 10 trash at Beach.";
        break;
    }
    alert(`Task to unlock "${key}":\n${taskMessage}`);
  });
});