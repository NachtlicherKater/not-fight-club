const indicatorContainer = document.querySelector('.hitting-indicator');

const attackImages = {
  "atk-head": ["attack/head-full.png", "attack/head-part.png"],
  "atk-chest": ["attack/chest-full.png", "attack/chest-part.png"],
  "atk-torso": ["attack/torso-full.png", "attack/torso-part.png"],
  "atk-groin": ["attack/groin-full.png", "attack/groin-part.png"],
  "atk-legs": ["attack/legs-full.png", "attack/legs-part.png"]
};

const defendImages = {
  "def-head": ["defend/head-full.png", "defend/head-part.png"],
  "def-chest": ["defend/chest-full.png", "defend/chest-part.png"],
  "def-torso": ["defend/torso-full.png", "defend/torso-part.png"],
  "def-groin": ["defend/groin-full.png", "defend/groin-part.png"],
  "def-legs": ["defend/legs-full.png", "defend/legs-part.png"]
};

const attackCheckBox = document.querySelectorAll('.attack-buttons input');
attackCheckBox.forEach(checkbox => {
  checkbox.onchange = () => {
    if (checkbox.checked) attackCheckBox.forEach(selected => { if (selected!==checkbox) selected.checked = false; });
    indicatorContainer .querySelectorAll('img[name="attack"]').forEach(i => i.remove());

    if (checkbox.checked) {
      attackImages[checkbox.value].forEach((src, i) => {
        const img = document.createElement('img');
        img.src = "./assets/images/hitting-indicator/" + src;
        img.name = "attack";
        img.style.zIndex = i === 0 ? 5 : 6; // i = [0,1] for each array
        // first one is for one choice (fill the whole body-part and got z-index: 5)
        // second one is for the part (when both variants the same, and got z-index: 6 to overlay prev one)
        indicatorContainer .appendChild(img);
      });
    }
  }
});

const defendCheckBox = document.querySelectorAll('.defend-buttons input');
defendCheckBox.forEach(checkbox => {
  checkbox.onchange = () => {
    const checked = Array.from(defendCheckBox).filter(selected => selected.checked);
    if (checked.length > 2) checkbox.checked = false;

    indicatorContainer .querySelectorAll('img[name="defend"]').forEach(i => i.remove());

    Array.from(defendCheckBox).filter(selected => selected.checked).forEach(selected => {
      defendImages[selected.value].forEach((src, i) => {
        const img = document.createElement('img');
        img.src = "./assets/images/hitting-indicator/" + src;
        img.name = "defend";
        img.style.zIndex = i === 0 ? 5 : 6;
        indicatorContainer .appendChild(img);
      });
    });
  }
});
