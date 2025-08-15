document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.hitting-indicator');
  if (!container) return;

  const images = {
    // first one is for one choice (fill the whole body-part and got z-index: 4)
    // second one is for the part (when both variants the same, and got z-index: 5 to overlay prev one)
    attack: {
      "atk-head": ["./assets/images/hitting-indicator/attack/head-full.png", "./assets/images/hitting-indicator/attack/head-part.png"],
      "atk-chest": ["./assets/images/hitting-indicator/attack/chest-full.png", "./assets/images/hitting-indicator/attack/chest-part.png"],
      "atk-torso": ["./assets/images/hitting-indicator/attack/torso-full.png", "./assets/images/hitting-indicator/attack/torso-part.png"],
      "atk-groin": ["./assets/images/hitting-indicator/attack/groin-full.png", "./assets/images/hitting-indicator/attack/groin-part.png"],
      "atk-legs": ["./assets/images/hitting-indicator/attack/legs-full.png", "./assets/images/hitting-indicator/attack/legs-part.png"]
    },
    defend: {
      "def-head": ["./assets/images/hitting-indicator/defend/head-full.png", "./assets/images/hitting-indicator/defend/head-part.png"],
      "def-chest": ["./assets/images/hitting-indicator/defend/chest-full.png", "./assets/images/hitting-indicator/defend/chest-part.png"],
      "def-torso": ["./assets/images/hitting-indicator/defend/torso-full.png", "./assets/images/hitting-indicator/defend/torso-part.png"],
      "def-groin": ["./assets/images/hitting-indicator/defend/groin-full.png", "./assets/images/hitting-indicator/defend/groin-part.png"],
      "def-legs": ["./assets/images/hitting-indicator/defend/legs-full.png", "./assets/images/hitting-indicator/defend/legs-part.png"]
    }
  };

  let currentAttack = null;
  let currentDefend = null;
  const attackImgs = [document.createElement('img'), document.createElement('img')];
  const defendImgs = [document.createElement('img'), document.createElement('img')];


  attackImgs.forEach((img, i) => {
    img.style.position = 'absolute';
    img.style.zIndex = 4 + i;
    container.appendChild(img);
  });

  defendImgs.forEach((img, i) => {
    img.style.position = 'absolute';
    img.style.zIndex = 4 + i;
    container.appendChild(img);
  });

  function updateImages() {
    if (currentAttack && images.attack[currentAttack]) {
      attackImgs.forEach((img, i) => {
        img.src = images.attack[currentAttack][i];
        img.style.display = 'block';
      });
    } else {
      attackImgs.forEach(img => img.style.display = 'none');
    }

    if (currentDefend && images.defend[currentDefend]) {
      defendImgs.forEach((img, i) => {
        img.src = images.defend[currentDefend][i];
        img.style.display = 'block';
      });
    } else {
      defendImgs.forEach(img => img.style.display = 'none');
    }
  }

  document.querySelectorAll('input[name="attack"]').forEach(input => {
    input.addEventListener('change', () => {
      if (input.checked) {
        currentAttack = input.value;
        updateImages();
      }
    });
  });

  document.querySelectorAll('input[name="defend"]').forEach(input => {
    input.addEventListener('change', () => {
      if (input.checked) {
        currentDefend = input.value;
        updateImages();
      }
    });
  });

  const initialAttack = document.querySelector('input[name="attack"]:checked');
  if (initialAttack) currentAttack = initialAttack.value;
  const initialDefend = document.querySelector('input[name="defend"]:checked');
  if (initialDefend) currentDefend = initialDefend.value;
  updateImages();
});
