// offscreen.js
let captureInterval;

var server_path = "http://127.0.0.1:5050";

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "start-capturing") {
        startCapturing();
    } else if (message.action === "stop-capturing") {
        console.log("STOPPED CAPTURING")
        stopCapturing();
    }
});

async function startCapturing() {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const track = stream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(track);

    captureInterval = setInterval(async () => {
        const bitmap = await imageCapture.grabFrame();
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(bitmap, 0, 0);
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            chrome.runtime.sendMessage({ action: "image-captured", url });
            sendImage(blob);
        }, "image/png");
        url = canvas.toDataURL();
        console.log(url);
    }, 10000); // Capture every 5 seconds
}

function sendImage(blob) {
    const formData = new FormData();
    formData.append("screenshot", blob, "screenshot.png");

    fetch(server_path + "/upload", { // Replace with your API endpoint
        method: "POST",
        body: formData
    })
        .then(response => response.json())
        .then(data => { console.log("Upload successful:", data) })
        .catch(error => console.error("Error uploading image:", error));
}

function stopCapturing() {
    clearInterval(captureInterval);
}
