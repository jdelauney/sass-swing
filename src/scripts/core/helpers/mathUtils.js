/**
 * S'assure que le nombre num est compris entre min et max inclus
 * @param {number} num
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const clamp = (num, min, max) => {
  return Math.min(Math.max(num, min), max);
};

export const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const safeRandomBetween = (min, max) => {
  const randomNumber = crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296;
  return Math.floor(randomNumber * (max - min + 1)) + min;
};
