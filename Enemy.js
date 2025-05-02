class Enemy {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.speed = 2;
    }
  
    update() {
      this.y += this.speed;
    }
  
    display() {
      fill(255, 0, 0);
      rect(this.x, this.y, 30, 30);
    }
  }
  
  class FastEnemy extends Enemy {
    constructor(x, y) {
      super(x, y);
      this.speed = 4;
    }
  }
  
  class ZigzagEnemy extends Enemy {
    constructor(x, y) {
      super(x, y);
      this.dir = 1;
    }
  
    update() {
      this.x += this.dir * 2;
      if (this.x <= 0 || this.x >= width - 30) this.dir *= -1;
      this.y += 1.5;
    }
  }  