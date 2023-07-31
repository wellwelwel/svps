/**
 * Using a Docker Container to create a local VPS:
 * docker run -d --privileged -p 22:22 --restart always wellwelwel/vps:latest
 *
 * Or just put your own VPS access to test
 */

// @ts-check
// import { mount } from 'svps';
import { mount } from '../../../lib/index.js';

await mount();
