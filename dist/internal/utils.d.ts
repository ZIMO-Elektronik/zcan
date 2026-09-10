export declare const delay: (ms: number) => Promise<unknown>;
export declare const clamp: (num: number, min: number, max: number) => number;
export declare class Ranger {
    private min;
    private max;
    private num;
    constructor(that: {
        min: number;
        max: number;
        now: number;
    });
    set(value: number): void;
    now(): number;
}
