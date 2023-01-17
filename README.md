<h4 align="center">Next version in progress</h4>
<h2 align="center">SVPS - Auto Mount VPS</h2>
<p align="center">🚀 A simple CLI tool to automate the setup and pre-settings of your Ubuntu VPS</p>

### Install

```shell
   npm i svps
```

<hr />

### Initializing the Environment

```sh
   npx svps || npx svps init
```

-  This will create the default configuration files:

   ```javascript
   ['.svpsrc.js', '.domains.json', '.cronjobs.sh', 'index.html'];
   ```

-  Edit **`.svpsrc.js`** with the **SSH** access and your settings
<hr />

### Mounting VPS

```sh
   npx svps mount
```

#### Setps:

1. Fixes common conflicts on **Ubuntu**
2. Runs common **apt** commands
3. Sets the most common **Firewall** settings
4. Installs **Apache2** and forbids access to the default `html` directory
5. Installs **vsftpd** with users setted in `.svpsrc.js`
6. Prepares the **Virtual Host** and abilite **Rewrite**
7. Installs **PHP** with the version setted in `.svpsrc.js`
8. Installs **Node.js** with the version and global modules setted in `.svpsrc.js`
9. Installs **MySQL** and creates the databases and users setted in `.svpsrc.js`
10.   Adds cronjobs setted on the file specified in `.svpsrc.js`
11.   Reruns common **apt** commands
12.   Executes your personal **sh commands** specified in `.svpsrc.js`
13.   Restart VPS

#### Notes:

-  **All steps are optional:** You can enable or disable any step in `.svpsrc.js`
-  You are free to disable all the steps and create your own module of **sh commands** ˣ‿ˣ
   -  See `APPEND_COMMANDS` in `.svpsrc.js`
-  The entire remote process is displayed on console in real time
-  This may take a long time depending on your VPS plan
<hr />

### Adding Virutal Hosts

```sh
   npx svps set domains
```

-  Gets listed domains in `.domains.json`
-  Sets the **Virtual Host** for each domain and **`www` CNAME**
-  Creates each domain directories with a default `index.(html|php)` setted in `.svpsrc.js`
   -  The domains previously set up or repeated in the list will be ignored

#### For Node.js:

-  The proxy is already auto-configured to route all local ports to 80, then just add the domains with local port in `.domains.json`:

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

   -  Don't repeat local ports!

#### For PHP:

-  Just add the domains in `.domains.json`:

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
-  All automatically generated files are disposable
<hr />

### Important

-  This package is designed for pre-built VPS _(**Ubuntu** `>=18.04`)_
-  The VPS user needs to be the **root** or a **super user**
-  Don't run this package on a VPS that is already in production❗
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
