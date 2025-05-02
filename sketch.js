let player;
let enemies = [];
let projectiles = [];
let powerUps = [];
let gameManager;
let gameOver = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  player = new Player();
  gameManager = new GameManager();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);

  if (gameOver) {
    fill(255);
    textSize(40);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2 - 40);
    textSize(20);
    text("Press 'R' to restart", width / 2, height / 2);
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

  for (let p of powerUps) {
    p.update();
    p.display();
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

function keyPressed() {
  if (key === ' ') player.shoot();
  if (key === 'r' || key === 'R') restartGame();
}

function restartGame() {
  player = new Player();
  enemies = [];
  projectiles = [];
  powerUps = [];
  gameManager = new GameManager();
  gameOver = false;
  loop();
}
