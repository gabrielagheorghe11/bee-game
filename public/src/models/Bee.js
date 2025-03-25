export class Bee {
  constructor(type, maxHp, damageOnHit) {
    this.type = type;
    this.maxHp = maxHp;
    this.currentHp = maxHp;
    this.damageOnHit = damageOnHit;
  }

  hit() {
    this.currentHp -= this.damageOnHit;
    if (this.currentHp < 0) {
      this.currentHp = 0;
    }
  }

  isAlive() {
    return this.currentHp > 0;
  }
}
