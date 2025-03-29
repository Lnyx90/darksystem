document.addEventListener("DOMContentLoaded", () => {
  const bgMusic = document.getElementById("bgMusic");

  document.body.addEventListener("click", () => {
      if (bgMusic.paused) {
          bgMusic.play().catch(error => console.log("Autoplay prevented:", error));
      }
  });
});

document.addEventListener("DOMContentLoaded", function () {
    let playerName = localStorage.getItem("playerName");
            let selectedCharacterImage = localStorage.getItem("selectedCharacterImage");

           
            if (!playerName) {
                playerName = "Player";
            }

        
            if (!selectedCharacterImage) {
                selectedCharacterImage = "gameptiasset/assets/wayang1.png";
            }

          
            document.getElementById("player-name").textContent = playerName;
            document.getElementById("player-welcome-name").textContent = playerName;
            document.getElementById("player-img").src = selectedCharacterImage;
        });

        let position = { x: 435, y: 260 }; 
        let step = 30;
        let hole = document.querySelector("img[src='gameptiasset/assets/hole.png']");
        let player = document.getElementById("player");
        player.style.opacity = "0";
        player.style.transform = "scale(0.2) translateY(20px)";
        
        setTimeout(() => {
            player.style.animation = "emerge 0.5s forwards";
        }, 500);

        document.addEventListener("DOMContentLoaded", function () {
          let playerName = localStorage.getItem("playerName") || "Player";
          let characterImg = localStorage.getItem("selectedCharacterImage") || "";
        
          document.getElementById("player-welcome-name").innerText = playerName;
          
          if (characterImg) {
              let imgElement = document.getElementById("player-character-img");
              imgElement.src = characterImg;
              imgElement.classList.remove("hidden"); 
          }
        });

        function closePopup() {
            document.getElementById("welcome-popup").style.display = "none";

            setTimeout(() => {
                player.style.opacity = "1";
                player.style.animation = "emergeFromHole 0.5s forwards";
            }, 500);
        }
        function updateBackground() {
          let currentHour = new Date().getHours();
          let body = document.body;
  
          if (currentHour >= 18 || currentHour < 6) {
              body.style.backgroundImage = "url('gameptiasset/assets/nightbg.jpg')";
          } else {
              body.style.backgroundImage = "url('gameptiasset/assets/PageGame.jpg')";
          }
      }
      function updateTheme() {
        let currentHour = new Date().getHours();
        let body = document.body;
        let statusBar = document.querySelector(".status-bar");
        let taskTexts = document.querySelectorAll("#health-text");

        let gameTitle = document.querySelector(".status-bar strong");
        let gameTime = document.getElementById("game-time");
        let gameDay1 = document.getElementById("game-day1");
        let gameDay2 = document.getElementById("game-day2");

        if (currentHour >= 18 || currentHour < 6) {
            body.style.backgroundImage = "url('gameptiasset/assets/nightbg.jpg')";
            gameTitle.style.color = "white";
            gameTime.style.color = "black";
            gameDay1.style.color = "white";
            gameDay2.style.color = "white";
            taskTexts.forEach(text => {
                text.style.color = "white";
            });

        } else {
            body.style.backgroundImage = "url('gameptiasset/assets/PageGame.jpg')";
            gameTitle.style.color = "";
            gameTime.style.color = "";
            gameDay1.style.color = "";
            gameDay2.style.color = "";
            taskTexts.forEach(text => {
                text.style.color = "black";
            });
        }
    }

    setInterval(updateTheme, 1000);
    updateTheme();
  
    setInterval(updateBackground, 1000); 
    updateBackground();

function updateTime() {
  let gameTime = new Date();
  const optionsTime = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  while(optionsTime==true){
    gameTime.setSeconds(gameTime.getSeconds() + 60);
  }

  document.getElementById("game-time").innerHTML = `
                ${gameTime.toLocaleTimeString("en-US", optionsTime)}
            `;
}

let realStartTime = new Date(); 
let offsetSeconds = 0; 

function updateTime() {
  let gameTime = new Date(realStartTime.getTime() + offsetSeconds * 60);
  const optionsTime = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

    document.getElementById("game-time").innerHTML = `
      ${gameTime.toLocaleTimeString("en-US", optionsTime)}
    `;

    offsetSeconds += 360;
    }

function updateDate() {
  let gameDate = new Date();
  const optionsDate = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
};

  let hours = gameDate.getHours();
  let greeting;

    if (hours < 12) {
      greeting = "Good Morning!";
    } else if (hours < 18) {
      greeting = "Good Afternoon!";
    } else {
      greeting = "Good Evening!";
    }

  document.getElementById("game-day1").innerHTML = `
    ${gameDate.toLocaleDateString("en-US", optionsDate)}
  `;
  document.getElementById("game-day2").innerHTML = `
    ${greeting}
  `;
}

setInterval(updateTime, 1000);
setInterval(updateDate, 1000);
updateTime();
updateDate();


function move(direction) {
    const mapBounds = { left: 0, right: 800, top: 0, bottom: 500 };
    let player = document.getElementById("player");
    let playerImg = document.getElementById("player-img");
    let prevX = position.x;
    let prevY = position.y;
    if (!player) return;

    switch (direction) {
      case 'up': 
          if (position.y - step >= mapBounds.top) position.y -= step; 
          break;
      case 'down': 
          if (position.y + step <= mapBounds.bottom) position.y += step; 
          break;
      case 'left': 
          if (position.x - step >= mapBounds.left) position.x -= step;
             playerImg.style.transform = "scaleX(-1)"; 
          break;
      case 'right': 
          if (position.x + step <= mapBounds.right) position.x += step;
            playerImg.style.transform = "scaleX(1)"; 
          break;
    }
    if (position.x === prevX && position.y === prevY) {
        player.style.animation = "shake 0.2s";
        setTimeout(() => player.style.animation = "", 200);
    }

    if (Math.abs(position.x - 435) > 10 || Math.abs(position.y - 260) > 10) {
        hole.style.transition = "opacity 0.5s";
        hole.style.opacity = "0";
        setTimeout(() => hole.remove(), 500);
    }


    player.style.left = position.x + "px";
    player.style.top = position.y + "px";
    const style = document.createElement('style');

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
    setTimeout(() => {
        player.style.transform = "scale(1)";
    }, 200);
    updateLocationButtons();
    updateTheme(); 
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
  document.getElementById("hygiene-bar").style.width = statusValues.hygiene + "%";
  document.getElementById("happiness-bar").style.width = statusValues.happiness + "%"; 

  document.getElementById("health-text").textContent = statusValues.health + "%";
  document.getElementById("energy-text").textContent = statusValues.energy + "%";
  document.getElementById("hygiene-text").textContent = statusValues.hygiene + "%";
  document.getElementById("happiness-text").textContent = statusValues.happiness + "%";
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

    document.body.style.backgroundImage =
      "url('./gameptiasset/assets/PageGame.jpg')";
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

    document.body.style.backgroundImage =
      "url('./gameptiasset/assets/kutaBG.jpg')";
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

    document.body.style.backgroundImage =
      "url('./gameptiasset/assets/borobudurbg.jpg')";
  } else if (
    Math.abs(position.x - 770) < 60 &&
    Math.abs(position.y - 460) < 60
  ) {
    locationText.innerHTML = "You're at Bromo Mountain";
    actions[0].innerHTML = "Make a Cinematic Video";
    actions[0].onclick = () => performAction("makeVideo");
    actions[1].innerHTML = "🛈 Buy Drink";
    actions[1].onclick = () => performAction("buyDrink");
    actions[2].innerHTML = "🛈 Plant a Flag";
    actions[2].onclick = () => performAction("plantFlag");
    actions[3].innerHTML = "Pray to God";
    actions[3].onclick = () => performAction("pray");
    document.getElementsByClassName("gift");
    document.body.style.backgroundImage =
      "url('./gameptiasset/assets/bgBromo.jpg')";
  } else if (Math.abs(position.x - 390) < 60 && Math.abs(position.y - 70) < 60) {
    locationText.innerHTML = "You're at Toba Lake";
    actions[0].innerHTML = "Take a Shower";
    actions[1].innerHTML = "Catch a Fish";
    actions[2].innerHTML = "Take a Picture";
    actions[3].innerHTML = "Washing Chlotes";
    document.getElementsByClassName("gift");
    document.body.style.backgroundImage =
      "url('./gameptiasset/assets/bgLake.avif')";
  } else {
    locationText.innerHTML = "You're Lost!";
    actions.forEach((action) => {
      action.innerHTML = "";
      action.onclick = null;
      document.body.style.backgroundImage =
        "url('gameptiasset/assets/PageGame.jpg')";
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