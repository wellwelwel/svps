#! /usr/bin/env node

const [, , ...args] = process.argv;
const main = args.join('-') || 'create';

(async () => {
  try {
    const alloweds = ['create', 'mount', 'set-domains'];

    if (!alloweds.includes(main)) {
      console.log(
        'Enter one of the following commands: "create", "mount", "set domains"'
      );
      return;
    }

    await import(`../lib/tasks/${main.trim()}.js`);
  } catch (error) {
    console.log(`\x1b[0m\x1b[1m\x1b[31m✖︎`, error, '\x1b[0m\n');
    process.exit(1);
  }
})();
