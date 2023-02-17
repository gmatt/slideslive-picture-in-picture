# SlidesLive Picture-in-Picture

This bookmarklet enables Picture-in-Picture (PiP) in Safari browser for slideslive.com presentations.

Enabling PiP for a video is not complicated, it works out-of-the-box in Safari, but I wanted to display the slides alongside the video as well.

![](docs/images/demo.gif)

## Usage

:warning: This code is a work in progress!  
Although the main feature works, it has some major unresolved bugs which sometimes make the extension not work.

Click here to access the bookmarklet:

<p align="center">
    <a href="https://gmatt.github.io/slideslive-picture-in-picture/
">https://gmatt.github.io/slideslive-picture-in-picture/</a>
</p>

Open the page above and drag the blue box to the bookmarks bar (enable the bookmarks bar in Safari with View > Show Favorites Bar), or otherwise refer to [this guide](https://mreidsma.github.io/bookmarklets/installing.html).

## Development

-   prerequisites
    -   nodejs
        -   I use package-lock v3, which requires at least npm v7 or equivalently at least node v15.
-   initialize
    -   ```bash
        cd slideslive-picture-in-picture
        npm install
        ```
-   build
    -   ```bash
        npm run build
        ```
    -   The output will be in `dist/index.html`.

### Troubleshooting

-   build
    -   error: `ERR_OSSL_EVP_UNSUPPORTED`
        -   ```bash
            export NODE_OPTIONS=--openssl-legacy-provider
            ```
