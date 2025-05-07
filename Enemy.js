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
      case 'fast': image(imgEnemyFast, this.x, this.y, this.size, this.size); break;
      case 'zigzag': image(imgEnemyZigzag, this.x, this.y, this.size, this.size); break;
      default: image(imgEnemyBasic, this.x, this.y, this.size, this.size);
    }
  }
}
