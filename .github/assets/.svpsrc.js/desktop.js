import { defineConfig } from 'svps';

export default defineConfig({
  access: [
    {
      host: process.env?.HOST || '127.0.0.1',
      username: process.env.USER,
      password: process.env.PASS,
      port: Number(process.env.PORT) || 22,
    },
  ],
  steps: {
    repare: true,
    apt: true,
    firewall: true,
    desktop: true,
    reboot: true,
  },
});
