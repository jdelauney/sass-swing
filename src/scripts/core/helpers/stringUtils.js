/**
 * Met en majuscule la première lettre
 * @param {string} string
 * @return {string}
 */
export const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Convertit les "entities" en caractère normal
 * @param {string} string
 * @return {string}
 */
export const unescapeHTML = (string) => {
  const str = string;
  str.replace(
    /&amp;|&lt;|&gt;|&#39;|&quot;/g,
    (tag) =>
      ({
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&#39;': "'",
        '&quot;': '"',
      }[tag] || tag),
  );
  return str;
};

/**
 * Protège contre les attaques XSS et echappe les caractères spéciaux
 * @param {string} string
 * @return {string}
 */
export const escapeHTML = (string) => {
  const str = string;
  str
    .replace(/javascript:/gi, '')
    .replace(/<script:/gi, '')
    .replace(
      /[&<>'"]/g,
      (tag) =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;',
        }[tag] || tag),
    );
  return str;
};

/**
 * Remplace les caractères accentués par leurs caractères normaaux
 * @param {string} string
 * @return {string}
 */
export const removeAccents = (string) => {
  let str = '';
  if (string.search(/[\xC0-\xFF]/g) > -1) {
    str = string
      .replace(/[\xC0-\xC5]/g, 'A')
      .replace(/[\xC6]/g, 'AE')
      .replace(/[\xC7]/g, 'C')
      .replace(/[\xC8-\xCB]/g, 'E')
      .replace(/[\xCC-\xCF]/g, 'I')
      .replace(/[\xD0]/g, 'D')
      .replace(/[\xD1]/g, 'N')
      .replace(/[\xD2-\xD6\xD8]/g, 'O')
      .replace(/[\xD9-\xDC]/g, 'U')
      .replace(/[\xDD]/g, 'Y')
      .replace(/[\xDE]/g, 'P')
      .replace(/[\xE0-\xE5]/g, 'a')
      .replace(/[\xE6]/g, 'ae')
      .replace(/[\xE7]/g, 'c')
      .replace(/[\xE8-\xEB]/g, 'e')
      .replace(/[\xEC-\xEF]/g, 'i')
      .replace(/[\xF1]/g, 'n')
      .replace(/[\xF2-\xF6\xF8]/g, 'o')
      .replace(/[\xF9-\xFC]/g, 'u')
      .replace(/[\xFE]/g, 'p')
      .replace(/[\xFD\xFF]/g, 'y');
  }
  return str;
};
