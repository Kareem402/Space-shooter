let player;
let enemies = [];
let projectiles = [];
let powerUps = [];
let gameManager;
let gameOver = false;
let gameStarted = false;
let difficulty = null;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("monospace");
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);

  if (!gameStarted) {
    drawMainMenu();
    return;
  }

  if (gameOver) {
    fill(255);
    textSize(40);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2 - 40);
    textSize(20);
    text("Press 'R' to return to menu", width / 2, height / 2);
    return;
  }

  gameManager.update();
  player.update();
  player.display();

  for (let i = enemies.length - 1; i >= 0; i--) {
    let enemy = enemies[i];
    enemy.update();
    enemy.display();

    if (enemy.y + 30 > height) {
      enemies.splice(i, 1);
      player.takeDamage(20);
    }
  }

  for (let bullet of projectiles) {
    bullet.update();
    bullet.display();
  }

  for (let i = powerUps.length - 1; i >= 0; i--) {
    let p = powerUps[i];
    p.update();
    p.display();

    if (p.isCollected(player)) {
      p.applyEffect(player);
      powerUps.splice(i, 1);
    }
  }

  for (let i = projectiles.length - 1; i >= 0; i--) {
    let bullet = projectiles[i];
    for (let j = enemies.length - 1; j >= 0; j--) {
      let enemy = enemies[j];
      if (
        bullet.x >= enemy.x &&
        bullet.x <= enemy.x + 30 &&
        bullet.y >= enemy.y &&
        bullet.y <= enemy.y + 30
      ) {
        enemies.splice(j, 1);
        projectiles.splice(i, 1);
        break;
      }
    }
  }

  if (player.health <= 0) {
    gameOver = true;
  }
}

function drawMainMenu() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(36);
  text("SPACE SHOOTER", width / 2, height / 2 - 100);
  textSize(24);
  text("Press 1 for EASY", width / 2, height / 2 - 30);
  text("Press 2 for MEDIUM", width / 2, height / 2);
  text("Press 3 for HARD", width / 2, height / 2 + 30);
}

function keyPressed() {
  if (!gameStarted) {
    if (key === '1') startGame("easy");
    if (key === '2') startGame("medium");
    if (key === '3') startGame("hard");
    return;
  }

  if (gameOver && (key === 'r' || key === 'R')) {
    returnToMenu();
    return;
  }

  if (key === ' ') player.shoot();
}

function startGame(level) {
  difficulty = level;
  player = new Player();
  enemies = [];
  projectiles = [];
  powerUps = [];
  gameManager = new GameManager(difficulty);
  gameStarted = true;
  gameOver = false;
  loop();
}

function returnToMenu() {
  gameStarted = false;
  gameOver = false;
  difficulty = null;
  enemies = [];
  projectiles = [];
  powerUps = [];
}