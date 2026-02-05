

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

export class Ranger
{
	private min: number = 0;
	private max: number = 0;
	private num: number = 0;
	constructor(that: {min: number, max: number, now: number})
	{
		this.min = that.min;
		this.max = that.max;
		this.num = that.now;
	}
	set(value: number) {this.num = clamp(value, this.min, this.max)}
	now() {return this.num}
}