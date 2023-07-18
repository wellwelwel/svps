export const escapeQuotes = (string: string) => {
  const hash = 'QSByYW5kb21pemVkIGhhc2g=';
  const encrypted = string.replace(/\n|\r/gm, hash);
  const escaped = JSON.stringify(encrypted);

  return escaped.replace(new RegExp(hash, 'gm'), '\n');
};
