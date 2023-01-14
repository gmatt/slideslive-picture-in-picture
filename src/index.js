// @ts-check

/** @type {() => HTMLVideoElement} */
const getVideo = () => {
    return document.getElementsByTagName("video")[0];
};

/** @type {() => HTMLImageElement} */
const getSlideImage = () => {
    const element = document.querySelector(".slp__slidesPlayer__content img");
    if (!(element instanceof HTMLImageElement)) {
        throw Error("Slide image not found.");
    }
    return element;
};

var originalVideo = getVideo();
// TODO Check if needed.
originalVideo.crossOrigin = "anonymous";

// We copy the main video. This is a way to get around CORS limitations.
var addedVideo = document.createElement("video");
addedVideo.src = originalVideo.src;
addedVideo.crossOrigin = "anonymous";
document.body.appendChild(addedVideo);
addedVideo.muted = true;
addedVideo.play();
addedVideo.width = originalVideo.width;

var slideImage = getSlideImage();

var canvas = document.createElement("canvas");
canvas.width = originalVideo.clientWidth + slideImage.width;
canvas.height = Math.max(originalVideo.clientHeight, slideImage.height);
canvas.width *= window.devicePixelRatio;
canvas.height *= window.devicePixelRatio;

document.body.appendChild(canvas);

var videoOutput = document.createElement("video");
videoOutput.width = 640;
videoOutput.width = 480;
videoOutput.playsInline = true;
videoOutput.autoplay = true;
// videoOutput.muted = true;

document.body.appendChild(videoOutput);

videoOutput.srcObject = canvas.captureStream();

var ctx = canvas.getContext("2d");
ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

var loop = () => {
    if (Math.abs(addedVideo.currentTime - originalVideo.currentTime) > 0.5) {
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
    var image = document.querySelector(".slp__slidesPlayer__content img");
    ctx.drawImage(image, originalVideo.clientWidth, 0, image.width, image.height);

    // requestAnimationFrame(loop);
    setTimeout(loop);
};
// requestAnimationFrame(loop);
loop();

button = document.createElement("button");
button.textContent = "pip";
document.body.appendChild(button);
button.addEventListener("click", async function () {
    if (document.pictureInPictureEnabled) {
        videoOutput.requestPictureInPicture();
    } else {
        videvideoOutputo.play();
        videoOutput.webkitSetPresentationMode("picture-in-picture");
    }
});
