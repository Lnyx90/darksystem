//Player, Hole, and PopUp
document.addEventListener("DOMContentLoaded", function () {
  let playerName = localStorage.getItem("playerName");
  let selectedCharacterImage = localStorage.getItem("selectedCharacterImage");

  document.getElementById("player-name").textContent = playerName;
  document.getElementById("player-welcome-name").textContent = playerName;
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

//Theme
function updateTheme() {
  let currentHour = new Date().getHours();
  let body = document.body;
  let statusBar = document.querySelector(".status-bar");
  let taskTexts = document.querySelectorAll("#health-text, #energy-text, #hygiene-text, #happiness-text");

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
      taskTexts.forEach(text => {
          text.style.color = "white";
      });

      if (volumeLabel) volumeLabel.style.color = "white";
  } else {
      gameTitle.style.color = "";
      gameTime.style.color = "";
      gameDay1.style.color = "";
      gameDay2.style.color = "";
      taskTexts.forEach(text => {
          text.style.color = "black";
      });

      if (volumeLabel) volumeLabel.style.color = "";
  }
}

setInterval(updateTheme, 1000);
updateTheme();

//Player movement & position
let position = { x: 435, y: 260 };
let step = 15;

let hole = document.querySelector("img[src='./assets/logo-and-character/hole.png']");
let player = document.getElementById("player");
player.style.opacity = "0";
player.style.transform = "scale(0.2) translateY(20px)";

setTimeout(() => {
  player.style.animation = "emerge 0.5s forwards";
}, 500);

function closePopup() {
  document.getElementById("welcome-popup").style.display = "none";
  setTimeout(() => {
    player.style.opacity = "1";
    player.style.animation = "emergeFromHole 0.5s forwards";
  }, 500);
}

//Time and Date
const realStartTime = performance.now()
  const gameStartTime = new Date()
  const timeSpeedMultiplier = 10

  function updateGameClock() {
    const now = performance.now()
    const elapsedReal = now - realStartTime
    const elapsedGame = elapsedReal * timeSpeedMultiplier
    const currentGameTime = new Date(gameStartTime.getTime() + elapsedGame)

    const optionsTime = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    }

    const optionsDate = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    }

    const hours = currentGameTime.getHours()
    const greeting =
      hours < 12
        ? "Good Morning!"
        : hours < 18
        ? "Good Afternoon!"
        : "Good Evening!"

    document.getElementById("game-time").innerHTML =
      currentGameTime.toLocaleTimeString("en-US", optionsTime)

    document.getElementById("game-day1").innerHTML =
      currentGameTime.toLocaleDateString("en-US", optionsDate)

    document.getElementById("game-day2").innerHTML = greeting

    requestAnimationFrame(updateGameClock);
  }

  requestAnimationFrame(updateGameClock);

//Movement and Energy
function move(direction) {
  const mapBounds = { left: 0, right: 800, top: 0, bottom: 500 };
  let player = document.getElementById("player");
  let playerImg = document.getElementById("player-img");
  let prevX = position.x;
  let prevY = position.y;
  if (!player) return;

  if (statusValues.energy != 0) {
    switch (direction) {
      case "up":
        if (position.y - step >= mapBounds.top) position.y -= step;
        break;
      case "down":
        if (position.y + step <= mapBounds.bottom) position.y += step;
        break;
      case "left":
        if (position.x - step >= mapBounds.left) position.x -= step;
        playerImg.style.transform = "scaleX(-1)";
        break;
      case "right":
        if (position.x + step <= mapBounds.right) position.x += step;
        playerImg.style.transform = "scaleX(1)";
        break;
    }
  }

  if (position.x === prevX && position.y === prevY) {
    player.style.animation = "shake 0.2s";
    setTimeout(() => (player.style.animation = ""), 200);
  }

  if (Math.abs(position.x - 435) > 10 || Math.abs(position.y - 260) > 10) {
    hole.style.transition = "opacity 0.5s";
    hole.style.opacity = "0";
    setTimeout(() => hole.remove(), 500);
  }

  player.style.left = position.x + "px";
  player.style.top = position.y + "px";
  
  const style = document.createElement("style");
  style.innerHTML = `
      @keyframes shake {
        0% { transform: translateX(0); }
        25% { transform: translateX(-3px); }
        50% { transform: translateX(3px); }
        75% { transform: translateX(-3px); }
        100% { transform: translateX(0); }
      }`;
  document.head.appendChild(style);
  
  setTimeout(() => {
    player.style.transform = "scale(1)";
  }, 200);
  
  updateButtonsAndThemes();

  if (position.x !== prevX || position.y !== prevY) {
    statusValues.energy = Math.max(statusValues.energy - 1, 0);
    updateBars();
  }
}

function healthDecaysNoEnergy() {
  if (statusValues.energy === 0) {
    statusValues.health = Math.max(statusValues.health - 20, 0);
  }
  updateBars();
}
setInterval(healthDecaysNoEnergy, 20000);

document.addEventListener("keydown", function (event) {
  const keyMap = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
  };
  if (keyMap[event.key]) move(keyMap[event.key]);
});

// Status and Money System
let statusValues = {
  health: 50,
  energy: 50,
  hygiene: 50,
  happiness: 50,
  money: 100000
};

function updateBars() {
  document.getElementById("health-bar").style.width = statusValues.health + "%";
  document.getElementById("energy-bar").style.width = statusValues.energy + "%";
  document.getElementById("hygiene-bar").style.width = statusValues.hygiene + "%";
  document.getElementById("happiness-bar").style.width = statusValues.happiness + "%";

  document.getElementById("health-text").textContent = statusValues.health + "%";
  document.getElementById("energy-text").textContent = statusValues.energy + "%";
  document.getElementById("hygiene-text").textContent = statusValues.hygiene + "%";
  document.getElementById("happiness-text").textContent = statusValues.happiness + "%";
  
  updateMoneyDisplay();
}

function updateMoneyDisplay() {
  const moneySpan = document.getElementById("money");
  if (moneySpan) {
    moneySpan.textContent = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(statusValues.money);
  }
}

// Actions
function performAction(action) {
  switch (action) {
    case "getMeal":
      statusValues.health = Math.min(statusValues.health + 10, 100);
      statusValues.energy = Math.min(statusValues.energy + 20, 100);
      break;
    case "takeBath":
      statusValues.hygiene = Math.min(statusValues.hygiene + 30, 100);
      statusValues.happiness = Math.min(statusValues.happiness + 10, 100);
      break;
    case "sleep":
      statusValues.energy = Math.min(statusValues.energy + 40, 100);
      statusValues.health = Math.max(statusValues.health - 20, 0);
      break;
    case "chores":
      statusValues.energy = Math.max(statusValues.energy - 3, 0);
      statusValues.health = Math.max(statusValues.health - 1, 0);
      statusValues.hygiene = Math.max(statusValues.hygiene - 2, 0);
      statusValues.money += 100000;
      break;
    case "sandPlay":
      statusValues.happiness = Math.min(statusValues.happiness + 3, 100);
      statusValues.energy = Math.max(statusValues.energy - 2, 0);
      statusValues.hygiene = Math.max(statusValues.hygiene - 3, 0);
      break;
    case "buyDrink":
      statusValues.health = Math.min(statusValues.health + 3, 100);
      statusValues.energy = Math.min(statusValues.energy + 3, 100);
      statusValues.happiness = Math.min(statusValues.happiness + 3, 100);
      statusValues.money = Math.max(statusValues.money - 10000, 0);
      break;
    case "buySnack":
      statusValues.health = Math.min(statusValues.health + 2, 100);
      statusValues.energy = Math.min(statusValues.energy + 2, 100);
      statusValues.happiness = Math.min(statusValues.happiness + 1, 100);
      statusValues.money = Math.max(statusValues.money - 25000, 0);
      break;
    case "pickTrash":
      statusValues.happiness = Math.min(statusValues.happiness + 1, 100);
      statusValues.energy = Math.max(statusValues.energy - 2, 0);
      statusValues.hygiene = Math.max(statusValues.hygiene - 4, 0);
      statusValues.money += 115000;
      break;
    case "takePicture":
      statusValues.happiness = Math.min(statusValues.happiness + 4, 100);
      statusValues.energy = Math.max(statusValues.energy - 2, 0);
      break;
    case "buyFood":
      statusValues.health = Math.min(statusValues.health + 2, 100);
      statusValues.happiness = Math.min(statusValues.happiness + 1, 100);
      statusValues.energy = Math.min(statusValues.energy + 2, 100);
      statusValues.money = Math.max(statusValues.money - 50000, 0);
      break;
    case "buySouvenir":
      statusValues.happiness = Math.min(statusValues.happiness + 3, 100);
      statusValues.money = Math.max(statusValues.money - 30000, 0);
      break;
    case "rentCostume":
      statusValues.happiness = Math.min(statusValues.happiness + 3, 100);
      statusValues.money = Math.max(statusValues.money - 80000, 0);
      break;
    case "takeShower":
      statusValues.hygiene = Math.min(statusValues.hygiene + 20, 100);
      break;
    case "catchFish":
      statusValues.health = Math.min(statusValues.health + 10, 100);
      break;
    case "washClothes":
      statusValues.hygiene = Math.min(statusValues.hygiene + 10, 100);
      statusValues.energy = Math.max(statusValues.energy - 5, 0);
      break;
    case "makeVideo":
      statusValues.happiness = Math.min(statusValues.happiness + 15, 100);
      statusValues.energy = Math.max(statusValues.energy - 10, 0);
      break;
    case "plantFlag":
      statusValues.happiness = Math.min(statusValues.happiness + 20, 100);
      break;
    case "pray":
      statusValues.happiness = Math.min(statusValues.happiness + 25, 100);
      break;
    default:
      break;
  }
  updateBars();
}

// Location and Button Updates
function updateButtonsAndThemes() {
  let locationText = document.getElementById("location-text");
  let actions = ["action1", "action2", "action3", "action4"].map(id => document.getElementById(id));
  let currentHour = new Date().getHours();
  let body = document.body;

  if (Math.abs(position.x - 60) < 50 && Math.abs(position.y - 90) < 50) {
    locationText.innerHTML = "You're at Tangerang";
    actions[0].innerHTML = "Get Some Meal";
    actions[0].onclick = () => performAction("getMeal");
    actions[1].innerHTML = "Take a Bath";
    actions[1].onclick = () => performAction("takeBath");
    actions[2].innerHTML = "Sleep";
    actions[2].onclick = () => performAction("sleep");
    actions[3].innerHTML = "🛈 Do Chores";
    actions[3].onclick = () => performAction("chores");
    body.style.backgroundImage = currentHour >= 18 || currentHour < 6 ? 
      "url('./assets/background/default-night.jpg')" : "url('./assets/background/default.jpg')";
  } 
  else if (Math.abs(position.x - 280) < 60 && Math.abs(position.y - 440) < 60) {
    locationText.innerHTML = "You're at Kuta Beach";
    actions[0].innerHTML = "Sand Play";
    actions[0].onclick = () => performAction("sandPlay");
    actions[1].innerHTML = "🛈 Buy Drink";
    actions[1].onclick = () => performAction("buyDrink");
    actions[2].innerHTML = "🛈 Buy Snack";
    actions[2].onclick = () => performAction("buySnack");
    actions[3].innerHTML = "🛈 Pick-up Trash";
    actions[3].onclick = () => performAction("pickTrash");
    body.style.backgroundImage = "url('./assets/background/kuta.jpg')";
  }
  else if (Math.abs(position.x - 690) < 60 && Math.abs(position.y - 210) < 60) {
    locationText.innerHTML = "You're at Borobudur Temple";
    actions[0].innerHTML = "Take a Picture";
    actions[0].onclick = () => performAction("takePicture");
    actions[1].innerHTML = "🛈 Buy Local Food";
    actions[1].onclick = () => performAction("buyFood");
    actions[2].innerHTML = "🛈 Buy Souvenir";
    actions[2].onclick = () => performAction("buySouvenir");
    actions[3].innerHTML = "🛈 Rent Local Costume";
    actions[3].onclick = () => performAction("rentCostume");
    body.style.backgroundImage = currentHour >= 18 || currentHour < 6 ?
      "url('./assets/background/borobudur-night.jpg')" : "url('./assets/background/borobudur.jpg')";
  }
  else if (Math.abs(position.x - 770) < 60 && Math.abs(position.y - 460) < 60) {
    locationText.innerHTML = "You're at Bromo Mountain";
    actions[0].innerHTML = "Make a Cinematic Video";
    actions[0].onclick = () => performAction("makeVideo");
    actions[1].innerHTML = "🛈 Buy Drink";
    actions[1].onclick = () => performAction("buyDrink");
    actions[2].innerHTML = "🛈 Plant a Flag";
    actions[2].onclick = () => performAction("plantFlag");
    actions[3].innerHTML = "Pray to God";
    actions[3].onclick = () => performAction("pray");
    body.style.backgroundImage = currentHour >= 18 || currentHour < 6 ?
      "url('./assets/background/bromo-night.jpg')" : "url('./assets/background/bromo.jpg')";
  }
  else if (Math.abs(position.x - 385) < 60 && Math.abs(position.y - 25) < 15) {
    locationText.innerHTML = "You're at Toba Lake";
    actions[0].innerHTML = "Take a Shower";
    actions[0].onclick = () => performAction("takeShower");
    actions[1].innerHTML = "Catch a Fish";
    actions[1].onclick = () => performAction("catchFish");
    actions[2].innerHTML = "Take a Picture";
    actions[2].onclick = () => performAction("takePicture");
    actions[3].innerHTML = "Wash Clothes";
    actions[3].onclick = () => performAction("washClothes");
    body.style.backgroundImage = currentHour >= 18 || currentHour < 6 ?
      "url('./assets/background/toba-night.jpg')" : "url('./assets/background/toba.jpg')";
  }
  else {
    locationText.innerHTML = "You're Lost!";
    actions.forEach(action => {
      action.innerHTML = "";
      action.onclick = null;
    });
    body.style.backgroundImage = currentHour >= 18 || currentHour < 6 ?
      "url('./assets/background/default-night.jpg')" : "url('./assets/background/default.jpg')";
  }
}

// Trap and Music
const trap = document.getElementById("trap-net");
function moveTrapRandomly() {
  const x = Math.floor(Math.random() * (850 - 64));
  const y = Math.floor(Math.random() * (680 - 64));
  trap.style.left = `${x}px`;
  trap.style.top = `${y}px`;
}
setInterval(moveTrapRandomly, 20000);

const bgMusic = document.getElementById("bgMusic");
const volumeSlider = document.getElementById("volumeSlider");
function updateVolume() {
  bgMusic.volume = volumeSlider.value;
}
volumeSlider.addEventListener('input', updateVolume);

// Decay System
function decay() {
  statusValues.health = Math.max(statusValues.health - 1, 0);
  statusValues.energy = Math.max(statusValues.energy - 1, 0);
  statusValues.hygiene = Math.max(statusValues.hygiene - 1, 0);
  statusValues.happiness = Math.max(statusValues.happiness - 1, 0);
  updateBars();
}
setInterval(decay, 60000);

// Initial setup
updateBars();
updateButtonsAndThemes();


let moneyy = 1000;


//Money
window.addEventListener("DOMContentLoaded", () => {
  updateMoneyDisplay();
});

function updateMoneyDisplay() {
  const moneySpan = document.getElementById("moneyy");
  if (moneySpan) {
    moneySpan.textContent = `$${moneyy}`;
  } 
}

