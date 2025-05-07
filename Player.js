class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 70;
    this.width = 50;
    this.height = 50;
    this.size = 40;

    this._health = 100;
    this.maxHealth = 100;

    this.shieldActive = false;
    this.shieldTimer = 0;

    this.rapidFire = false;
    this.rapidTimer = 0;

    this.lastShot = 0;

    this.weaponType = 'normal';
    this.enemiesKilled = 0;
    this.shotsFired = 0;
    this.speedBoost = 0;
  }

  update() {
    let moveSpeed = 7 + this.speedBoost;
    if (keyIsDown(LEFT_ARROW)) this.x -= moveSpeed;
    if (keyIsDown(RIGHT_ARROW)) this.x += moveSpeed;
    this.x = constrain(this.x, 0, width - this.width);

    if (this.rapidFire && frameCount - this.lastShot >= 5) {
      this.shoot();
      this.lastShot = frameCount;
    }
  }

  display() {
    image(imgPlayerGreen, this.x, this.y, this.width, this.height);

    // === TOP-LEFT HUD ===
    fill(100);
    rect(20, 20, 200, 20);
    fill(lerpColor(color(255, 0, 0), color(0, 255, 0), this._health / this.maxHealth));
    rect(20, 20, map(this._health, 0, this.maxHealth, 0, 200), 20);
    fill(255);
    textSize(14);
    textAlign(LEFT, CENTER);
    text(`Health: ${this._health}`, 230, 30);

    fill(50);
    rect(20, 50, 200, 10);
    fill(255, 215, 0);
    rect(20, 50, map(score, 0, 500, 0, 200), 10);
    fill(255);
    textSize(14);
    text(`Score: ${score}`, 230, 55);

    let statusY = height - 100;
    textSize(16);
    textAlign(LEFT, TOP);

    if (this.shieldActive) {
      fill(0, 200, 255);
      text("🛡️ Shield Active", 20, statusY);
      statusY += 20;
    }

    if (this.rapidFire) {
      fill(255, 100, 100);
      text("🔫 Rapid Fire Active", 20, statusY);
      statusY += 20;
    }

    if (freezeEnemies) {
      fill(150, 255, 255);
      text("❄️ Time Frozen!", 20, statusY);
      statusY += 20;
    }

    fill(200, 255, 200);
    text(`🌊 Wave: ${gameManager.waveLevel}`, 20, statusY);
  }

  shoot() {
    if (!this.rapidFire && frameCount - this.lastShot < 10) return;
    this.shotsFired++;

    if (this.weaponType === 'spread') {
      projectiles.push(new Projectile(this.x + this.width / 2 - 10, this.y, 'spread'));
      projectiles.push(new Projectile(this.x + this.width / 2, this.y, 'spread'));
      projectiles.push(new Projectile(this.x + this.width / 2 + 10, this.y, 'spread'));
    } else {
      projectiles.push(new Projectile(this.x + this.width / 2, this.y, this.weaponType));
    }

    this.lastShot = frameCount;
  }

  takeDamage(amount) {
    if (this.shieldActive) return;
    this._health = max(0, this._health - amount);
  }

  get health() {
    return this._health;
  }
}
