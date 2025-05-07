class Projectile {
  constructor(x, y, type = 'normal') {
    this.x = x;
    this.y = y;
    this.speed = 8;
    this.type = type;
    this.width = this.type === 'laser' ? 2 : 4;
  }

  update() {
    this.y -= this.speed;
  }

  display() {
    image(imgBullet, this.x, this.y, this.width, 10);
  }
}
