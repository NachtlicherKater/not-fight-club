import { pokemons } from "./characters-config.js";
import { initPlayerPokemon, updateUnlocks } from './fight.js';

const nickInput = document.getElementById('nick-input');
const winCounter = document.querySelector('#win-stats');
const loseCounter = document.querySelector('#lose-stats');
//buttons
const confirmButton = document.getElementById('save-name');
const mainPageButton = document.getElementById('main-page-button');
const battleButton = document.getElementById('battle-button');
const settingsButton = document.getElementById('settings-button');
const settingsButtonOnMainPage = document.querySelector('.main-page-picture');
const closeSettingsButton = document.getElementById('close-settings')
//reg-form
const playerName = document.querySelectorAll('.player-name');
const avatarContainer = document.querySelectorAll('.player-pokemon-picture');
const registrationWindow = document.querySelector('.registration-form');
//main page
const mainPage = document.querySelector('.main-page')
//battle page
const battlePage = document.querySelector('.battle-page')
//settings
const settingsPage = document.querySelector('.settings-page');
const settingsPlayer = document.querySelector('.reg-form-l-column');
const settingsOverview = document.querySelector('.reg-form-r-column'); 


// Checking on restart //
const savedNick = localStorage.getItem("nickname");
const savedSex = localStorage.getItem("sex");
const savedPokemon = localStorage.getItem("selectedPokemon");
const isRegistered = localStorage.getItem("isRegistered");
const selectedPokemon = localStorage.getItem("selectedPokemon");
updateUnlocks();

if (isRegistered === "true") {
  registrationWindow.classList.add("hide"); //hide reg form
  battlePage.classList.add("hide");
  settingsPage.classList.add("hide-settings"); 
  if (settingsOverview) settingsPage.appendChild(settingsOverview); // move 'em to settings
  if (settingsPlayer) settingsPage.appendChild(settingsPlayer); 
}
if (!selectedPokemon || !pokemons[selectedPokemon]){
  localStorage.setItem("selectedPokemon", "bulbasaur"); //default pokemon
}
if (!savedNick) {
  localStorage.setItem("nickname", "Игрок"); // if nothing was inputed
}
if (!localStorage.getItem("wins")) { // just adding stats
  localStorage.setItem("wins", "0");
}
if (!localStorage.getItem("loses")) {
  localStorage.setItem("loses", "0");
}
if (savedNick) {        
  playerName.forEach(element => { // to all names in array
  element.textContent = savedNick;
});
}
if (savedSex) {
  document.querySelector(`input[name="sex"][value="${savedSex}"]`).checked = true; // selected sex
}
if (savedPokemon) {
  document.querySelector(`input[name="selected-pokemon"][value="${savedPokemon}"]`).checked = true; // selected pokemon
  avatarContainer.forEach(container => {
    container.innerHTML = `<img src="./assets/images/characters/${savedPokemon}/static.png" alt="This is ${savedPokemon} !!!">`;
  });
}


// Listeners //
nickInput.addEventListener('input', () => {
    const username = nickInput.value;
    localStorage.setItem("nickname", username);
    playerName.forEach(elemnent => elemnent.textContent = username); 
});

confirmButton.addEventListener("click", () => {     
  const selectedSex = document.querySelector('input[name="sex"]:checked').value;
  localStorage.setItem("sex", selectedSex);
  const selectedPokemon = document.querySelector('input[name="selected-pokemon"]:checked').value;
  localStorage.setItem("selectedPokemon", selectedPokemon);
  avatarContainer.forEach(container => {
  container.innerHTML = `<img src="./assets/images/characters/${selectedPokemon}/static.png" alt="This is ${selectedPokemon} !!!">`;
  localStorage.setItem("isRegistered" , true);
  registrationWindow.classList.add("hide"); //hide it on 1st time
  settingsPage.classList.remove("hide");
  settingsPage.classList.remove("show-settings");
  settingsPage.classList.add("hide-settings");
  settingsPage.appendChild(settingsOverview); // move to settings
  settingsPage.appendChild(settingsPlayer);
  winCounter.textContent = localStorage.getItem("wins") || 0;
  loseCounter.textContent = localStorage.getItem("loses") || 0;
  initPlayerPokemon();// update pokemon for battle function
});
 });

const choosePokemon = document.querySelectorAll('input[name="selected-pokemon"]');
choosePokemon.forEach(choose => {
  choose.addEventListener('change', () => {
    if (choose.checked) {
      const selectedPokemon = choose.value;
      avatarContainer.forEach(container => {
        container.innerHTML = `<img src="./assets/images/characters/${selectedPokemon}/static.png" alt="This is ${selectedPokemon} !!!">`;
      })
    ;}
  });
});

mainPageButton.addEventListener("click", () => {
  mainPage.classList.remove("hide");
  mainPage.classList.add("show");
  battlePage.classList.remove("show");
  battlePage.classList.add("hide");
});

battleButton.addEventListener("click", () => {
  initPlayerPokemon(); // update pokemon for battle function
  battlePage.classList.remove("hide");
  battlePage.classList.add("show");
  mainPage.classList.remove("show");
  mainPage.classList.add("hide");
});


settingsButton.addEventListener("click", () => {
  settingsPage.classList.remove("hide-settings");
  settingsPage.classList.add("show-settings");
});

settingsButtonOnMainPage.addEventListener("click", (e) => {
  if (e.target.tagName === 'IMG') { // cuz dynamic img in this div loads much slower, and we looking for it here
  settingsPage.classList.remove("hide-settings");
  settingsPage.classList.add("show-settings");
  }
});

closeSettingsButton.addEventListener("click", () => {
  const selectedSex = document.querySelector('input[name="sex"]:checked').value;
  localStorage.setItem("sex", selectedSex);
  const selectedPokemon = document.querySelector('input[name="selected-pokemon"]:checked').value;
  localStorage.setItem("selectedPokemon", selectedPokemon);
  settingsPage.classList.remove("show-settings");
  settingsPage.classList.add("hide-settings");
});
