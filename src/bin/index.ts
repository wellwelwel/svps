#! /usr/bin/env node

const [, , ...args] = process.argv;
const main = args.join('-') || 'create';

(async () => {
   const alloweds = ['create', 'mount', 'set-domains'];

   if (!alloweds.includes(main)) {
      console.log('Enter one of the following commands: "create", "mount", "set domains"');
      return;
   }

   await import(`../lib/tasks/${main.trim()}.js`);
})();
