class Player {
    constructor() {
      this.x = width / 2;
      this.y = height - 70;
      this.width = 40;
      this.height = 20;
      this._health = 100;
      this.maxHealth = 100;
    }
  
    update() {
      if (keyIsDown(LEFT_ARROW)) this.x -= 5;
      if (keyIsDown(RIGHT_ARROW)) this.x += 5;
      this.x = constrain(this.x, 0, width - this.width);
    }
  
    display() {
      fill(0, 255, 0);
      rect(this.x, this.y, this.width, this.height);
  
      // === Animated Health Bar ===
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
    }
  
    shoot() {
      projectiles.push(new Projectile(this.x + this.width / 2, this.y));
    }
  
    get health() {
      return this._health;
    }
  
    takeDamage(amount) {
      this._health = max(0, this._health - amount);
    }
  }  