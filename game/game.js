document.addEventListener("DOMContentLoaded", function () {
  let selectedCharacterImage =
    localStorage.getItem("selectedCharacterImage") ||
    "gameptiasset/assets/wayang1.png";
  let playerImg = document.getElementById("player-img");
  let playerName = localStorage.getItem("playerName") || "Player";

  if (playerImg) {
    playerImg.src = selectedCharacterImage;
  }

  document.getElementById("player-name").textContent = playerName;
});

function updateDateTime() {
  let gameTime = new Date();

  const optionsDate = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const optionsTime = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  let hours = gameTime.getHours();
  let greeting;

  if (hours < 12) {
    greeting = "Good Morning!";
  } else if (hours < 18) {
    greeting = "Good Afternoon!";
  } else {
    greeting = "Good Evening!";
  }

  document.getElementById("game-time").innerHTML = `
                <strong>${gameTime.toLocaleDateString(
                  "en-US",
                  optionsDate
                )}</strong><br>
                ${gameTime.toLocaleTimeString("en-US", optionsTime)}<br>
                ${greeting}
            `;
}

setInterval(updateDateTime, 1000);
updateDateTime();

let position = { x: 90, y: 120 };
let isFlipped = false;
const step = 30;

function move(direction) {
  const mapBounds = { left: 0, right: 800, top: 0, bottom: 500 };
  let player = document.getElementById("player");
  let playerImg = document.getElementById("player-img");
  let prevX = position.x;
  let prevY = position.y;
  if (!player) return;

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
  if (position.x === prevX && position.y === prevY) {
    player.style.animation = "shake 0.2s";
    setTimeout(() => (player.style.animation = ""), 200);
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
              }
                `;
  document.head.appendChild(style);
  updateLocationButtons();
}

let statusValues = {
  health: 100,
  energy: 100,
  hygiene: 100,
  happiness: 100,
};

function updateBars() {
  document.getElementById("health-bar").style.width = statusValues.health + "%";
  document.getElementById("energy-bar").style.width = statusValues.energy + "%";
  document.getElementById("hygiene-bar").style.width =
    statusValues.hygiene + "%";
  document.getElementById("happines-bar").style.width =
    statusValues.happiness + "%";

  document.querySelectorAll("#health-text")[0].textContent =
    statusValues.health + "%";
  document.querySelectorAll("#health-text")[1].textContent =
    statusValues.energy + "%";
  document.querySelectorAll("#health-text")[2].textContent =
    statusValues.hygiene + "%";
  document.querySelectorAll("#health-text")[3].textContent =
    statusValues.happiness + "%";
}

function performAction(action) {
  switch (action) {
    case "getMeal":
      statusValues.health = Math.min(statusValues.health + 10, 100);
      statusValues.energy = Math.min(statusValues.energy + 5, 100);
      break;
    case "takeBath":
      statusValues.hygiene = Math.min(statusValues.hygiene + 15, 100);
      statusValues.happiness = Math.min(statusValues.happiness + 5, 100);
      break;
    case "sleep":
      statusValues.energy = Math.min(statusValues.energy + 20, 100);
      break;
    case "chores":
      statusValues.energy = Math.max(statusValues.energy - 10, 0);
      statusValues.happiness = Math.min(statusValues.happiness + 5, 100);
      break;
    case "sandPlay":
      statusValues.happiness = Math.min(statusValues.happiness + 10, 100);
      break;
    case "buyDrink":
      statusValues.health = Math.min(statusValues.health + 5, 100);
      statusValues.energy = Math.min(statusValues.energy + 10, 100);
      break;
    case "buySnack":
      statusValues.health = Math.min(statusValues.health + 8, 100);
      break;
    case "pickTrash":
      statusValues.happiness = Math.min(statusValues.happiness + 10, 100);
      statusValues.energy = Math.max(statusValues.energy - 5, 0);
      break;
    case "takePicture":
      statusValues.happiness = Math.min(statusValues.happiness + 10, 100);
      break;
    case "buyFood":
      statusValues.health = Math.min(statusValues.health + 12, 100);
      break;
    case "buySouvenir":
      statusValues.happiness = Math.min(statusValues.happiness + 10, 100);
      break;
    case "rentCostume":
      statusValues.happiness = Math.min(statusValues.happiness + 15, 100);
      break;
    case "cinematicVideo":
      statusValues.happiness = Math.min(statusValues.happiness + 15, 100);
      statusValues.energy = Math.max(statusValues.energy - 10, 0);
      break;
    case "plantFlag":
      statusValues.happiness = Math.min(statusValues.happiness + 20, 100);
      break;
    case "pray":
      statusValues.happiness = Math.min(statusValues.happiness + 25, 100);
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
    default:
      break;
  }
  updateBars();
}

function updateLocationButtons() {
  let locationText = document.getElementById("location-text");
  let actions = ["action1", "action2", "action3", "action4"].map((id) =>
    document.getElementById(id)
  );

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
  } else if (
    Math.abs(position.x - 280) < 60 &&
    Math.abs(position.y - 440) < 60
  ) {
    locationText.innerHTML = "You're at Kuta Beach";
    actions[0].innerHTML = "Sand Play";
    actions[0].onclick = () => performAction("sandPlay");
    actions[1].innerHTML = "🛈 Buy Drink";
    actions[1].onclick = () => performAction("buyDrink");
    actions[2].innerHTML = "🛈 Buy Snack";
    actions[2].onclick = () => performAction("buySnack");
    actions[3].innerHTML = "🛈 Pick-up Trash";
    actions[3].onclick = () => performAction("pickTrash");
  } else if (
    Math.abs(position.x - 690) < 60 &&
    Math.abs(position.y - 210) < 60
  ) {
    locationText.innerHTML = "You're at Borobudur Temple";
    actions[0].innerHTML = "Take a Picture";
    actions[0].onclick = () => performAction("takePicture");
    actions[1].innerHTML = "🛈 Buy Local Food";
    actions[1].onclick = () => performAction("buyFood");
    actions[2].innerHTML = "🛈 Buy Souvenir";
    actions[2].onclick = () => performAction("buySouvenir");
    actions[3].innerHTML = "🛈 Rent Local Costume";
    actions[3].onclick = () => performAction("rentCostume");
  } else {
    locationText.innerHTML = "You're Lost!";
    actions.forEach((action) => {
      action.innerHTML = "";
      action.onclick = null;
    });
  }
}

updateBars();

document.addEventListener("keydown", function (event) {
  const keyMap = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
  };
  if (keyMap[event.key]) move(keyMap[event.key]);
});
