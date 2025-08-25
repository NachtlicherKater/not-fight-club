const aboutGameWindow = document.querySelector('#about-game-window');
const aboutGameButton = document.querySelector('#about-game-button');
const aboutGameCloseButton = document.querySelector('#close-about-game-window');
const aboutPokemonsWindow = document.querySelector('#about-pokemons-window');
const aboutPokemonsButton = document.querySelector('#about-pokemons-button');
const aboutPOkemonsCloseButton = document.querySelector('#close-about-pokemons-window');

aboutGameButton.addEventListener("click", () => {
    aboutGameWindow.classList.remove('hide');
    aboutGameWindow.classList.add('show');
});

aboutPokemonsButton.addEventListener("click", () => {
    aboutPokemonsWindow.classList.remove('hide');
    aboutPokemonsWindow.classList.add('show');
});

aboutGameCloseButton.addEventListener("click", () => {
    aboutGameWindow.classList.remove('show');
    aboutGameWindow.classList.add('hide');
});

aboutPOkemonsCloseButton.addEventListener("click", () => {
    aboutPokemonsWindow.classList.remove('show');
    aboutPokemonsWindow.classList.add('hide');
});

document.addEventListener("click", (event) => {
    if (!aboutGameWindow.contains(event.target) && event.target !== aboutGameButton) {
        aboutGameWindow.classList.remove('show');
        aboutGameWindow.classList.add('hide');
    }
    if (!aboutPokemonsWindow.contains(event.target) && event.target !== aboutPokemonsButton) {
        aboutPokemonsWindow.classList.remove('show');
        aboutPokemonsWindow.classList.add('hide');
    }
});

