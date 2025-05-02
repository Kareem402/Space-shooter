// === PHASE 1: GLOBAL SETUP ===
let player;
let enemies = [];
let projectiles = [];
let powerUps = [];
let gameManager;

function setup() {
  createCanvas(windowWidth, windowHeight);
  player = new Player();
  gameManager = new GameManager();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// === PHASE 2: MAIN DRAW LOOP ===
function draw() {
  background(0);

  gameManager.update();
  player.update();
  player.display();

  // === DAMAGE IF ENEMY REACHES BOTTOM ===
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

  for (let p of powerUps) {
    p.update();
    p.display();
  }

  // === COLLISION: BULLET vs ENEMY ===
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

  // === GAME OVER ===
  if (player.health <= 0) {
    noLoop();
    fill(255);
    textSize(40);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2);
  }
}

function keyPressed() {
  if (key === ' ') player.shoot();
}
