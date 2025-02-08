console.log("background running")
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("got message")
    if (message.action === "capture_screen") {
        console.log("capturing screen")
        captureScreen();
    }
});

// Function to initiate screen capture
function captureScreen() {
    chrome.desktopCapture.chooseDesktopMedia(["screen", "window"], null, (streamId) => {
        if (!streamId) {
            console.error("Failed to get screen stream.");
            return;
        }

        navigator.mediaDevices.getUserMedia({
            video: { mandatory: { chromeMediaSource: "desktop", chromeMediaSourceId: streamId } }
        }).then(stream => {
            processVideoStream(stream);
        }).catch(err => {
            console.error("Error capturing screen:", err);
        });
    });
}

// Function to process the video stream and extract an image
function processVideoStream(stream) {
    let video = document.createElement("video");
    video.srcObject = stream;
    video.onloadedmetadata = () => {
        video.play();
        setTimeout(() => {
            let canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            let ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            let imageUrl = canvas.toDataURL("image/png");

            // Stop the stream
            stream.getTracks().forEach(track => track.stop());

            // Process the image (save or modify this function)
            processCapturedImage(imageUrl);
        }, 500);
    };
}

// Function to handle the captured image
function processCapturedImage(imageUrl) {
    console.log("Image captured:", imageUrl);

    // For now, save the image locally
    saveImageLocally(imageUrl);
}

// Function to save the image locally
function saveImageLocally(imageUrl) {
    let link = document.createElement("a");
    link.href = imageUrl;
    link.download = `screenshot_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
