//@ts-check

/** @type {HTMLCanvasElement} */
// @ts-ignore
const canvas = document.getElementById('screen'),
    container = document.getElementById('container'),
    context = canvas.getContext('2d');

const initialPoint = {
    x: canvas.width / 2,
    y: canvas.height / 1.50
}

const player = {
    x: initialPoint.x - 50,
    y: initialPoint.y - 150,
    width: 100,
    height: 150,
    jump: {
        height: 400,
        speed: 10,
        state: 'down',
        initialHeight: 0
    }
};

const game = {
    player,
    creationfrequency: 1800,
    fallSpeed: 3,
    platformWidth: 300,
    platformHeight: 40,
    distance: 0,
    platforms: [{
        x: initialPoint.x - 150,
        y: initialPoint.y
    }, {
        x: (canvas.width - 300) * Math.random(),
        y: initialPoint.y - 350
    }, {
        x: (canvas.width - 300) * Math.random(),
        y: initialPoint.y - 700
    }]
}

/** @param {number} positionX */
function movePlayer(positionX) {
    player.x = (canvas.width * positionX) / canvas.offsetWidth + 10 - (player.width / 2);

    if (player.x < 0) player.x = 0;

    if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
}

canvas.addEventListener('mousemove', (e) => { movePlayer(e.offsetX) })

function checkCollision() {
    for (const platform of game.platforms) {
        if ((player.x + player.width) < platform.x)
            continue;
        if (player.x > (platform.x + game.platformWidth))
            continue;

        if ((player.y + player.height) < (platform.y - 10))
            continue;
        if ((player.y + player.height) > (platform.y + 10))
            continue;

        return true;
    }

    return false;
}

let playerJumping = false;
function playerJump() {
    if (playerJumping) return;

    playerJumping = true

    if (player.jump.state == 'down' && checkCollision()) {
        player.jump.initialHeight = player.y;
        player.jump.state = 'up'
    };

    if (player.jump.state == 'up' && player.y == player.jump.initialHeight - player.jump.height) player.jump.state = 'down';

    if (player.jump.state == 'down') player.y += player.jump.speed

    if (player.jump.state == 'up') player.y -= player.jump.speed

    setTimeout(() => playerJumping = false, 1);
}

let lastCreationDistance = -1;
function createPlatform() {
    if (lastCreationDistance == game.distance) return;

    lastCreationDistance = game.distance;

    if (game.distance % 16 === 0 || game.distance == 0) {
        game.platforms.push({
            x: (canvas.width - 300) * Math.random(),
            y: 0
        });

        console.log(game.distance)
    }
}

let platformFalling = false;
function platformFall() {
    if (platformFalling) return;

    platformFalling = true;

    for (const platform of game.platforms) {
        if (platform.y > canvas.height) {
            game.platforms.shift();
        }

        platform.y += game.fallSpeed;
    }

    setTimeout(() => platformFalling = false, 1);
}

let updatingDistance = false;
function updateDistance() {
    if (updatingDistance == true)
        return;

    updatingDistance = true;
    game.distance += 1;

    setTimeout(() => updatingDistance = false, 100)
}

function updateGame() {
    createPlatform();
    platformFall();
    playerJump();
    updateDistance();
}

function renderScreen() {
    updateGame();

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = 'pink';
    context.fillRect(player.x, player.y, player.width, player.height);

    context.fillStyle = 'black';
    for (const platform of game.platforms) {
        context.fillRect(platform.x, platform.y, game.platformWidth, game.platformHeight);
    }

    context.fillStyle = 'black';
    context.font = "50px Arial";
    context.fillText(`Distância: ${game.distance}`, 10, 60);

    requestAnimationFrame(renderScreen);
}

renderScreen();