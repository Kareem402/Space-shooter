class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 70;
    this.width = 40;
    this.height = 20;
    this._health = 100;
    this.maxHealth = 100;
    this.shieldActive = false;
    this.shieldTimer = 0;
    this.rapidFire = false;
    this.rapidTimer = 0;
    this.lastShot = 0;
  }

  update() {
    if (keyIsDown(LEFT_ARROW)) this.x -= 7;
    if (keyIsDown(RIGHT_ARROW)) this.x += 7;
    this.x = constrain(this.x, 0, width - this.width);

    if (this.rapidFire && frameCount - this.lastShot > 5 && keyIsDown(32)) {
      this.shoot();
      this.lastShot = frameCount;
    }
  }

  display() {
    // Player color
    switch (selectedSkin) {
      case 'blue':
        fill(0, 0, 255);
        break;
      case 'red':
        fill(255, 0, 0);
        break;
      case 'gold':
        fill(255, 215, 0);
        break;
      default:
        fill(0, 255, 0); // green
    }

    rect(this.x, this.y, this.width, this.height);

    // === Health Bar ===
    let barWidth = 200;
    let barHeight = 20;
    let healthRatio = this._health / this.maxHealth;
    let fillColor = color(lerpColor(color(255, 0, 0), color(0, 255, 0), healthRatio));

    fill(80);
    rect(20, 20, barWidth, barHeight, 10);
    fill(fillColor);
    rect(20, 20, barWidth * healthRatio, barHeight, 10);

    fill(255);
    textSize(14);
    textAlign(CENTER, CENTER);
    text(`Health: ${this._health}`, 20 + barWidth / 2, 20 + barHeight / 2);

    // === Score Bar ===
    let nextThreshold = skinOptions.find(s => s.threshold > score)?.threshold || score + 100;
    let scoreRatio = score / nextThreshold;

    fill(60);
    rect(20, 50, barWidth, barHeight, 10);
    fill(255, 215, 0); // gold
    rect(20, 50, barWidth * constrain(scoreRatio, 0, 1), barHeight, 10);

    fill(255);
    text(`Score: ${score}`, 20 + barWidth / 2, 50 + barHeight / 2);
  }

  shoot() {
    if (!this.rapidFire && frameCount - this.lastShot < 20) return;
    projectiles.push(new Projectile(this.x + this.width / 2, this.y));
    this.lastShot = frameCount;

    if (shootSound && shootSound.isLoaded()) {
      shootSound.setVolume(0.3);
      shootSound.play();
    }
  }

  get health() {
    return this._health;
  }

  takeDamage(amount) {
    this._health = max(0, this._health - amount);
  }
}
