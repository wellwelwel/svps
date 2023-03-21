<h4 align="center">Next version in progress</h4>
<h2 align="center">SVPS - Auto Mount VPS</h2>
<p align="center">🚀 A simple CLI tool to automate the setup and pre-settings of your Ubuntu VPS</p>

## Install

```shell
   npm i svps
```

## Usage

### First Step: Create

```sh
   npx svps || npx svps create
```

-  This will create the default configuration files:

   ```javascript
   ['.svpsrc.js', '.domains.json', '.cronjobs.sh', 'index.html'];
   ```

-  Then, edit [**`.svpsrc.js`**](./resources/local-module/.svpsrc.js) with the **SSH** access and your settings
<hr />

### Second Step: Mount the VPS

```sh
   npx svps mount
```

#### Default Setps:

1. Fixes common conflicts on **Ubuntu**
2. Runs common **apt** commands
3. Sets the most common **Firewall** settings
4. Creates the users setted in [**`.svpsrc.js`**](./resources/local-module/.svpsrc.js)
5. Installs **Apache2** and forbids access to the default `html` directory
6. Prepares the **Virtual Host** and abilite **Rewrite**
7. Installs **PHP** with the version and modules setted in [**`.svpsrc.js`**](./resources/local-module/.svpsrc.js)
8. Installs **Node.js** with the version and global modules setted in [**`.svpsrc.js`**](./resources/local-module/.svpsrc.js)
9. Installs **MySQL** and creates the databases and users setted in [**`.svpsrc.js`**](./resources/local-module/.svpsrc.js)
10.   Adds cronjobs setted on the file specified in [**`.svpsrc.js`**](./resources/local-module/.svpsrc.js)
11.   Reruns common **apt** commands
12.   Executes your personal **sh commands** specified in [**`.svpsrc.js`**](./resources/local-module/.svpsrc.js)
13.   Restart VPS

#### Notes:

-  **All steps are optional:** You can enable or disable any step in [**`.svpsrc.js`**](./resources/local-module/.svpsrc.js#L34)
-  You are free to **disable all the steps** and **create your own modules of sh commands** 🤹🏻‍♀️
   -  See `appendCommands` in [**`.svpsrc.js`**](./resources/local-module/.svpsrc.js)
-  The entire remote process is displayed on console in real time
-  This may take a long time depending on your VPS plan
<hr />

### Turning VPS Server into Desktop (Remote Access)

-  In [**`.svpsrc.js`**](./resources/local-module/.svpsrc.js), set `steps.desktop` to `true`
   -  It's recommended to enable the `repare`, `apt` and `reboot` steps when installing the desktop
   -  It will install **Xubuntu Desktop** and **RDP Remote** in port `3389`
   -  ⚠️ The desktop installation can take longer (about 5 to 30 minutes) and take up more disk space (about 1GB to 3GB)
-  If you are using a **container**, remember to expose the `3389` port first
-  To access, use the **host**, **user** and **password** in your Remote Desktop Software
<hr />

### Testing with a Docker Container

-  Create the container:

   ```sh
   docker run -d --privileged -p 22:22 --restart always wellwelwel/vps:latest
   ```

   -  Add `-p 3389:3389` if you want to test with **Remote Desktop**

-  Set the default access in [**`.svpsrc.js`**](./resources/local-module/.svpsrc.js):

   ```js
   access: [
      {
         host: '127.0.0.1',
         username: 'root',
         password: 'root',
      },
   ],
   ```

-  See more in [https://hub.docker.com/r/wellwelwel/vps](https://hub.docker.com/r/wellwelwel/vps)

<hr />

### Adding Virutal Hosts

<details>
<summary>View examples</summary>

-  ```sh
    npx svps set domains
   ```

-  Gets listed domains in `.domains.json`
-  Sets the **Virtual Host** for each domain and **`www` CNAME**
-  Creates each domain directories with a default `index.(html|php)` setted in [**`.svpsrc.js`**](./resources/local-module/.svpsrc.js)
   -  The domains previously set up or repeated in the list will be ignored
-  It's recommended to enable the `apache` step when using **SVPS Virutal Hosts**

#### For Node.js:

-  The proxy is already auto-configured to route all local ports to 80, then just add the domains with local port in `.domains.json`:
-  It's recommended to enable the `apache` and `node` steps when using **SVPS Virutal Hosts** with **Node.js**

   ```javascript
      [
         ...,
         "mysite.com:3000",
         // 📁 mysite.com/app.js
         // 📁 mysite.com/public_html/index.html

         "mycname.mysite.com:3001",
         // 📁 mycname.mysite.com/app.js
         // 📁 mycname.mysite.com/public_html/index.html

         "myothersite.com:3002",
         // 📁 myothersite.com/app.js
         // 📁 myothersite.com/public_html/index.html
      ]
   ```

   -  Don't repeat local ports❗

#### For PHP and HTML:

-  Just add the domains in `.domains.json`:
-  It's recommended to enable the `apache` and `php` steps when using **SVPS Virutal Hosts** with **PHP**

   ```javascript
      [
         ...,
         "mysite.com",
         // 📁 mysite.com/public_html/index.html

         "mycname.mysite.com",
         // 📁 mycname.mysite.com/public_html/index.html

         "myothersite.com",
         // 📁 myothersite.com/public_html/index.html
      ]
   ```

#### Notes:

-  Both **PHP** and **NodeJS** can work together 👨‍👨‍👧‍👦
-  All automatically generated files by **SVPS Virutal Hosts** are disposable

</details>
<hr />

### Important

-  This package is designed for pre-built VPS _(**Ubuntu** `>=18.04`)_
-  The VPS user needs to be the **root** or a **super user**
-  Don't run this package on a VPS that is already in production❗
<hr />

### Known Issues

-  [`Node.js >=18` is not compatible with the `Ubuntu 18.04`](https://github.com/nodesource/distributions/issues/1392)
<hr />

### Compatibility

![macOS](/.github/assets/readme/macos.svg)
![Linux](/.github/assets/readme/linux.svg)
![Windows](/.github/assets/readme/windows.svg)
![node](/.github/assets/readme/node.svg)
![npm](/.github/assets/readme/npm.svg)

<hr />

### License

[![License](/.github/assets/readme/license.svg)](/LICENSE)

<hr />

### Credits

| Contributors | GitHub                                                                            |
| ------------ | --------------------------------------------------------------------------------- |
| Author       | [![wellwelwel](/.github/assets/readme/author.svg)](https://github.com/wellwelwel) |
