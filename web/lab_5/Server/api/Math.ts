export function getRandomRangeInt(min: number = 0, max: number):number {
    return Math.floor(Math.random() * Math.floor(max - min + 1) + min);
}

export function getRandomInt(max: number): number {
    return getRandomRangeInt(0, max);
}