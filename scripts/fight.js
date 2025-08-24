import { pokemons } from "./characters-config.js"; // list of pokemons


const defaultPokemon = "bulbasaur";
const sex = localStorage.getItem("sex");
const fightButton = document.getElementById("fight-button");
const settingsButton = document.getElementById('settings-button');
const logsList = document.getElementById("logs-list");
const playerPictureContainer = document.querySelectorAll('.player-pokemon-picture');
const enemyPictureContainer = document.querySelectorAll('.enemy-pokemon-picture');
const winStats = document.querySelector('#win-stats');
const loseStats = document.querySelector('#lose-stats');
const visiblePlayerHealth = document.querySelector('#player-health');
const visiblePlayerLvl = document.querySelector('#player-lvl');
const visibleEnemyName = document.querySelector('#enemy-name');
const visibleEnemyHealth = document.querySelector('#enemy-health');
const visibleEnemyLvl = document.querySelector('#enemy-lvl');

const attackZones = ["atk-head", "atk-chest", "atk-torso", "atk-groin", "atk-legs"];
const defendZones = ["def-head", "def-chest", "def-torso", "def-groin", "def-legs"];

let playerselectedPokemon = localStorage.getItem("selectedPokemon");

let playerPokemon = { ...pokemons[playerselectedPokemon] }; // do a copy by selected pokemon
let botPokemonName = null; //just a name
let botPokemon = null;


let winCounter = localStorage.getItem("wins");
let loseCounter = localStorage.getItem("loses");
winStats.textContent = winCounter;
loseStats.textContent = loseCounter;
// LOGIC

function getRandomZones(array, count) {
  const copy = array.slice(); // array copy, for using again
  const result = [];

  while (result.length < count) {
    const randomIndex = Math.floor(Math.random() * copy.length);
    result.push(copy[randomIndex]);
    copy.splice(randomIndex, 1); // delete by index to not use it again
  }

  return result;
}


function calculateDamage(attackZones, defenseZones, damage, criticaHitChance, criticalHitChance) {
  let totalDamage = 0;
  let wasCrit = false; // for logging

  attackZones.flat().forEach(zone => { //.flat to prevent inner arrays (arrays in arrays [atk-head, [atk-groin], atk-chest], etc)
    if (!defenseZones.includes("def-" + zone.split("-")[1])) { // split on 2 elements in array and takes second [1] atk-head = head
        //if true - deal dmg
      const isCrit = Math.random() * 100 < criticaHitChance;
      if (isCrit) wasCrit = true;
      totalDamage += isCrit ? damage * criticalHitChance : damage;
    }
  });

  return {totalDamage, wasCrit};
}


function chooseBot() {
  const allPokemons = Object.keys(pokemons); // allPokemons is array of pokemons keys
  if (!botPokemon || botPokemon.health <= 0) {
    botPokemonName = allPokemons[Math.floor(Math.random() * allPokemons.length)];
    botPokemon = { ...pokemons[botPokemonName] }; // copy of bot {...} to manage health
    console.log(`Новый бот выбран: ${botPokemon.name}`);
  }
}


function showContinueDialog(onYes, onNo, winner) {
  const resultWindow = document.createElement("div");
  resultWindow.className = "game-result-dialog";
  resultWindow.innerHTML = `
                        <div class="dialog-box">
                        <p>Победил ${winner}!</p>
                        <p>Повторить с этим же соперником?</p>
                        <button id="repeat-yes">Да</button>
                        <button id="repeat-no">Нет, другого</button>
                        </div>
                    `
  ;
  document.body.appendChild(resultWindow); // add this div to the end of html next to </body>

  document.getElementById("repeat-yes").onclick = () => {
    resultWindow.remove();
    onYes(winner);
  };
  document.getElementById("repeat-no").onclick = () => {
    resultWindow.remove();
    onNo(winner);
  };
}

// getting pressed buttons
function getSelectedZones() {
  const atkButtons = Array.from(document.querySelectorAll('.attack-buttons input'))
                    // Array.from = NodeList -> normal array
                      .find(checkbox => checkbox.checked)?.value || null;
                    // .find - finds 1st el of array that is true

  const defButtons = Array.from(document.querySelectorAll('.defend-buttons input'))
                       .filter(checkbox => checkbox.checked)
                    // .filter - finds all el of array that is true and return it as array even if it find only 1 el 
                       .map(checkbox => checkbox.value);

  return { atkButtons, defButtons };
}

let nickname = "";
let isBattleFinished = true;
initPlayerPokemon();

settingsButton.addEventListener("click", () => {
 if (isBattleFinished === false) { 
  addLog("Игрок зашел в настройки. Бой прерван - НР покемонов будут восстановлены.");
  isBattleFinished = true;
  fightButton.textContent = "Начать бой!";
  botPokemon = { ...pokemons[botPokemonName] }; 
 }
});

// Listeners
fightButton.addEventListener("click", () => {
  const { atkButtons, defButtons } = getSelectedZones();

  if (!atkButtons) {
    alert("Выберите 1 зону атаки");
    return;
  }
  if (defButtons.length !== 2) {
    alert("Нужно выбрать 2 зоны защиты");
    return;
  }
  if (!playerselectedPokemon || !pokemons[playerselectedPokemon]){
        localStorage.setItem("selectedPokemon", "bulbasaur");
      alert('Я не знаю как ты это сделал, но строка твоего покемона приняла что-то кроме строки существующих покемонов. \nВыдам тебе дефолтного Бульвазавра😐');
      }
  if (isBattleFinished) {
    playerselectedPokemon = localStorage.getItem("selectedPokemon");
    playerPokemon = { ...pokemons[playerselectedPokemon] };
    playerPokemon.health = pokemons[playerselectedPokemon].health;
    chooseBot();
    updateStats();
    fightButton.textContent = "Сделать ход!";
    isBattleFinished = false; 
    return;
  }
   


const attackCount = botPokemon.hit; 
// attackCount is one or two hits from pokemons object
const botAttacks = getRandomZones(attackZones, attackCount);
const botDefenses = getRandomZones(defendZones, 2);

//debug
  console.log("Ваш выбор атаки:", atkButtons);
  console.log("Ваш выбор защиты:", defButtons);
  console.log(`Бот (${botPokemon.name}) атакует зоны:`, botAttacks);
  console.log(`Бот (${botPokemon.name}) защищает зоны:`, botDefenses);
//debug

  const {totalDamage: playerDamage, wasCrit: playerCrit} = calculateDamage(
    [atkButtons], // cuz it can be only 1 atk zone, but func is waiting for array
    botDefenses,
    playerPokemon.damage,
    playerPokemon.criticalHitChance,
    playerPokemon.criticalHitDamage
  );

  const {totalDamage: botDamage, wasCrit: botCrit} = calculateDamage(
    botAttacks,
    defButtons,
    botPokemon.damage,
    botPokemon.criticalHitChance,
    botPokemon.criticalHitDamage
  );

  botPokemon.health -= playerDamage;
  playerPokemon.health -= botDamage;
    botPokemon.health = Math.max(botPokemon.health, 0); // max - pokemon hp | min - 0 hp
    playerPokemon.health = Math.max(playerPokemon.health, 0);

  console.log(`Бот (${botPokemon.name}) здоровье: ${botPokemon.health}`);
  console.log(`Игрок (${playerPokemon.name}) здоровье: ${playerPokemon.health}`);
  visiblePlayerHealth.textContent = playerPokemon.health;
  visibleEnemyHealth.textContent = botPokemon.health;
  

  if (playerPokemon.health <= 0 || botPokemon.health <= 0) {
    const winner = playerPokemon.health > 0 ? nickname : botPokemon.name;
    
    if (winner === nickname) {
      winCounter++;
      localStorage.setItem("wins", winCounter);
    } else {
      loseCounter++;
      localStorage.setItem("loses", loseCounter);
    }
    
    fightButton.textContent = "Начать бой!";
    

    showContinueDialog(
    // onYes
    () => {
      isBattleFinished = true; 
      updateStats();
      botPokemon = { ...pokemons[botPokemonName] }; 
    },
    // onNo
    () => {
      isBattleFinished = true;
      if (winner === nickname) {
        botPokemon = null;
        chooseBot();
      } else {
        playerPokemon = { ...pokemons[playerselectedPokemon] };
        updateStats();
        botPokemon = null;
        chooseBot();
      } 
    }, winner);
  } 

////// LOGS /////
function zonesToText(zones, phrases) {
  const arr = Array.isArray(zones) ? zones : [zones]; //checking if it all arrays
  return arr.map(a => phrases[a] || a).join(" и ");
}
    const zones = {
    "atk-head": "головы",
    "atk-chest": "груди",
    "atk-torso": "живота",
    "atk-groin": "паха",
    "atk-legs": "ног",

    "def-head": "голову",
    "def-chest": "грудь",
    "def-torso": "живот",
    "def-groin": "пах",
    "def-legs": "ноги",
};

if(sex === "male") {
    
    let damageDealtByPlayer = "";
    playerDamage > 0? damageDealtByPlayer = `и нанёс ${playerDamage} единиц урона.` : damageDealtByPlayer = `но ${botPokemon.name} заблокировал ${zonesToText(botDefenses, zones)}.`;
    let damageDealtByBot = "";
    botDamage > 0? damageDealtByBot = `и нанёс ${botDamage} единиц урона.` : damageDealtByBot = `но не пробил твой блок.`;
    let critDamageByPlayer = "";
    playerCrit == true? critDamageByPlayer =`совершил КРИТИЧЕСКИЙ УДАР в район` : critDamageByPlayer=`ударил в район`;
    let critDamageByBot = "";
    botCrit == true? critDamageByBot =`совершил КРИТИЧЕСКИЙ УДАР в район` : critDamageByBot=`ударил в район`;


    addLog(`${nickname} ${critDamageByPlayer} ${zonesToText(atkButtons, zones)}, ${damageDealtByPlayer}`);
    addLog(`${botPokemon.name} ${critDamageByBot} ${zonesToText(botAttacks, zones)}, ${damageDealtByBot}`);
  }
else if (sex === "female") {
        
    let damageDealtByPlayer = "";
    playerDamage > 0? damageDealtByPlayer = `и нанесла ${playerDamage} единиц урона.` : damageDealtByPlayer = `но ${botPokemon.name} заблокировал ${zonesToText(botDefenses, zones)}.`;
    let damageDealtByBot = "";
    botDamage > 0? damageDealtByBot = `и нанёс ${botDamage} единиц урона.` : damageDealtByBot = `но не пробил твой блок.`;
    let critDamageByPlayer = "";
    playerCrit == true? critDamageByPlayer =`совершила КРИТИЧЕСКИЙ УДАР в район` : critDamageByPlayer=`ударила в район`;
    let critDamageByBot = "";
    botCrit == true? critDamageByBot =`совершил КРИТИЧЕСКИЙ УДАР в район` : critDamageByBot=`ударил в район`;


    addLog(`${nickname} ${critDamageByPlayer} ${zonesToText(atkButtons, zones)}, ${damageDealtByPlayer}`);
    addLog(`${botPokemon.name} ${critDamageByBot} ${zonesToText(botAttacks, zones)}, ${damageDealtByBot}`);
  }

////// LOGS /////
});

 function addLog(message) {
  const li = document.createElement("li"); // create new li
  li.textContent = message;                // write text
  li.style.color = "white";          // style
  logsList.appendChild(li);                // add to ul
  logsList.scrollTop = logsList.scrollHeight; // автопрокрутка вниз
}

 function updateStats() {
  if (!playerselectedPokemon || !pokemons[playerselectedPokemon]){
  localStorage.setItem("selectedPokemon", "bulbasaur");}
  nickname = localStorage.getItem("nickname") || "Игрок";
  winCounter = localStorage.getItem("wins") || 0;
  loseCounter = localStorage.getItem("loses") || 0;
  winStats.textContent = winCounter;
  loseStats.textContent = loseCounter;
  visiblePlayerHealth.textContent = playerPokemon.health;
  visiblePlayerLvl.textContent = playerPokemon.lvl;
  visibleEnemyName.textContent = botPokemon.name;
  visibleEnemyHealth.textContent = botPokemon.health;
  visibleEnemyLvl.textContent = botPokemon.lvl;
  playerPictureContainer.forEach(container => {
    container.innerHTML = `<img src="./assets/images/characters/${playerselectedPokemon}/static.png" alt="This is ${playerselectedPokemon} !!!">`;
  });
  enemyPictureContainer.forEach(container => {
    container.innerHTML = `<img src="./assets/images/characters/${botPokemonName}/static.png" alt="This is ${botPokemonName} !!!">`;
  });
}

export function initPlayerPokemon() {
  playerselectedPokemon = localStorage.getItem("selectedPokemon") || defaultPokemon;
  nickname = localStorage.getItem("nickname") || "Игрок";
  playerPokemon = { ...pokemons[playerselectedPokemon] };
  playerPokemon.health = pokemons[playerselectedPokemon].health;
}
