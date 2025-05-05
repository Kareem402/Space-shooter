class Enemy {
  constructor(x, y, type = 'basic', speed = 2) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.baseSpeed = speed;
    this.speed = speed;
    this.angle = 0;
    this.amplitude = 30;
    this.direction = random() < 0.5 ? 1 : -1;
    this.size = 40;

    // NEW: Smarter enemies
    this.shootCooldown = 90;
    this.lastShotFrame = frameCount;
  }

  update() {
    if (this.type === 'zigzag') {
      this.x += sin(this.angle) * this.direction * 2;
      this.y += this.speed;
      this.angle += 0.1;
    } else {
      this.y += this.speed;
    }

    if (this.type !== 'basic' && frameCount - this.lastShotFrame > this.shootCooldown) {
      if (random() < 0.2) {
        projectiles.push(new Projectile(this.x + this.size / 2, this.y + this.size, 'enemy'));
      }
      this.lastShotFrame = frameCount;
    }
  }

  display() {
    switch (this.type) {
      case 'fast': fill(255, 165, 0); break;
      case 'zigzag': fill(186, 85, 211); break;
      default: fill(255, 0, 0);
    }
    rect(this.x, this.y, this.size, this.size);
  }
}
