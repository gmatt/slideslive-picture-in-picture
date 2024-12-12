// @ts-check

(() => {
    /** @type {() => HTMLVideoElement} */
    const getVideo = () => {
        return document.getElementsByTagName("video")[0];
    };

    /** @type {() => HTMLImageElement | HTMLVideoElement} */
    const getSlideImage = () => {
        let element = document.querySelector(".slp__slidesPlayer__content img");
        if (element instanceof HTMLImageElement) {
            return element;
        }
        element = document.getElementsByTagName("video")[1];
        if (element instanceof HTMLVideoElement) {
            element.width = element.videoWidth;
            element.height = element.videoHeight;
            return element;
        }
        throw Error("Slide image not found.");
    };

    /** @type {() => boolean} */
    const handleNotOnSlidesLive = () => {
        if (location.hostname === "slideslive.com") {
            return false;
        }
        // The bookmarklet currently doesn't work with embedded SlidesLive for CORS reasons.
        // We open the iframe on a new tab and ask the user to run the bookmarklet there.

        const [slidesLiveIframe] = [
            ...document.getElementsByTagName("iframe"),
        ].filter((e) => e.src.includes("slideslive.com"));

        if (!slidesLiveIframe) {
            alert("Cannot find a SlidesLive video on the current page.");
            return true;
        }

        const newWindow = window.open(slidesLiveIframe.src, "_blank");

        // Check if popup was blocked. This should only happen if the script is used in some other ways, not as a bookmarklet.
        if (!newWindow) {
            alert(
                "The popup window seems to be blocked.\nClick the popup icon in the address bar to continue.",
            );
        }

        newWindow &&
            newWindow.alert("Please run the bookmarklet again in this tab.");

        return true;
    };

    /**
     * `setInterval()` gets throttled when the tab is in the background in
     * Safari.
     *
     * This version of `setInterval()` tries to solve this problem, and runs
     * with more accurate timing when in background.
     *
     * @type {(callback: () => void, ms: number) => void}
     */
    const reliableSetInterval = (callback, ms) => {
        const worker = new Worker(
            URL.createObjectURL(
                new Blob([`setInterval(() => self.postMessage(null), ${ms});`]),
            ),
        );
        worker.onmessage = () => callback();
    };

    const shouldExit = handleNotOnSlidesLive();
    if (shouldExit) {
        return;
    }

    const originalVideo = getVideo();
    // TODO Check if needed.
    originalVideo.crossOrigin = "anonymous";

    const slideImage = getSlideImage();

    const canvas = document.createElement("canvas");
    const videoAspectRatio =
        originalVideo.clientWidth / originalVideo.clientHeight;
    canvas.width = slideImage.height * videoAspectRatio + slideImage.width;
    canvas.height = slideImage.height;
    // For retina.
    canvas.width *= window.devicePixelRatio;
    canvas.height *= window.devicePixelRatio;

    // document.body.appendChild(canvas);

    const outputVideo = document.createElement("video");
    outputVideo.width = 640;
    outputVideo.width = 480;
    outputVideo.playsInline = true;
    outputVideo.autoplay = true;
    // videoOutput.muted = true;

    document.body.appendChild(outputVideo);

    outputVideo.srcObject = canvas.captureStream();

    const ctx = canvas.getContext("2d");
    if (!ctx) {
        throw Error("Can't get canvas context.");
    }
    // Set resolution for retina screens.
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const mainLoop = () => {
        var video = getVideo();
        const slideImage = getSlideImage();

        if (canvas.height !== slideImage.height * window.devicePixelRatio) {
            // Resolution changed, resize canvas.
            canvas.width =
                (slideImage.height * videoAspectRatio + slideImage.width) *
                window.devicePixelRatio;
            canvas.height = slideImage.height * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }

        ctx.drawImage(
            video,
            0,
            0,
            slideImage.height * videoAspectRatio,
            slideImage.height,
        );
        slideImage.crossOrigin = "anonymous";
        ctx.drawImage(
            slideImage,
            slideImage.height * videoAspectRatio,
            0,
            slideImage.width,
            slideImage.height,
        );
    };

    // TODO Check if there is a better solution for timing.
    let callbackHandle = originalVideo.requestVideoFrameCallback(mainLoop);
    reliableSetInterval(
        () => {
            originalVideo.cancelVideoFrameCallback(callbackHandle);
            callbackHandle = originalVideo.requestVideoFrameCallback(mainLoop);
        },
        // Just a shot in the dark of a high enough number.
        1000 / 120,
    );
    originalVideo.requestVideoFrameCallback(mainLoop);

    // Add 'pip' button.
    const button = document.createElement("button");
    button.style.color = "black";
    button.style.backgroundColor = "lightgray";
    button.style.padding = "0.2em";
    button.textContent = "pip";
    document.body.appendChild(button);
    button.addEventListener("click", async () => {
        if (document.pictureInPictureEnabled) {
            outputVideo.requestPictureInPicture();
        }
    });

    // Sync play button, clicking 'pause' in the PiP window should pause the main video.
    outputVideo.addEventListener("pause", () => originalVideo.pause());
    outputVideo.addEventListener("play", () => originalVideo.play());
    originalVideo.addEventListener("play", () => outputVideo.play());
})();
