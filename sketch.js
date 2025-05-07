let player;
let enemies = [];
let projectiles = [];
let powerUps = [];
let fadingEnemies = [];
let gameManager;
let gameOver = false;
let gameStarted = false;
let difficulty = null;
let bgm;
let isMuted = false;
let bgmLoaded = false;
let stars = [];
const numStars = 100;
let inShop = false;
let freezeEnemies = false;
let freezeTimer = 0;
let paused = false;

let score = 0;
let coins = parseInt(localStorage.getItem("coins")) || 0;
let upgrades = JSON.parse(localStorage.getItem("upgrades")) || {
  maxHealth: 0,
  speed: 0,
  weapon: 'normal'
};
let selectedSkin = 'green';
let unlockedSkins = ['green'];

let showStats = false;
let finalStats = { accuracy: 0, enemiesKilled: 0, shotsFired: 0 };

let imgPlayerGreen, imgEnemyBasic, imgEnemyFast, imgEnemyZigzag, imgEnemyBoss, imgBullet;
let imgSkinGreen, imgSkinBlue, imgSkinRed, imgSkinGold;

const skinOptions = [
  { color: 'green', threshold: 0 },
  { color: 'blue', threshold: 100 },
  { color: 'red', threshold: 200 },
  { color: 'gold', threshold: 500 }
];

function preload() {
  soundFormats('mp3', 'wav');
  bgm = loadSound('Assets/bgm.mp3',
    () => { bgmLoaded = true; },
    (err) => { console.error("❌ Failed to load BGM:", err); }
  );

  imgPlayerGreen = loadImage('Assets/player_green.png');
  imgEnemyBasic = loadImage('Assets/enemy_basic.png');
  imgEnemyFast = loadImage('Assets/enemy_fast.png');
  imgEnemyZigzag = loadImage('Assets/enemy_zigzag.png');
  imgEnemyBoss = loadImage('Assets/enemy_boss.png');
  imgBullet = loadImage('Assets/bullet.png');

  imgSkinGreen = imgEnemyBasic;
  imgSkinBlue = imgEnemyZigzag;
  imgSkinRed = imgEnemyFast;
  imgSkinGold = imgEnemyBoss;
}

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

  let savedSkins = localStorage.getItem("unlockedSkins");
  if (savedSkins) unlockedSkins = JSON.parse(savedSkins);

  const muteBtn = document.getElementById("muteBtn");
  muteBtn.addEventListener("click", () => {
    if (bgmLoaded && bgm) {
      isMuted = !isMuted;
      bgm.setVolume(isMuted ? 0 : 0.4);
      muteBtn.textContent = isMuted ? "🔇 Unmute" : "🔊 Mute";
    }
  });
}

function draw() {
  background(0);
  noStroke();

  for (let star of stars) {
    fill(255, star.size * 100);
    circle(star.x, star.y, star.size);
    star.y += star.speed;
    if (star.y > height) {
      star.y = 0;
      star.x = random(width);
      star.size = random(1, 3);
      star.speed = random(0.5, 2);
    }
    if (random() < 0.002) {
      fill(255, 255, 255, 50);
      ellipse(star.x, star.y, star.size * 5);
    }
  }

  if (!gameStarted) {
    inShop ? drawShopScreen() : drawMainMenu();
    return;
  }

  if (gameOver) {
    fill(255);
    textSize(40);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2 - 40);
    textSize(20);
    text("Press 'R' to return to menu", width / 2, height / 2);

    if (showStats) {
      textSize(20);
      text(`Kills: ${finalStats.enemiesKilled}`, width / 2, height / 2 + 40);
      text(`Shots: ${finalStats.shotsFired}`, width / 2, height / 2 + 70);
      text(`Accuracy: ${finalStats.accuracy}%`, width / 2, height / 2 + 100);
      text(`Coins Earned: ${coins}`, width / 2, height / 2 + 130);
    }

    return;
  }

  if (paused) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(48);
    text("⏸ PAUSED", width / 2, height / 2);
    return;
  }

  if (player.shieldActive) player.shieldTimer--;
  if (player.rapidFire) player.rapidTimer--;
  if (player.shieldTimer <= 0) player.shieldActive = false;
  if (player.rapidTimer <= 0) player.rapidFire = false;

  if (freezeEnemies) {
    freezeTimer--;
    if (freezeTimer <= 0) freezeEnemies = false;
  }

  gameManager.update();
  player.update();
  player.display();

  for (let i = enemies.length - 1; i >= 0; i--) {
    let enemy = enemies[i];
    if (!freezeEnemies) enemy.update();
    enemy.display();

    if (enemy.y + enemy.size > height) {
      enemies.splice(i, 1);
      if (!player.shieldActive) player.takeDamage(20);
    }
  }

  for (let bullet of projectiles) bullet.update(), bullet.display();

  for (let i = powerUps.length - 1; i >= 0; i--) {
    let p = powerUps[i];
    p.update();
    p.display();
    if (p.isCollected(player)) {
      p.applyEffect(player);
      powerUps.splice(i, 1);
    }
  }

  let bulletsToRemove = [], enemiesToRemove = [];

  for (let i = 0; i < projectiles.length; i++) {
    let bullet = projectiles[i];
    if (bullet.type === 'enemy') continue;

    for (let j = 0; j < enemies.length; j++) {
      let enemy = enemies[j];
      if (bullet.x >= enemy.x && bullet.x <= enemy.x + enemy.size &&
          bullet.y >= enemy.y && bullet.y <= enemy.y + enemy.size) {
        fadingEnemies.push({ x: enemy.x, y: enemy.y, size: enemy.size, alpha: 255 });
        bulletsToRemove.push(i);
        enemiesToRemove.push(j);
        score += 10;
        coins += 1;
        player.enemiesKilled++;
        break;
      }
    }
  }

  for (let i of bulletsToRemove.reverse()) projectiles.splice(i, 1);
  for (let j of enemiesToRemove.reverse()) enemies.splice(j, 1);

  for (let i = fadingEnemies.length - 1; i >= 0; i--) {
    let e = fadingEnemies[i];
    e.alpha -= 10;
    e.size *= 0.9;
    if (e.alpha <= 0 || e.size <= 1) fadingEnemies.splice(i, 1);
    else {
      fill(255, 0, 0, e.alpha);
      rect(e.x, e.y, e.size, e.size);
    }
  }

  if (projectiles.length > 300) projectiles.splice(0, 100);
  if (player.health <= 0) {
    if (player.shotsFired > 0) {
      finalStats.accuracy = ((player.enemiesKilled / player.shotsFired) * 100).toFixed(1);
      finalStats.enemiesKilled = player.enemiesKilled;
      finalStats.shotsFired = player.shotsFired;
      showStats = true;
    }
    localStorage.setItem("coins", coins);
    gameOver = true;
  }
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

  if (key === 'p' || key === 'P') {
    paused = !paused;
    return;
  }

  if (key === ' ' && !player.rapidFire) player.shoot();
}

function mousePressed() {
  if (!gameStarted) {
    if (inShop) {
      if (mouseX >= 30 && mouseX <= 130 && mouseY >= 30 && mouseY <= 70) {
        inShop = false;
        return;
      }

      let startX = width / 2 - (skinOptions.length * 60) / 2;
      let y = height / 2;

      skinOptions.forEach((skin, i) => {
        let x = startX + i * 60;
        if (mouseX >= x && mouseX <= x + 50 &&
            mouseY >= y && mouseY <= y + 50) {
          if (score >= skin.threshold || unlockedSkins.includes(skin.color)) {
            selectedSkin = skin.color;
            if (!unlockedSkins.includes(skin.color)) {
              unlockedSkins.push(skin.color);
              localStorage.setItem("unlockedSkins", JSON.stringify(unlockedSkins));
            }
          }
        }
      });
    } else {
      if (mouseX >= width / 2 - 60 && mouseX <= width / 2 + 60 &&
          mouseY >= height / 2 + 80 && mouseY <= height / 2 + 120) {
        inShop = true;
        return;
      }
    }
  }

  if (getAudioContext().state !== 'running') getAudioContext().resume();
}

function startGame(level) {
  difficulty = level;
  score = 0;
  coins = parseInt(localStorage.getItem("coins")) || 0;
  player = new Player();
  player.maxHealth += upgrades.maxHealth;
  player._health = player.maxHealth;
  player.weaponType = upgrades.weapon;
  player.speedBoost = upgrades.speed;

  enemies = [];
  projectiles = [];
  powerUps = [];
  fadingEnemies = [];
  gameManager = new GameManager(difficulty);
  gameStarted = true;
  gameOver = false;
  showStats = false;

  if (bgmLoaded && !bgm.isPlaying()) {
    bgm.setLoop(true);
    bgm.setVolume(isMuted ? 0 : 0.4);
    bgm.play();
  }

  loop();
}

function returnToMenu() {
  gameStarted = false;
  gameOver = false;
  difficulty = null;
  inShop = false;
  enemies = [];
  projectiles = [];
  powerUps = [];
  fadingEnemies = [];
  if (bgmLoaded && bgm.isPlaying()) bgm.stop();
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

  let shopX = width / 2 - 60;
  let shopY = height / 2 + 80;
  let shopW = 120;
  let shopH = 40;
  let isHovering = mouseX >= shopX && mouseX <= shopX + shopW && mouseY >= shopY && mouseY <= shopY + shopH;

  if (isHovering) {
    fill(80, 180, 255);
    rect(shopX - 5, shopY - 5, shopW + 10, shopH + 10, 12);
  } else {
    fill(50, 150, 255);
    rect(shopX, shopY, shopW, shopH, 10);
  }

  fill(255);
  textSize(20);
  text("SHOP", width / 2, height / 2 + 100);
}

function drawShopScreen() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("SHOP - Select a Skin", width / 2, 60);

  let startX = width / 2 - (skinOptions.length * 60) / 2;
  let y = height / 2;

  skinOptions.forEach((skin, i) => {
    let x = startX + i * 60;
    let isHovered = mouseX >= x && mouseX <= x + 50 && mouseY >= y && mouseY <= y + 50;

    let img = {
      green: imgSkinGreen,
      blue: imgSkinBlue,
      red: imgSkinRed,
      gold: imgSkinGold
    }[skin.color];

    image(img, x, y, 50, 50);

    if (isHovered) {
      stroke(255);
      strokeWeight(2);
      noFill();
      rect(x - 4, y - 4, 58, 58, 4);
      noStroke();
    }

    if (!unlockedSkins.includes(skin.color)) {
      fill(0, 0, 0, 180);
      rect(x, y, 50, 50);
      fill(255);
      textSize(12);
      text(`🔒 ${skin.threshold}`, x + 25, y + 25);
    } else if (selectedSkin === skin.color) {
      noFill();
      stroke(255);
      strokeWeight(3);
      rect(x - 4, y - 4, 58, 58);
      noStroke();
    }
  });

  textSize(24);
  text("Permanent Upgrades", width / 2, height / 2 + 100);

  let upgradeOptions = [
    { label: "+20 Max Health", cost: 50, key: "maxHealth" },
    { label: "+1 Speed", cost: 75, key: "speed" },
    { label: "Spread Shot", cost: 100, key: "weapon", value: "spread" },
    { label: "Laser Beam", cost: 150, key: "weapon", value: "laser" }
  ];

  upgradeOptions.forEach((upg, i) => {
    let ux = width / 2 - 100;
    let uy = height / 2 + 130 + i * 50;
    let uw = 200;
    let uh = 40;

    let owned = false;
    if (upg.key === "weapon") owned = upgrades.weapon === upg.value;
    else owned = upgrades[upg.key] >= (upg.value || 1);

    fill(owned ? 'gray' : 'white');
    rect(ux, uy, uw, uh, 10);

    fill(owned ? 180 : 0);
    textSize(16);
    textAlign(CENTER, CENTER);
    text(owned ? `✓ ${upg.label}` : `${upg.label} - ${upg.cost} 🪙`, ux + uw / 2, uy + uh / 2);

    if (mouseIsPressed &&
      mouseX >= ux && mouseX <= ux + uw &&
      mouseY >= uy && mouseY <= uy + uh && !owned) {
      if (coins >= upg.cost) {
        coins -= upg.cost;
        if (upg.key === "weapon") upgrades.weapon = upg.value;
        else upgrades[upg.key] += (upg.key === "maxHealth" ? 20 : 1);
        localStorage.setItem("coins", coins);
        localStorage.setItem("upgrades", JSON.stringify(upgrades));
      }
    }
  });

  textSize(18);
  fill(255, 255, 0);
  textAlign(RIGHT, TOP);
  text(`Coins: ${coins}`, width - 30, 30);

  let backHovered = mouseX >= 30 && mouseX <= 130 && mouseY >= 30 && mouseY <= 70;
  if (backHovered) {
    fill(240, 80, 80);
    rect(25, 25, 110, 50, 12);
  } else {
    fill(200, 60, 60);
    rect(30, 30, 100, 40, 10);
  }

  fill(255);
  textSize(18);
  textAlign(LEFT, CENTER);
  text("⬅ Back", 40, 50);
}