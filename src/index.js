// @ts-check

(() => {
    /** @type {() => HTMLVideoElement} */
    const getVideo = () => {
        return document.getElementsByTagName("video")[0];
    };

    /** @type {() => HTMLImageElement} */
    const getSlideImage = () => {
        const element = document.querySelector(
            ".slp__slidesPlayer__content img",
        );
        if (!(element instanceof HTMLImageElement)) {
            throw Error("Slide image not found.");
        }
        return element;
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

    const shouldExit = handleNotOnSlidesLive();
    if (shouldExit) {
        return;
    }

    const originalVideo = getVideo();
    // TODO Check if needed.
    originalVideo.crossOrigin = "anonymous";

    const slideImage = getSlideImage();

    const canvas = document.createElement("canvas");
    canvas.width = originalVideo.clientWidth + slideImage.width;
    canvas.height = Math.max(originalVideo.clientHeight, slideImage.height);
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
        ctx.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
        const slideImage = getSlideImage();
        slideImage.crossOrigin = "anonymous";
        ctx.drawImage(
            slideImage,
            originalVideo.clientWidth,
            0,
            slideImage.width,
            slideImage.height,
        );

        // requestAnimationFrame(mainLoop);
        setTimeout(mainLoop);
    };
    // requestAnimationFrame(mainLoop);
    mainLoop();

    // Add 'pip' button.
    const button = document.createElement("button");
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
