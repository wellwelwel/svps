/**
 * Convert a text file in an single line string and quote it to use in bash commands. Ex.:
 *
 * ```js
 * import fs from 'fs';
 * import { escapeQuotes } from './lib/index.js';
 *
 * // test.txt:
 * // Line: "1"
 * // Line: "2"
 * const fileContent = fs.readFileSync('./test.txt', 'utf-8');
 *
 * // "Line: \"1\"\nLine: \"2\""
 * escapeQuotes(fileContent);
 * ```
 */
export const escapeQuotes = (string: string) => {
  const hash = 'QSByYW5kb21pemVkIGhhc2g=';
  const encrypted = string.replace(/\n|\r/gm, hash);
  const escaped = JSON.stringify(encrypted);

  return escaped.replace(new RegExp(hash, 'gm'), '\n');
};
