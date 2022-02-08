#! /usr/bin/env node

const [ ,, ...args ] = process.argv;
const main = args[0];

(() => {

   if (!main || main?.trim()?.length === 0) {

      console.log('Enter one of the following commands: "init", "mount", "add-sites"');
      return;
   }

   require(`../src/tasks/${main.trim()}`);
})();