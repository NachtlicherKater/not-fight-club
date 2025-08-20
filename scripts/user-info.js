const nickInput = document.getElementById('nick-input');
const confirmButton = document.getElementById('save-name');
const playerName = document.querySelectorAll('.player-name'); // all player-names
const avatarContainer = document.getElementById('reg-form-container-img');


const savedNick = localStorage.getItem("nickname");
const savedSex = localStorage.getItem("sex");
const savedPokemon = localStorage.getItem("selectedPokemon");


if (savedNick) {        
  playerName.forEach(element => {
  element.textContent = savedNick;
});
}
if (savedSex) {
  document.querySelector(`input[name="sex"][value="${savedSex}"]`).checked = true; // selected sex
}
if (savedPokemon) {
  document.querySelector(`input[name="selected-pokemon"][value="${savedPokemon}"]`).checked = true; // selected pokemon
}



confirmButton.addEventListener("click", () => {
  const username = nickInput.value;           
  localStorage.setItem("nickname", username); 
  playerName.forEach(element => {
    element.textContent = username; // set nicknames to all classes 
  });        
  const selectedSex = document.querySelector('input[name="sex"]:checked').value;
  localStorage.setItem("sex", selectedSex);
  const selectedPokemon = document.querySelector('input[name="selected-pokemon"]:checked').value;
  localStorage.setItem("selectedPokemon", selectedPokemon);

  avatarContainer.innerHTML = `<img src="./assets/images/characters/${selectedPokemon}/static.png" alt="${selectedPokemon}">`;
});


const choosePokemon = document.querySelectorAll('input[name="selected-pokemon"]');
choosePokemon.forEach(choose => {
  choose.addEventListener('change', () => {
    if (choose.checked) {
      const selectedPokemon = choose.value;
      avatarContainer.innerHTML = `<img src="./assets/images/characters/${selectedPokemon}/static.png" alt="This is ${selectedPokemon} !!!">`;
    }
  });
});
