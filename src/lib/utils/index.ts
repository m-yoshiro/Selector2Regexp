export const uniqueArray = <U = any>(arr: U[]): U[] => [...new Set(arr.map((item) => JSON.stringify(item)))].map((item) => JSON.parse(item));

/**
 * Escape any special characters to use it for regexp
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
 */
export const escapeRegExp = (string: string) => string.replace(/[.*+?^=!:${}()|[\]\/\\]/g, '\\$&');
