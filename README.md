# SlidesLive Picture-in-Picture

This bookmarklet enables Picture-in-Picture (PiP) in Safari for SlidesLive presentations. Enabling PiP for a video is not complicated; many scripts and extensions already do that, but I wanted to display the slides alongside the video as well.

![](docs/images/demo.gif)

## Troubleshooting

-   build
    -   error: `ERR_OSSL_EVP_UNSUPPORTED`
        -   ```bash
            export NODE_OPTIONS=--openssl-legacy-provider
            ```
