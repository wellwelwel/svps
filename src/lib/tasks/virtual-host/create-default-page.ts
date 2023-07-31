/**
 * Inline HTML Extension: https://marketplace.visualstudio.com/items?itemName=colton.inline-html
 */

interface BasicApp {
  domain: string;
  language: string;
  icon: string;
  colors: {
    main: string;
    secondary: string;
  };
}

export const createDefaultPage = (
  options: BasicApp
) => /*html*/ `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Default Page</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Lunasima&display=swap"
      rel="stylesheet"
    />
    <style>
      * {
        margin: 0;
        padding: 0;
        -webkit-box-sizing: border-box;
           -moz-box-sizing: border-box;
                box-sizing: border-box;
        outline: none;
        -webkit-user-select: none;
           -moz-user-select: none;
            -ms-user-select: none;
                user-select: none;
      }
      :root {
        --main: ${options.colors.main};
        --secondary: ${options.colors.secondary};
        --main-text: #7375af;
        --secondary-text: #404275;
      }
      body {
        display: -webkit-box;
        display: -webkit-flex;
        display: -moz-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -webkit-flex-direction: column;
           -moz-box-orient: vertical;
           -moz-box-direction: normal;
            -ms-flex-direction: column;
                flex-direction: column;
        -webkit-box-align: center;
        -webkit-align-items: center;
           -moz-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        -webkit-box-pack: center;
        -webkit-justify-content: center;
           -moz-box-pack: center;
            -ms-flex-pack: center;
                justify-content: center;
        gap: 15px;
        width: 100%;
        margin: 0;
        min-height: 100vh;
        background-color: #d9d6f2;
        color: #46475b;
        font-family: 'Lunasima', sans-serif;
      }
      body > svg .a {
        fill: var(--main);
      }
      body > svg .b {
        fill: var(--secondary);
      }
      body > svg .c {
        fill: #495771;
      }
      h3 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -moz-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -webkit-flex-direction: column;
           -moz-box-orient: vertical;
           -moz-box-direction: normal;
            -ms-flex-direction: column;
                flex-direction: column;
        -webkit-box-align: center;
        -webkit-align-items: center;
           -moz-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        -webkit-box-pack: center;
        -webkit-justify-content: center;
           -moz-box-pack: center;
            -ms-flex-pack: center;
                justify-content: center;
        gap: 5px;
      }
      h3 span {
        font-size: 12px;
        padding: 5px 10px;
        -webkit-border-radius: 2.5px;
           -moz-border-radius: 2.5px;
                border-radius: 2.5px;
        background-color: #c8c8ff;
      }
      div p {
        width: 100%;
        margin: 5px 0;
        font-size: 13px;
        text-align: center;
        color: var(--main-text);
      }
      div a {
        display: -webkit-box;
        display: -webkit-flex;
        display: -moz-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
           -moz-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        -webkit-box-pack: end;
        -webkit-justify-content: flex-end;
           -moz-box-pack: end;
            -ms-flex-pack: end;
                justify-content: flex-end;
        gap: 10px;
        text-decoration: none;
        color: var(--main-text);
        font-size: 13px;
        -webkit-transition: color 0.25s;
        -o-transition: color 0.25s;
        -moz-transition: color 0.25s;
        transition: color 0.25s;
      }
      div a svg {
        -webkit-transition: color 0.25s;
        -o-transition: color 0.25s;
        -moz-transition: color 0.25s;
        transition: color 0.25s;
      }
      div a:hover {
        color: var(--secondary-text);
      }
    </style>
  </head>
  <body>
    <svg
      width="128"
      height="128"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M73.41,87.7a1,1,0,0,0,1.12,0l6.76-4.56a21,21,0,0,0,9.43-17.33V51.24a0.92,0.92,0,0,0-.61-0.86l-15.78-6a1,1,0,0,0-.72,0l-15.78,6a0.92,0.92,0,0,0-.61.86V65.81a21,21,0,0,0,9.43,17.33Z"
        fill="#fff"
      />
      <polygon
        points="62.97 4.42 62.97 4.59 52.09 20.42 51.97 20.42 30.09 20.42 40.97 4.59 40.97 4.42 62.97 4.42"
        class="a"
      />
      <polygon
        points="51.97 20.59 51.97 42.42 40.97 34.42 29.97 42.42 29.97 20.59 30.09 20.42 51.97 20.42 51.97 20.59"
        class="b"
      />
      <path
        d="M79,40.09a1,1,0,0,1-1-1V20.42a1,1,0,1,1,2,0V39.09A1,1,0,0,1,79,40.09Z"
        class="c"
      />
      <path
        d="M59,85.42H5a3,3,0,0,1-3-3v-62H4v62a1,1,0,0,0,1,1H59v2Z"
        class="c"
      />
      <path
        d="M90,43.42H88V7.91L79.82,21a1,1,0,0,1-.85.47H3a1,1,0,0,1-.82-1.57l11-16A1,1,0,0,1,14,3.42H89a1,1,0,0,1,1,1v39Zm-85.1-24H78.42l8.75-14H14.5Z"
        class="c"
      />
      <path
        d="M74,96.58a2,2,0,0,1-1.13-.34l-9.51-6.48a31.33,31.33,0,0,1-5.4-4.65,29.83,29.83,0,0,1-8-20.26V46.92a1.91,1.91,0,0,1,1.25-1.79l22.09-8.42a2,2,0,0,1,1.44,0l22.08,8.42A1.91,1.91,0,0,1,98,46.92V64.84A30.27,30.27,0,0,1,84.61,89.75L75.1,96.23A2,2,0,0,1,74,96.58Zm0-58L51.88,47l0,17.85a27.83,27.83,0,0,0,7.48,18.9h0a29.31,29.31,0,0,0,5.06,4.35L74,94.58l9.52-6.48A28.27,28.27,0,0,0,96,64.84V46.92l-7.42-2.77Z"
        class="c"
      />
      <polygon
        points="73.3 73.67 65.76 66.29 67.16 64.86 73.16 70.73 82.19 59.97 83.73 61.26 73.3 73.67"
        class="c"
      />
      <rect width="100" height="100" fill="none" />
    </svg>
    <h3>
      Build your ${options.language} app ${options.icon}
      <span>
        /var/www/domains/${options.domain}/
      </span>
    </h3>
    <div>
      <p>
        <strong>See more in</strong>
      </p>
      <a
        target="_blank"
        href="https://github.com/wellwelwel/svps#virtual-hosts-domains-forwarding"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
          />
        </svg>
        github.com/wellwelwel/svps
      </a>
    </div>
  </body>
</html>
`;
