class Explosion {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.life = 30;
      this.maxLife = 30;
    }
  
    update() {
      this.life = max(0, this.life - 1); // prevent negatives
    }
  
    display() {
      const alpha = map(this.life, 0, this.maxLife, 0, 255);
      const radius = map(this.life, 0, this.maxLife, 50, 10);
  
      if (!isFinite(alpha) || !isFinite(radius)) return;
  
      fill(255, 100, 0, alpha);
      noStroke();
      ellipse(this.x, this.y, radius);
    }
  
    isFinished() {
      return this.life <= 0;
    }
  }
  