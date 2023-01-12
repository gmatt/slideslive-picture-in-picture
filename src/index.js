// @ts-check

var video = document.getElementsByTagName("video")[0];
// video.crossOrigin = "anonymous";
video.crossOrigin = "anonymous";

var video2 = document.createElement("video");
video2.src = video.src;
video2.crossOrigin = "anonymous";
document.body.appendChild(video2);
video2.muted = true;
video2.play();
video2.width = video.width;

/** @type {HTMLImageElement} */
var image = document.querySelector(".slp__slidesPlayer__content img");

var canvas = document.createElement("canvas");
canvas.width = video.clientWidth + image.width;
canvas.height = Math.max(video.clientHeight, image.height);
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

// videoOutput.webkitSetPresentationMode("picture-in-picture");

var loop = () => {
    if (Math.abs(video2.currentTime - video.currentTime) > 0.5) {
        video2.currentTime = video.currentTime;
    }

    // var video = document.getElementsByTagName("video")[0];
    // ctx.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);

    ctx.drawImage(video2, 0, 0, video.clientWidth, video.clientHeight);

    /** @type {HTMLImageElement} */
    var image = document.querySelector(".slp__slidesPlayer__content img");
    ctx.drawImage(image, video.clientWidth, 0, image.width, image.height);

    // ctx.beginPath();
    // ctx.arc(100, 75, 50, 0, 2 * Math.PI);
    // ctx.stroke();

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
        // const endTime = new Date();
        // endTime.setSeconds(endTime.getSeconds() + (minutes.valueAsNumber * 60) + seconds.valueAsNumber);
        // drawCanvasRemainingTime(endTime);
        videoOutput.webkitSetPresentationMode("picture-in-picture");
    }
});
