export const uniqueArray = <U = any>(arr: U[]): U[] => [...new Set(arr.map((item) => JSON.stringify(item)))].map((item) => JSON.parse(item));
