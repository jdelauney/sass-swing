/**
 * S'assure que le nombre num est compris entre min et max inclus
 * @param {number} num
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const clamp = (num, min, max) => {
	return Math.min(Math.max(num, min), max)
}

/**
 * S'assure que le nombre num est compris entre 0 et 255 inclus
 * @param {number } num
 * @returns {number}
 */
export const clampByte = (num) => {
	return clamp(num, 0, 255)
}