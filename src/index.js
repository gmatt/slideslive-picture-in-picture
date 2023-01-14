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

    if (location.hostname != "slideslive.com") {
        // The bookmarklet currently doesn't work with embedded SlidesLive for CORS reasons.
        // We open the iframe on a new tab and ask the user to run the bookmarklet there.

        const [slidesLiveIframe] = [
            ...document.getElementsByTagName("iframe"),
        ].filter((e) => e.src.includes("slideslive.com"));

        if (!slidesLiveIframe) {
            alert("Cannot find a SlidesLive video on the current page.");
            return;
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

        return;
    }

    const originalVideo = getVideo();
    // TODO Check if needed.
    originalVideo.crossOrigin = "anonymous";

    // We copy the main video. This is a way to get around CORS limitations.
    const addedVideo = document.createElement("video");
    addedVideo.src = originalVideo.src;
    addedVideo.crossOrigin = "anonymous";
    document.body.appendChild(addedVideo);
    addedVideo.muted = true;
    addedVideo.play();
    addedVideo.width = originalVideo.width;

    const slideImage = getSlideImage();

    const canvas = document.createElement("canvas");
    canvas.width = originalVideo.clientWidth + slideImage.width;
    canvas.height = Math.max(originalVideo.clientHeight, slideImage.height);
    // For retina.
    canvas.width *= window.devicePixelRatio;
    canvas.height *= window.devicePixelRatio;

    document.body.appendChild(canvas);

    const outputVideo = document.createElement("video");
    // TODO Check if needed.
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
        // Sync the timestamp of the original video with the added video.
        if (
            Math.abs(addedVideo.currentTime - originalVideo.currentTime) > 0.5
        ) {
            addedVideo.currentTime = originalVideo.currentTime;
        }

        // var video = document.getElementsByTagName("video")[0];
        // ctx.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);

        ctx.drawImage(
            addedVideo,
            0,
            0,
            originalVideo.clientWidth,
            originalVideo.clientHeight,
        );

        /** @type {HTMLImageElement} */
        // TODO Check if needed.
        const slideImage = getSlideImage();

        ctx.drawImage(
            slideImage,
            originalVideo.clientWidth,
            0,
            slideImage.width,
            slideImage.height,
        );

        // requestAnimationFrame(loop);
        setTimeout(mainLoop);
    };
    // requestAnimationFrame(loop);
    mainLoop();

    // Add 'pip' button.
    const button = document.createElement("button");
    button.textContent = "pip";
    document.body.appendChild(button);
    button.addEventListener("click", async () => {
        if (document.pictureInPictureEnabled) {
            outputVideo.requestPictureInPicture();
        } else {
            // TODO Check if needed for Safari.
            outputVideo.play();
            outputVideo.webkitSetPresentationMode("picture-in-picture");
        }
    });
})();
