<h4 align="center">Next version in progress</h4>
<h2 align="center">SVPS - Auto Mount VPS</h2>
<p align="center">🚀 An easier tool to automate your <b>Ubuntu VPS</b> setup and domain forwarding</p>
<div align="center">
  <img src="https://img.shields.io/npm/dt/svps?style=flat" alt="npm">
  <img src="https://img.shields.io/github/actions/workflow/status/wellwelwel/svps/ci.yml?event=push&style=flat&label=ci&branch=next" alt="GitHub Workflow Status (with event)">
  <img src="https://img.shields.io/npm/v/svps?style=flat" alt="npm">
</div>

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [First Step: **Create**](#first-step-create)
  - [Second Step: **Mount the VPS**](#second-step-mount-the-vps)
    - [Default Setps](#default-setps)
    - [Available **auto-installation**](#available-auto-installation)
    - [Notes](#notes)
  - [Turning **VPS Server** into **Desktop Server** (**RDP**)](#turning-vps-server-into-desktop-server-rdp)
  - [Testing with a **Docker** Container](#testing-with-a-docker-container)
  - [**Virtual Hosts** (domains)](#virtual-hosts-domains)
    - [Basic Usage](#basic-usage-easier)
    - [Advanced Usage](#advanced-usage-manual)
- [Important](#important)
  - [Known Issues](#known-issues)
  - [Compatibility](#compatibility)
  - [License](#license)
- [Community](#community)
  - [Contributing](#contributing)
  - [Credits](#credits)

---

## Installation

```shell
  npm i svps
```

## Usage

### First Step: Create

```sh
  npx svps create
```

This will create the default configuration file:

```
  ./.svpsrc.js
```

Then, edit the [_.svpsrc.js_](./resources/local-module/.svpsrc.js#L5) using your **SSH** access and your settings

- You can see some practical examples of _.svpsrc.js_ usage [here](./examples/).

---

### Second Step: Mount the VPS

```sh
  npx svps mount
```

#### Default Setps

- [Fix common possible conflicts on **Ubuntu**](./src/lib/tasks/steps/repare.ts)
- [Run common **apt** commands](./src/lib/tasks/steps/apt.ts)
- [Set the most common **Firewall** settings](./src/lib/tasks/steps/firewall.ts)
- [Create users](./src/lib/tasks/steps/users/)
- Execute your [personal **bash commands**](./examples/append-commands/)
- [Restarts the **VPS**](./src/lib/tasks/steps/reboot.ts)
- Reruns common [**repare**](./src/lib/tasks/steps/repare.ts) and [**apt**](./src/lib/tasks/steps/apt.ts) commands

#### Available auto-installation

- [**Firewall** (`ufw`)](./src/lib/tasks/steps/firewall.ts)
  - This will activate the **SSH** port according to the entered in _.svpsrc.js_ or `22` by default
- [**SFTP** by enabling it for an user in _.svpsrc.js_](./examples/sftp/)
- [**FTP** (`vsftpd`) by enabling it for an user in _.svpsrc.js_](./examples/ftp/)
- [**RSA Certificate**](./examples/rsa/)
- [**Docker** and **Docker Compose**](./src/lib/tasks/steps/docker.ts)
- [**PHP**](./examples/php/)
- [**Node.js**](./examples/node/)
- [**MySQL**](./examples/mysql/)
- [**Crontab**](./examples/crontab/)
- [**Remote Desktop Protocol** (**RDP**)](./examples/desktop/)

> See some practical [examples](./examples/).

#### Notes

- **All steps are optional:** You can enable or disable any step in [_.svpsrc.js_](./resources/local-module/.svpsrc.js#L29)
- You are free to **disable all the steps** and **create your own modules of bash commands** 🤹🏻‍♀️
  - See `appendCommands` in [_.svpsrc.js_](./resources/local-module/.svpsrc.js#L45) and an example [here](./examples/append-commands/)
- The entire remote process is displayed on console in real time
- Find all commands behind **SVPS** in [_src/lib/tasks/steps_](./src/lib/tasks/steps/)
- This may take a long time depending on your **VPS** plan

---

### Turning VPS Server into Desktop Server (RDP)

- In [_.svpsrc.js_](./resources/local-module/.svpsrc.js#L41), set `steps.desktop` to `true`
  - It's recommended to enable the `repare`, `apt` and `reboot` steps when installing the desktop
  - It will install **Xubuntu Desktop** and **RDP Remote** in port `3389`
  - ⚠️ The desktop installation can take longer (about 5 to 30 minutes) and take up more disk space (about 1GB to 3GB)
- If you are using a **container**, remember to expose the port `3389`
- To access use your credentials in a Remote Desktop Software

> See a practical [example](./examples/desktop/) using a **Docker** container.

---

### Testing with a Docker Container

- Create the container:

  ```sh
  docker run -d --privileged -p 22:22 --restart always wellwelwel/vps:latest
  ```

  - Add `-p 3389:3389` if you want to test it using **Remote Desktop Protocol**
  - See more in [hub.docker.com/r/wellwelwel/vps](https://hub.docker.com/r/wellwelwel/vps)

- Set the default access in [_.svpsrc.js_](./resources/local-module/.svpsrc.js#L5):

  ```js
  access: [
     {
        host: '127.0.0.1',
        username: 'root',
        password: 'root',
     },
  ],
  ```

---

### Virtual Hosts (domains)

```sh
  npx svps set domains
```

#### Basic Usage (easier)

![Node.js](https://img.shields.io/badge/Node.js-LTS-green)
![PHP](https://img.shields.io/badge/PHP-8.2-4F5B93)
![MySQL](https://img.shields.io/badge/MySQL-8.x-blue)

You can automatically create **Node.js** (**LTS**) and **PHP** (**8.2**) services and work on them in `/var/containers/domains`**`/your_domain`**.  
Also, this allows to create an default page `index.html` and use an exclusive **MySQL** database for each domain.

```js
export default defineConfig({
  access: [
    {
      host: '',
      username: 'root',
      password: '',
    },
  ],
  virtualHosts: [
    {
      domain: 'site.com',
      port: 5000,
      www: true /** crates an alias for "www.site.com" */,
      server: {
        language: 'node',
        isPublic: false /** doesn't expose port 5000 outside the VPS */,
        mysql: {
          database: '',
          password: '',
          expose: 5001,
          isPublic: true /** expose port 5001 outside the VPS */,
        },
      },
    },
  ],
});

// Then: `npx svps set domains`
```

To create flexible **Basic Virtual Hosts**, **SVPS** uses **Docker** containers and **Apache2** to proxy their ports to your domains.

> **Apache2**, **Docker** and **Docker Compose** required.  
> You can prepare the environment by enabling `docker` and `apache` steps, then perform `npx svps mount`.
>
> See some practical examples [here](./examples/virtual-hosts/basic/).

---

#### Advanced Usage (manual)

![Everything](https://img.shields.io/badge/Everything-violet)

By using the **Virtual Hosts** to only proxy your services, you can create whatever you want using any language, just by defining the port your service is on.

```js
export default defineConfig({
  access: [
    {
      host: '',
      username: 'root',
      password: '',
    },
  ],
  virtualHosts: [
    {
      domain: 'site.com',
      port: 5000,
      www: true /** crates an alias for "www.site.com" */,
    },
  ],
});

/**
 * Then: `npx svps set domains`
 *
 * It will proxy your service at port 5000 to "site.com" and "www.site.com"
 */
```

> **Apache2** required.  
> You can prepare the environment by enabling `apache` step, then perform `npx svps mount`.

---

## Important

- This package is designed for pre-built VPS _(**Ubuntu** `>=18.04`)_
- The **VPS** user needs to be the **root** or a **super user**
- Don't run this package on a **VPS** that is already in production. If you have your own bash commands, do it at your own risk 🧙🏻

---

### Known Issues

- [**Node.js** `>=18` is not compatible with **Ubuntu** `18.04`](https://github.com/nodesource/distributions/issues/1392)
- I think it isn't possible to use a **Docker** container with **RDP** inside a **VPS** without **RDP**
  - Any help on this is welcome 🚀

---

### Compatibility

![macOS](/.github/assets/readme/macos.svg)
![Linux](/.github/assets/readme/linux.svg)
![Windows](/.github/assets/readme/windows.svg)
![node](/.github/assets/readme/node.svg)
![npm](/.github/assets/readme/npm.svg)

---

### License

[![License](/.github/assets/readme/license.svg)](/LICENSE)

---

## Community

I'm always working to improve **SVPS**. If you've got something interesting to share, feel free to submit a [**Pull Request**](https://github.com/wellwelwel/svps/compare). If you notice something wrong, I'd appreciate if you'd open an [**Issue**](https://github.com/wellwelwel/svps/issues/new).

---

### Contributing

Please check the [_CONTRIBUTING.md_](./CONTRIBUTING.md) for instructions 🚀

---

### Credits

| Contributors | GitHub                                                                            |
| ------------ | --------------------------------------------------------------------------------- |
| Author       | [![wellwelwel](/.github/assets/readme/author.svg)](https://github.com/wellwelwel) |
