import fs from 'fs';

export const readJSON = (file: string): object => JSON.parse(fs.readFileSync(file, 'utf-8'));

export const buildJSON = (obj: object) => JSON.stringify(obj, null, 2);
