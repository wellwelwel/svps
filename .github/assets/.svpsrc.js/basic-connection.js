import { defineConfig } from 'svps';

export default defineConfig({
  access: [
    {
      host: '127.0.0.1',
      username: 'root',
      password: 'root',
      port: 2222,
    },
  ],
});
