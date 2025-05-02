// === PHASE 1: INITIAL SETUP ===

let player;
let enemies = [];
let projectiles = [];
let powerUps = [];
let gameManager;

function setup() {
  createCanvas(800, 600);
  player = new Player();
  gameManager = new GameManager();
}

function draw() {
  background(0);

  gameManager.update();
  player.update();
  player.display();

  for (let enemy of enemies) {
    enemy.update();
    enemy.display();
  }

  for (let bullet of projectiles) {
    bullet.update();
    bullet.display();
  }

  for (let p of powerUps) {
    p.update();
    p.display();
  }
}

function keyPressed() {
  if (key === ' ') player.shoot();
}