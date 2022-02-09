#! /usr/bin/env node

const [ ,, ...args ] = process.argv;
const main = args.join('-') || 'init';

(() => {

   const alloweds = [

      'init',
      'mount',
      'set-domains',
   ];

   if (!alloweds.includes(main)) {

      console.log('Enter one of the following commands: "init", "mount", "set domains"');
      return;
   }

   require(`../src/tasks/${main.trim()}`);
})();