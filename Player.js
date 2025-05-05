class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 70;
    this.width = 50;
    this.height = 30;
    this.size = 40;
    this._health = 100;
    this.maxHealth = 100;
    this.shieldActive = false;
    this.shieldTimer = 0;
    this.rapidFire = false;
    this.rapidTimer = 0;
    this.lastShot = 0;

    // NEW
    this.weaponType = 'normal';
    this.enemiesKilled = 0;
    this.shotsFired = 0;
  }

  update() {
    if (keyIsDown(LEFT_ARROW)) this.x -= 7;
    if (keyIsDown(RIGHT_ARROW)) this.x += 7;
    this.x = constrain(this.x, 0, width - this.width);

    if (this.rapidFire && frameCount - this.lastShot >= 5) {
      this.shoot();
      this.lastShot = frameCount;
    }
  }

  display() {
    switch (selectedSkin) {
      case 'blue': fill(0, 0, 255); break;
      case 'red': fill(255, 0, 0); break;
      case 'gold': fill(255, 215, 0); break;
      default: fill(0, 255, 0);
    }

    rect(this.x, this.y, this.width, this.height);

    // Health bar and score bar (unchanged)
    // ...
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