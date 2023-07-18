## Examples 🧙🏻

The extension of examples are `.ts` for automated testing purposes. You can use them as `.js` normally.

---

### Setting your _.svpsrc.js_ for:

> For default settings, you can perform `npx svps create`

- Append your commands
  - [Creating a personal welcome message from a `.sh` file when logging into the **VPS**](./append-commands/ssh-welcome-message/)
- [Turn your **Ubuntu Server** into a **Desktop Server** with **RDP**](./desktop/)
- [**FTP** access](./ftp/)
- [**SFTP** access](./sftp/)
- [Install **MySQL**](./mysql/)
- [Install **Node.js**](./node/)
- [Install **PHP**](./php/)
- [Create a **RSA Certificate**](./rsa/)
- [**Crontab**](./crontab/)
- Virtual Hosts
  - Basic Usage
    - [Creating domains with **Node.js** and **MySQL**](./virtual-hosts/basic/node-and-mysql)
    - [Creating domains with **PHP** and **MySQL**](./virtual-hosts/basic/php-and-mysql)
  - Advanced Usage
    - [Creating a domain with a custom **server**, **cache storage**, **database** and **queue**](./virtual-hosts//advanced/server-db-cache-queue/)

---

### Running SVPS and your bash commands

```sh
npx svps mount
```

---

### Creating Virtual Hosts

```sh
npx svps set domains
```