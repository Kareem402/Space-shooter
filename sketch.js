// --- top unchanged setup ---
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

let score = 0;
let selectedSkin = 'green';
let unlockedSkins = ['green'];

const skinOptions = [
  { color: 'green', threshold: 0 },
  { color: 'blue', threshold: 100 },
  { color: 'red', threshold: 200 },
  { color: 'gold', threshold: 500 }
];

function preload() {
  soundFormats('mp3', 'wav');
  bgm = loadSound('bgm.mp3',
    () => { bgmLoaded = true; },
    (err) => { console.error("❌ Failed to load BGM:", err); }
  );
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

// -- MAIN MENU with hover on SHOP --
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
  let isHovering =
    mouseX >= shopX && mouseX <= shopX + shopW &&
    mouseY >= shopY && mouseY <= shopY + shopH;

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

// -- SHOP SCREEN with hover on skins & back button --
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

    // Draw skin box
    fill(skin.color);
    rect(x, y, 50, 50);

    // Hover effect
    if (isHovered) {
      stroke(255);
      strokeWeight(2);
      noFill();
      rect(x - 4, y - 4, 58, 58, 4);
      noStroke();
    }

    // Locked overlay
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

  // Back Button w/ hover
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

// -- rest of unchanged core logic --
function draw() {
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
    return;
  }

  if (player.shieldActive) player.shieldTimer--;
  if (player.rapidFire) player.rapidTimer--;
  if (player.shieldTimer <= 0) player.shieldActive = false;
  if (player.rapidTimer <= 0) player.rapidFire = false;

  gameManager.update();
  player.update();
  player.display();

  textSize(16);
  textAlign(LEFT, TOP);
  let statusY = height - 60;
  if (player.shieldActive) {
    fill(0, 200, 255); text("🛡️ Shield Active", 20, statusY); statusY += 20;
  }
  if (player.rapidFire) {
    fill(255, 100, 100); text("🔫 Rapid Fire Active", 20, statusY);
  }

  // enemies
  for (let i = enemies.length - 1; i >= 0; i--) {
    let enemy = enemies[i];
    enemy.update(); enemy.display();
    if (enemy.y + 30 > height) {
      enemies.splice(i, 1);
      if (!player.shieldActive) player.takeDamage(20);
    }
  }

  // bullets
  for (let bullet of projectiles) bullet.update(), bullet.display();

  // powerups
  for (let i = powerUps.length - 1; i >= 0; i--) {
    let p = powerUps[i]; p.update(); p.display();
    if (p.isCollected(player)) {
      p.applyEffect(player); powerUps.splice(i, 1);
    }
  }

  // bullet-enemy collisions
  let bulletsToRemove = [], enemiesToRemove = [];
  for (let i = 0; i < projectiles.length; i++) {
    let bullet = projectiles[i];
    for (let j = 0; j < enemies.length; j++) {
      let enemy = enemies[j];
      if (bullet.x >= enemy.x && bullet.x <= enemy.x + 30 && bullet.y >= enemy.y && bullet.y <= enemy.y + 30) {
        fadingEnemies.push({ x: enemy.x, y: enemy.y, size: 30, alpha: 255 });
        bulletsToRemove.push(i); enemiesToRemove.push(j); score += 10; break;
      }
    }
  }
  for (let i of bulletsToRemove.reverse()) projectiles.splice(i, 1);
  for (let j of enemiesToRemove.reverse()) enemies.splice(j, 1);

  // fading animation
  for (let i = fadingEnemies.length - 1; i >= 0; i--) {
    let e = fadingEnemies[i];
    e.alpha -= 10; e.size *= 0.9;
    if (e.alpha <= 0 || e.size <= 1) fadingEnemies.splice(i, 1);
    else {
      fill(255, 0, 0, e.alpha);
      rect(e.x, e.y, e.size, e.size);
    }
  }

  if (projectiles.length > 300) projectiles.splice(0, 100);
  if (player.health <= 0) gameOver = true;
}

function keyPressed() {
  if (!gameStarted) {
    if (key === '1') startGame("easy");
    if (key === '2') startGame("medium");
    if (key === '3') startGame("hard");
    return;
  }
  if (gameOver && (key === 'r' || key === 'R')) returnToMenu();
  if (key === ' ' && !player.rapidFire) player.shoot();
}

function mousePressed() {
  if (!gameStarted) {
    if (inShop) {
      if (mouseX >= 30 && mouseX <= 130 && mouseY >= 30 && mouseY <= 70) {
        inShop = false; return;
      }
      let startX = width / 2 - (skinOptions.length * 60) / 2;
      let y = height / 2;
      skinOptions.forEach((skin, i) => {
        let x = startX + i * 60;
        if (mouseX >= x && mouseX <= x + 50 && mouseY >= y && mouseY <= y + 50) {
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
        inShop = true; return;
      }
    }
  }
  if (getAudioContext().state !== 'running') getAudioContext().resume();
}

function startGame(level) {
  difficulty = level; score = 0;
  player = new Player(); enemies = [];
  projectiles = []; powerUps = []; fadingEnemies = [];
  gameManager = new GameManager(difficulty);
  gameStarted = true; gameOver = false;
  if (bgmLoaded && !bgm.isPlaying()) {
    bgm.setLoop(true);
    bgm.setVolume(isMuted ? 0 : 0.4);
    bgm.play();
  }
}

function returnToMenu() {
  gameStarted = false;
  gameOver = false;
  difficulty = null;
  inShop = false;
  enemies = []; projectiles = [];
  powerUps = []; fadingEnemies = [];
  if (bgmLoaded && bgm.isPlaying()) bgm.stop();
}
