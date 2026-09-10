export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
export class Ranger {
    min = 0;
    max = 0;
    num = 0;
    constructor(that) {
        this.min = that.min;
        this.max = that.max;
        this.num = that.now;
    }
    set(value) { this.num = clamp(value, this.min, this.max); }
    now() { return this.num; }
}
//# sourceMappingURL=utils.js.map