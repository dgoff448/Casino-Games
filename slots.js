const icon_width = 79;
const icon_height = 79;
const num_icons = 9;
const time_per_icon = 100;
const indexes = [0, 0, 0];


const roll = (reel, offset = 0) => {
    const delta = (offset + 2) * num_icons + Math.round(Math.random() * num_icons);
    const style = getComputedStyle(reel);
    const backgroundPositionY = parseFloat(style["background-position-y"]);

    reel.style.transition = `background-position-y ${8 + delta * time_per_icon}ms`;
    reel.style.backgroundPositionY = `${backgroundPositionY + delta * icon_height}px`;
};

function rollAll() {
    const reelsList = document.querySelectorAll('.slots > .reel');
    [...reelsList].map((reel, i) => {
        console.log(reel, i);
        roll(reel, i);
    })
}

rollAll();