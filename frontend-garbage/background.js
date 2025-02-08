console.log("running background")
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "capture_screen") {
        console.log("capturing screen")
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) {
                console.error("No active tab found.");
                return;
            }
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: captureScreen
            });
        });
    }
});

// Screen capture logic moved to content script context
function captureScreen() {
    console.log("called capture screen")
    chrome.desktopCapture.chooseDesktopMedia(["screen", "window"], null, (streamId) => {
        if (!streamId) {
            console.error("Failed to get screen stream.");
            return;
        }

        navigator.mediaDevices.getUserMedia({
            video: { mandatory: { chromeMediaSource: "desktop", chromeMediaSourceId: streamId } }
        }).then(stream => {
            let track = stream.getVideoTracks()[0];
            let imageCapture = new ImageCapture(track);

            imageCapture.grabFrame().then(bitmap => {
                track.stop(); // Stop the stream after getting a frame
                processCapturedImage(bitmap);
            }).catch(err => {
                console.error("Error capturing screenshot:", err);
            });
        }).catch(err => {
            console.error("Error accessing screen:", err);
        });
    });
}

function processCapturedImage(bitmap) {
    let canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    let imageUrl = canvas.toDataURL("image/png");
    saveImageLocally(imageUrl);
}

function saveImageLocally(imageUrl) {
    let link = document.createElement("a");
    link.href = imageUrl;
    link.download = `screenshot_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
