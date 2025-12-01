import assert from 'assert';

export class Direction {

    index: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

    static #DIR_NESW_CW_BIMAP = {
        N: 0, NE: 1, E: 2, SE: 3, S: 4, SW: 5, W: 6, NW: 7,
        0: "N", 1: "NE", 2: "E", 3: "SE", 4: "S", 5: "SW", 6: "W", 7: "NW",
    }

    static #DIR_URDL_CW_BIMAP = {
        U: 0, UR: 1, R: 2, DR: 3, D: 4, DL: 5, L: 6, UL: 7,
        0: "U", 1: "UR", 2: "R", 3: "DR", 4: "D", 5: "DL", 6: "L", 7: "UL",
    }

    // 0,0 is top left, indices are like 2d array growing down and right
    static #DIR_TO_DELTA = {
        N: [-1, 0], E: [0, 1], S: [1, 0], W: [0, -1],
        NE: [-1, 1], SE: [1, 1], SW: [1, -1], NW: [-1, -1],
    }

    /**
     * @param {number} index - index of direction in CCW order
     */
    constructor(index) {
        assert(index >= 0 && index < 8, 'Invalid direction index ' + index);
        // read only
        this.index = index;
    }

    public get kind() {
        return this.index % 2 === 0 ? "cardinal" : "diagonal";
    }

    public get opposite() {
        return new Direction((this.index + 4) % 8);
    }

    public get nesw() {
        return Direction.#DIR_NESW_CW_BIMAP[this.index];
    }

    public get urdl() {
        return Direction.#DIR_URDL_CW_BIMAP[this.index];
    }

    public get delta() {
        return Direction.#DIR_TO_DELTA[this.nesw].slice();
    }

    /**
     * Return new direction rotated by n*45 degrees in CCW direction
     * @param {number} n number of times to rotate by 45 in CCW direction
     * @returns {Direction} new direction
     */
    public rotated(n = 2) {
        return new Direction(((this.index + n) % 8 + 8) % 8);
    }

    /**
     * Parse wind rose names to direction
     * @param {string} str - wind rose name
     * @returns {Direction}
     */
    static parse(str) {
        const idx = Direction.#DIR_NESW_CW_BIMAP[str] ?? Direction.#DIR_URDL_CW_BIMAP[str];
        if (idx === undefined) throw new Error("Invalid name " + str);
        return new Direction(idx);
    }

    /**
     * Return the string representation of the direction
     * @param {("windrose"|"relative")} [format="windrose"] - format of the string representation
     * @returns {string}
     */
    toString(format = "windrose") {
        if (format === "relative") {
            const dirMap = { 0: "U", 2: "R", 4: "D", 6: "L", 1: "UR", 3: "DR", 5: "DL", 7: "UL" };
            return dirMap[this.index];
        }
        return Direction.#DIR_NESW_CW_BIMAP[this.index];
    }
}
