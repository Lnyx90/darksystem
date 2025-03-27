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

        function closePopup() {
            document.getElementById("welcome-popup").style.display = "none";
        
            // Efek karakter muncul dari hole
            setTimeout(() => {
                player.style.opacity = "1";
                player.style.animation = "emergeFromHole 0.5s forwards";
            }, 500);
        }

        function updateDateTime() {
            let gameTime = new Date();
            
            const optionsDate = { 
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            };

            const optionsTime = { 
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true 
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
                <strong>${gameTime.toLocaleDateString("en-US", optionsDate)}</strong><br>
                ${gameTime.toLocaleTimeString("en-US", optionsTime)}<br>
                ${greeting}
            `;
        }


        setInterval(updateDateTime, 1000);
        updateDateTime();

      function move(direction) {
            const mapBounds = { left: 0, right: 850, top: 0, bottom: 600 };
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
            updateLocationButtons();
        }

        function updateLocationButtons() {
            let locationText = document.getElementById("location-text");
            let actions = ["action1", "action2", "action3", "action4"].map(id => document.getElementById(id));

            if (Math.abs(position.x - 60) < 50 && Math.abs(position.y - 90) < 50) {
                locationText.innerHTML = "You're at Tangerang";
                actions[0].innerHTML = "Get Some Meal";
                actions[1].innerHTML = "Take a Bath";
                actions[2].innerHTML = "Sleep";
                actions[3].innerHTML = "🛈 Do Chores";
                document.getElementsByClassName("gift");
            } else if (Math.abs(position.x - 280) < 60 && Math.abs(position.y - 440) < 60) {
                locationText.innerHTML = "You're at Kuta Beach";
                actions[0].innerHTML = "Sand Play";
                actions[1].innerHTML = "🛈 Buy Drink";
                actions[2].innerHTML = "🛈 Buy Snack";
                actions[3].innerHTML = "🛈 Pick-up Trash";
                document.getElementsByClassName("gift");
            } else if (Math.abs(position.x - 690) < 60 && Math.abs(position.y - 210) < 60) {
                locationText.innerHTML = "You're at Borobudur Temple";
                actions[0].innerHTML = "Take a Picture";
                actions[1].innerHTML = "🛈 Buy Local Food";
                actions[2].innerHTML = "🛈 Buy Souvenir";
                actions[3].innerHTML = "🛈 Rent Local Costum";
                document.getElementsByClassName("gift");
            } else if (Math.abs(position.x - 770) < 60 && Math.abs(position.y - 460) < 60) {
                locationText.innerHTML = "You're at Bromo Mountain";
                actions[0].innerHTML = "Make a Cinematic Video";
                actions[1].innerHTML = "🛈 Buy Drink";
                actions[2].innerHTML = "🛈 Plant a Flag";
                actions[3].innerHTML = "Pray to God";
                document.getElementsByClassName("gift");
            } else if (Math.abs(position.x - 390) < 60 && Math.abs(position.y - 70) < 60) {
                locationText.innerHTML = "You're at Toba Lake";
                actions[0].innerHTML = "Take a Shower";
                actions[1].innerHTML = "Catch a Fish";
                actions[2].innerHTML = "Take a Picture";
                actions[3].innerHTML = "Washing Chlotes";
                document.getElementsByClassName("gift");
            } else {
                locationText.innerHTML = "You're Lost!";
                actions.forEach(action => action.innerHTML = "");
            }
        }

        document.addEventListener("keydown", function(event) {
            const keyMap = { "ArrowUp": 'up', "ArrowDown": 'down', "ArrowLeft": 'left', "ArrowRight": 'right' };
            if (keyMap[event.key]) move(keyMap[event.key]);
        });