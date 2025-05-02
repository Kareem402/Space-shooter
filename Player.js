class Player {
    constructor() {
      this.x = width / 2;
      this.y = height - 50;
      this.width = 40;
      this.height = 20;
      this._health = 100;
    }
  
    update() {
      if (keyIsDown(LEFT_ARROW)) this.x -= 5;
      if (keyIsDown(RIGHT_ARROW)) this.x += 5;
      this.x = constrain(this.x, 0, width);
    }
  
    display() {
      fill(0, 255, 0);
      rect(this.x, this.y, this.width, this.height);
      fill(255);
    textSize(20);
    textAlign(LEFT, TOP);
    text("Health: " + this._health, 10, 10);
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