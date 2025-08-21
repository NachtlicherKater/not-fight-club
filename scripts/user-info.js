const nickInput = document.getElementById('nick-input');
const confirmButton = document.getElementById('save-name');
const playerName = document.querySelectorAll('.player-name'); // all player-names
const avatarContainer = document.querySelectorAll('.player-pokemon-picture');
const registrationWindow = document.querySelector('.registration-form');


const savedNick = localStorage.getItem("nickname");
const savedSex = localStorage.getItem("sex");
const savedPokemon = localStorage.getItem("selectedPokemon");
const isRegistered = localStorage.getItem("isRegistered");


if (isRegistered === "true") {
  registrationWindow.classList.add("hide-reg-form"); //hide reg form
}
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
  avatarContainer.forEach(container => {
    container.innerHTML = `<img src="./assets/images/characters/${savedPokemon}/static.png" alt="This is ${savedPokemon} !!!">`;
  });
}




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
  registrationWindow.classList.add("hide-reg-form"); //hide it on 1st time
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
