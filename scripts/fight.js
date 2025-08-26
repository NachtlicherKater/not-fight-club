import { pokemons } from "./characters-config.js"; // list of pokemons

const defaultPokemon = "bulbasaur";
const sex = localStorage.getItem("sex");
const fightButton = document.getElementById("fight-button");
const confirmButton = document.getElementById('save-name');
const closeSettingsButton = document.getElementById('close-settings')
const unlockPokemonButtonOK = document.getElementById('unlock-pokemon-button');
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
const visibleUserExperience = document.querySelector('#experience-user');
const visibleUserExperienceMax = document.querySelector('#experience-user-max');
//unlockable pokemons
const unlockIvysaur = document.querySelector('input[value="ivysaur"]').parentElement;
const unlockVenusaur = document.querySelector('input[value="venusaur"]').parentElement;
const unlockWartortle = document.querySelector('input[value="wartortle"]').parentElement;
const unlockBlastoise = document.querySelector('input[value="blastoise"]').parentElement;
const unlockCharmaleon = document.querySelector('input[value="charmaleon"]').parentElement;
const unlockCharizard = document.querySelector('input[value="charizard"]').parentElement;

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
if (!loadBattle()) {
  updateStats();
}

settingsButton.addEventListener("click", () => {
  updateUnlocks();
  visibleUserExperienceMax.textContent =  pokemons[playerselectedPokemon].maxExperince;
 if (isBattleFinished === false) { 
  addLog("Игрок зашел в настройки. Бой прерван - НР покемонов будут восстановлены.");
  isBattleFinished = true;
  fightButton.textContent = "Начать бой!";
  botPokemon = { ...pokemons[botPokemonName] }; 
 }
});


[confirmButton, closeSettingsButton].forEach(btn => { // one eventListener on 2 buttons
  btn.addEventListener("click", () => {
  initPlayerPokemon();
  visibleUserExperienceMax.textContent =  pokemons[playerselectedPokemon].maxExperince;
  });
});


// Listeners
fightButton.addEventListener("click", () => {
  const { atkButtons, defButtons } = getSelectedZones();
  updateUnlocks();
  const sex = localStorage.getItem("sex");

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

  progressionForPokemon(playerselectedPokemon, pokemons[playerselectedPokemon].maxExperince, playerDamage, playerCrit ); 
  saveBattle(); //savin everything after this turn
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

  if (botPokemon) {
    visibleEnemyName.textContent = botPokemon.name;
    visibleEnemyHealth.textContent = botPokemon.health;
    visibleEnemyLvl.textContent = botPokemon.lvl;

    enemyPictureContainer.forEach(container => {
      container.innerHTML = `<img src="./assets/images/characters/${botPokemonName}/static.png" alt="This is ${botPokemonName} !!!">`;
    });
  } else {
    visibleEnemyName.textContent = "Кто же он ?!";
    visibleEnemyHealth.textContent = "Нет выбранного покемона";
    visibleEnemyLvl.textContent = "Нет выбранного покемона";

   enemyPictureContainer.forEach(container => {
    container.innerHTML = `<img src="./assets/images/characters/default/enemy.png" alt="This is ${botPokemonName} !!!">`;
  });
  }
  visibleUserExperienceMax.textContent =  pokemons[playerselectedPokemon].maxExperince;
  playerPictureContainer.forEach(container => {
    container.innerHTML = `<img src="./assets/images/characters/${playerselectedPokemon}/static.png" alt="This is ${playerselectedPokemon} !!!">`;
  });
}

export function initPlayerPokemon() {
  playerselectedPokemon = localStorage.getItem("selectedPokemon") || defaultPokemon;
  nickname = localStorage.getItem("nickname") || "Игрок";
  
  if (!playerPokemon || playerPokemon.name !== pokemons[playerselectedPokemon].name) {
    playerPokemon = { ...pokemons[playerselectedPokemon] };
    playerPokemon.health = pokemons[playerselectedPokemon].health; 
  }

  if (!localStorage.getItem("playerHealth")) {
    playerPokemon.health = pokemons[playerselectedPokemon].health;
  }
};

function progressionForPokemon (selectedPoke, maximalExp, playerDamage, playerCrit ) {
  const pokesProgression = `${selectedPoke}-progression`;
  const pokesUnlock = `${selectedPoke}-is-unlock`;
   
  let currentExp = parseInt(localStorage.getItem(pokesProgression)) || 0; //parseInt for number
  localStorage.getItem(pokesUnlock) || "False";

  playerDamage > 0? currentExp += 2 : currentExp += 1; 
  playerCrit? currentExp += 3 : currentExp += 0;


  if (currentExp > maximalExp) {
    currentExp = maximalExp;
    localStorage.setItem(pokesUnlock, "True");
  }

  localStorage.setItem(pokesProgression, currentExp.toString());
  localStorage.setItem("undefined-progression", "0");
  visibleUserExperience.textContent = currentExp;

}

export function updateUnlocks() {
   if (localStorage.getItem("bulbasaur-is-unlock") === "True") {
    unlockIvysaur.style.display = "flex";
    showUnlockWindow("Ивизавр", 1, "ivysaur");
  }

  if (localStorage.getItem("ivysaur-is-unlock") === "True") {
    unlockVenusaur.style.display = "flex";
    showUnlockWindow("Венузавр", 2, "venusaur");
  }

  if (localStorage.getItem("squirtle-is-unlock") === "True") {
    unlockWartortle.style.display = "flex";
    showUnlockWindow("Вартолтл", 1, "wartortle");
  }

  if (localStorage.getItem("wartortle-is-unlock") === "True") {
    unlockBlastoise.style.display = "flex";
    showUnlockWindow("Бластойз", 2, "blastoise");
  }

  if (localStorage.getItem("charmander-is-unlock") === "True") {
    unlockCharmaleon.style.display = "flex";
    showUnlockWindow("Чармалеон", 1, "charmaleon");
  }

  if (localStorage.getItem("charmaleon-is-unlock") === "True") {
    unlockCharizard.style.display = "flex";
    showUnlockWindow("Чаризард", 2, "charizard");
  }
}

function showUnlockWindow(pokemonName, lvl, pokemonID) {
  const messageKey = `${pokemonID}-unlock-message-shown`;

  if (!localStorage.getItem(messageKey)) {
    document.getElementById("unlock-message").textContent = `🎉 ${pokemonName} 🎉\n теперь доступен!`;
    document.getElementById("unlock-picture").src = `./assets/images/characters/${pokemonID}/atk.png`;
    document.getElementById("unlock-message-additional").textContent = `Вы максимально вкачали своего покемона ${lvl} уровня\n и теперь можете получить нового в настройках!`
    document.getElementById("unlock-pockemon-window").style.display = "flex";
    localStorage.setItem(messageKey, "true");
  }
}

unlockPokemonButtonOK.addEventListener("click", () => {
  document.getElementById("unlock-pockemon-window").style.display = "none";
})
  
function saveBattle() {
  localStorage.setItem("playerHealth", playerPokemon.health);
  localStorage.setItem("botHealth", botPokemon.health);
  localStorage.setItem("botName", botPokemonName);
  localStorage.setItem("isBattleFinished", isBattleFinished ? "true" : "false");

  let logs = Array.from(logsList.querySelectorAll("li")).map(li => li.textContent);
            //do a simple strings of node (array)
  localStorage.setItem("battleLogs", logs.join("\n")); // \n just for good looking in localStorage
}

function loadBattle() {
  const botName = localStorage.getItem("botName");
  if (!botName) return false;

  botPokemonName = botName;
  botPokemon = { ...pokemons[botPokemonName] };
  botPokemon.health = parseInt(localStorage.getItem("botHealth"));

  playerPokemon.health = parseInt(localStorage.getItem("playerHealth"));
  isBattleFinished = localStorage.getItem("isBattleFinished") === "true";

  logsList.innerHTML = "";
  const logs = localStorage.getItem("battleLogs");
  if (logs) {
    logs.split("\n").forEach(msg => addLog(msg));
  }

  updateStats();
  fightButton.textContent = isBattleFinished ? "Начать бой!" : "Сделать ход!";
  return true;
}