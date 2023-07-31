/**
 * Using a Docker Container to create a local VPS:
 * docker run -d --privileged -p 22:22 --restart always wellwelwel/vps:latest
 *
 * Or just put your own VPS access to test
 */

// @ts-check
// import { SVPS, escapeQuotes } from 'svps';
import { SVPS, escapeQuotes } from '../../../lib/index.js';
import fs from 'fs';

const bashrc = fs.readFileSync('./my-bashrc.sh', 'utf-8');
const quotedBashrc = escapeQuotes(bashrc);

const svps = new SVPS({
  access: {
    host: '127.0.0.1',
    username: String(process.env.USER),
    password: process.env.PASS,
  },
});

const commands = [`echo ${quotedBashrc} | cat > ~/.bashrc`];

await svps.commands(commands);

await svps.end();
