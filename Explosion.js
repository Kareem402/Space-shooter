class Explosion {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.life = 30;
      this.maxLife = 30;
    }
  
    update() {
      this.life--;
    }
  
    display() {
      let alpha = map(this.life, 0, this.maxLife, 0, 255);
      fill(255, 100, 0, alpha);
      noStroke();
      ellipse(this.x, this.y, map(this.life, 0, this.maxLife, 50, 10));
    }
  
    isFinished() {
      return this.life <= 0;
    }
  }
  