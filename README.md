<div align="center">
  <h1>SVPS - Simplifying VPS</h1>
  <p>🚀 An easier tool to automate your <b>Ubuntu Server</b> setup and domain forwarding</p>
  <a href="https://www.npmjs.com/package/svps"><img src="https://img.shields.io/npm/v/svps?style=flat" alt="npm"></a>
  <a href="https://github.com/wellwelwel/svps/actions/workflows/ci.yml?query=branch%3Amain"><img src="https://img.shields.io/github/actions/workflow/status/wellwelwel/svps/ci.yml?event=push&style=flat&label=ci&branch=main" alt="GitHub Workflow Status (with event)"></a>
  <a href="https://www.npmjs.com/package/svps"><img src="https://img.shields.io/npm/dt/svps?style=flat" alt="npm"></a>
  <a href="https://github.com/wellwelwel/svps/blob/main/LICENSE"><img src="https://raw.githubusercontent.com/wellwelwel/svps/main/.github/assets/readme/license.svg" alt="License"></a>
</div>

## Table of Contents

- [About](#about)
- [Installation](#installation)
- [Usage](#usage)
  - [Automatic Installations](#automatic-installations)
    - [Available **auto-installation**](#available-auto-installation)
    - [Notes](#notes)
  - [Personal Commands (Queuing)](#personal-commands-queuing)
  - [Upload Files and Directories](#upload-files-and-directories)
  - [**Virtual Hosts** (Domains Forwarding)](#virtual-hosts-domains-forwarding)
    - [Basic Usage](#basic-usage-easier)
    - [Advanced Usage](#advanced-usage-manual)
  - [Turning **VPS Server** into **Desktop Server** (**RDP**)](#turning-vps-server-into-desktop-server-rdp)
  - [Testing using a **Docker** Container](#testing-using-a-docker-container)
  - [Close the Connection](#close-the-connection)
- [Important](#important)
  - [Known Issues](#known-issues)
  - [Compatibility](#compatibility)
- [Community](#community)
  - [Contributing](#contributing)

---

## About

**SVPS**, initially designed to simplify tasks for non-Unix users, works as an **ORM** for **Ubuntu Servers**.

It supports command automation, files and directories upload via **SFTP**, automatic installations and configurations, domain forwarding, local text files and template strings into _escaped quoted strings_ for dynamic remote file creation, among other features.

All this, using just a _single one_ connection 🧙🏻✨

---

## Installation

```shell
  npm i svps
```

## Usage

```js
import { SVPS } from 'svps';

/** Prepare the connection */
const svps = new SVPS({
  access: {
    host: '127.0.0.1',
    username: 'root',
    password: 'root',
  },
});

/** Available methods
 * svps.mount
 * svps.commands
 * svps.createVirtualHosts
 * svps.upload
 * svps.end
 *
 * See about each below 🕵🏻
 */
```

---

### Automatic Installations

```js
await svps.mount({
  php: true || { version: 8.2, composer: true },
  node: true || { version: 18, packages: ['yarn'] },
  apache: true,
  docker: true,
  // ...

  /**
   * ... Users, Desktop (RDP), Firewall,  etc.
   *
   * See all available automatic installations below 👇🏻
   */
});
```

#### Available auto-installation

- [Repair common possible conflicts and vulnerabilities on **Ubuntu**](./src/lib/tasks/steps/repair.ts)
- [Run common `apt` commands](./src/lib/tasks/steps/apt.ts)
- [Set the most common **Firewall** (`ufw`) settings](./src/lib/tasks/steps/firewall.ts)
  - This will activate the **SSH** port according to the entered port or `22` by default
  - The **Firewall** has different behaviors when combined with **Desktop** and **MySQL**
- [Create users and groups](./src/lib/tasks/steps/users/)
- [**SFTP** by enabling it for any user](./examples/sftp/)
- [**FTP** (`vsftpd`) by enabling it for any user](./examples/ftp/)
- [**RSA Certificate**](./examples/rsa/)
- [**Docker** and **Docker Compose**](./src/lib/tasks/steps/docker.ts)
- [**PHP**](./examples/php/)
- [**Node.js**](./examples/node/)
- [**MySQL**](./examples/mysql/)
- [**Crontab**](./examples/crontab/)
- [**Remote Desktop Protocol** (**RDP**)](./examples/desktop/)
- [Restart the **Server**](./src/lib/tasks/steps/reboot.ts)

> See some practical [examples](./examples/).

#### Notes

- The entire remote process is displayed on console in real time
- Find all the commands behind **SVPS** in [_src/lib/tasks/steps_](./src/lib/tasks/steps/)
- This may take a long time depending on your **VPS** specifications

---

### Personal Commands (Queuing)

Create your own commands and combine with other **SVPS** features.

```js
const commands = ['echo "🚀"'];

await svps.commands(commands);
```

- You can use the `escapeQuotes` method to create multi-line escaped quoted strings. See an example [here](./examples/commands/ssh-welcome-message/).

---

### Upload Files and Directories

Transfer your local files and directories and set permissions for each upload.

```js
await svps.upload([
  {
    local: './my-app-dist',
    remote: '/workspace',
    permissions: {
      user: 'my-user',
    },
  },
]);
```

- It uses **SFTP** to send the content to remote server

---

### Virtual Hosts (Domains Forwarding)

```js
await svps.createVirtualHosts([
  // Basic or Advanced Virtual Hosts
]);

/**
 * This will create a log with the processed domains to ensure that only new domains are processed.
 * If you delete this log, the domains will be understood as new and will be overwritten.
 */
```

#### Basic Usage (easier)

![Node.js](https://img.shields.io/badge/Node.js-LTS-green)
![PHP](https://img.shields.io/badge/PHP-8.2-4F5B93)
![MySQL](https://img.shields.io/badge/MySQL-8.x-blue)

You can automatically create **Node.js** (**LTS**) and **PHP** (**8.2**) services and work on them in `/var/containers/domains`**`/your_domain`**.  
Also, it allows to use an exclusive **MySQL** database for each domain.

```js
await svps.createVirtualHosts([
  {
    domain: 'site.com',
    port: 5000,
    www: true /** creates an alias for "www.site.com" */,
    server: {
      language: 'node' | 'php',
      mysql: {
        database: 'db-name',
        password: 'db-pass',
        expose: 5001 /** expose port 5001 locally */,
        isPublic: true /** expose port 5001 outside the VPS */,
      },
    },
  },
]);
```

- For **PHP**, you can flag the `server` option `buildFromScratch` as `true` to create the Virtual Host image from scratch, otherwise it will pull the images from my [Docker Hub](https://hub.docker.com/r/wellwelwel/php) 🙋🏻‍♂️

To create flexible **Basic Virtual Hosts**, **SVPS** uses **Docker** containers and **Apache2** to proxy their ports to your domains.

> **Apache2**, **Docker** and **Docker Compose** required.
>
> See some practical examples [here](./examples/virtual-hosts/basic/).

---

#### Advanced Usage (manual)

![Everything](https://img.shields.io/badge/Everything-violet)

By using the **Virtual Hosts** solely to proxy your services, you can create services in any language you choose, by simply defining the port your service is on.

```js
await svps.createVirtualHosts([
  {
    domain: 'site.com',
    port: 5000,
    www: true /** creates an alias for "www.site.com" */,
  },
]);

// It will proxy your service at port 5000 to "site.com" and "www.site.com"
```

> **Apache2** required.

---

### Turning VPS Server into Desktop Server (RDP)

```js
await svps.mount({
  desktop: true,
});

/** That's it 🤹🏻‍♀️ */
```

- It will install **Xubuntu Desktop** and **RDP Remote** in port `3389`
- The desktop installation can take longer and take up more disk space (about 1GB to 3GB)
- If you are using a **container**, remember to expose the port `3389`
- To access, use your credentials in a Remote Desktop Software

> See a practical [example](./examples/desktop/) using a **Docker** container.

---

### Testing using a Docker Container

- Create the container:

  ```sh
  docker run -d --privileged -p 22:22 --restart always wellwelwel/vps:latest
  ```

  - Add `-p 3389:3389` if you want to test it using **Remote Desktop Protocol**
  - See more in [hub.docker.com/r/wellwelwel/vps](https://hub.docker.com/r/wellwelwel/vps)

- Then, set the default access:

  ```js
  const svps = new SVPS({
    access: {
      host: '127.0.0.1',
      username: 'root',
      password: 'root',
      port: 22,
    },
  });
  ```

---

### Close the Connection

```js
await svps.end();
```

---

## Important

- This package is designed for pre-built **VPS**, **KVM** and **Ubuntu Server** `>=18.04`
- The **SSH** user needs to be the **root** or a **super user**
- Avoid running this tool on a server that is already in production, unless you know what you're doing 🧙🏻

---

### Known Issues

- [**Node.js** `>=18` is not compatible with **Ubuntu** `18.04`](https://github.com/nodesource/distributions/issues/1392)
- I think it's not possible to use a **Docker** container with **RDP** inside a **VPS** without **RDP**
  - Any help on this is welcome 🚀

---

### Compatibility

![macOS](/.github/assets/readme/macos.svg)
![Linux](/.github/assets/readme/linux.svg)
![Windows](/.github/assets/readme/windows.svg)
![node](/.github/assets/readme/node.svg)
![npm](/.github/assets/readme/npm.svg)

---

## Community

I'm continuously working to improve **SVPS**. If you've got something interesting to share, feel free to submit a [**Pull Request**](https://github.com/wellwelwel/svps/compare). If you notice something wrong, I'd appreciate if you'd open an [**Issue**](https://github.com/wellwelwel/svps/issues/new).

---

### Contributing

Please check the [_CONTRIBUTING.md_](./CONTRIBUTING.md) for instructions 🚀
