let player;
let enemies = [];
let projectiles = [];
let powerUps = [];
let gameManager;
let gameOver = false;
let gameStarted = false;
let difficulty = null;

// === Starfield Setup ===
let stars = [];
const numStars = 100;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("monospace");

  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      speed: random(0.5, 2)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  // === Starfield Background ===
  background(0);
  noStroke();
  for (let star of stars) {
    fill(255);
    circle(star.x, star.y, star.size);
    star.y += star.speed;
    if (star.y > height) {
      star.y = 0;
      star.x = random(width);
    }
  }

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

  // === Power-up Timers ===
  if (player.shieldActive) {
    player.shieldTimer--;
    if (player.shieldTimer <= 0) player.shieldActive = false;
  }

  if (player.rapidFire) {
    player.rapidTimer--;
    if (player.rapidTimer <= 0) player.rapidFire = false;
  }

  gameManager.update();
  player.update();
  player.display();

  // === HUD: Show Active Power-Ups ===
  textSize(16);
  textAlign(LEFT, TOP);
  let statusY = height - 60;

  if (player.shieldActive) {
    fill(0, 200, 255);
    text("🛡️ Shield Active", 20, statusY);
    statusY += 20;
  }

  if (player.rapidFire) {
    fill(255, 100, 100);
    text("🔫 Rapid Fire Active", 20, statusY);
  }

  // === Enemies ===
  for (let i = enemies.length - 1; i >= 0; i--) {
    let enemy = enemies[i];
    enemy.update();
    enemy.display();

    if (enemy.y + 30 > height) {
      enemies.splice(i, 1);
      if (!player.shieldActive) {
        player.takeDamage(20);
      }
    }
  }

  // === Projectiles ===
  for (let bullet of projectiles) {
    bullet.update();
    bullet.display();
  }

  // === Power-Ups ===
  for (let i = powerUps.length - 1; i >= 0; i--) {
    let p = powerUps[i];
    p.update();
    p.display();

    if (p.isCollected(player)) {
      p.applyEffect(player);
      powerUps.splice(i, 1);
    }
  }

  // === Bullet-Enemy Collisions ===
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

  // === Game Over ===
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
