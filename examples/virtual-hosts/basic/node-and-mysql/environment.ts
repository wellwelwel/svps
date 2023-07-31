/**
 * Using a Docker Container to create a local VPS:
 * docker run -d --privileged -p 22:22 -p 5001:5001 --restart always wellwelwel/vps:latest
 *
 * Or just put your own VPS access to test
 */

// @ts-check
// import { mount } from 'svps';
import { mount } from '../../../../lib/index.js';

/**
 * Install Apache2, Docker and create an user to manage the Virtual Hosts via SFTP
 */
await mount();
