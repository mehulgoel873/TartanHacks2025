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
    }, 5000); // Capture every 5 seconds
}

function sendImage(blob) {
    const formData = new FormData();
    formData.append("screenshot", blob, "screenshot.png");

    fetch(server_path + "/upload", { // Replace with your API endpoint
        method: "POST",
        body: formData
    })
        .then(response => response.json())
        .then(data => { console.log("Upload successful:", data); fetchServerData() })
        .catch(error => console.error("Error uploading image:", error));
}

// Function to fetch data from the server automatically after each screenshot
function fetchServerData() {
    fetch(server_path + "/status") // Replace with actual server endpoint
        .then(response => response.json())
        .then(data => { console.log("Server Response:", data); callAction(data) })
        .catch(error => console.error("Error fetching data:", error));
}

function browser_notif_lock_in() {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png", // Replace with the path to your notification icon
        title: "LOCK BACK IN PLEASE",
        message: "LOCK IN LOCK LOCK IN LOCK IN",
        priority: 2
    },
        (notificationId) => {
            console.log("Notification sent with ID:", notificationId);
        });
    // Play a sound
    const audio = new Audio("TartanHacks2025/frontend-garbage/audios/lock-in-audio.mp3"); // Replace with the path to your audio file
    audio.play().catch((error) => {
        console.error("Error playing sound:", error);
    });
}

function browser_notif_yells() {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png", // Replace with the path to your notification icon
        title: "ITS TIME TO LOCK IN!!!",
        message: "LOCK IN LOCK LOCK IN LOCK IN",
        priority: 2
    },
        (notificationId) => {
            console.log("Notification sent with ID:", notificationId);
        });
    // Play a sound
    const audio = new Audio("../audios/mixkit-wrong-answer-fail-notification-946.mp3"); // Replace with the path to your audio file
    audio.play().catch((error) => {
        console.error("Error playing sound:", error);
    });
}

function callAction(status) {
    switch (status) {
        case 0:
            break;
        case 1:
            browser_notif_lock_in();
            break;
        case 2:
            browser_notif_lock_in();
            break;
        case 3:
            browser_notif_lock_in();
            break;
        case 4:
            browser_notif_yells();
            break;
        default:
            break;
    }
}

function browser_notif_yells() {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png", // Replace with the path to your notification icon
        title: "ITS TIME TO LOCK IN!!!",
        message: "LOCK IN LOCK LOCK IN LOCK IN",
        priority: 2
    },
        (notificationId) => {
            console.log("Notification sent with ID:", notificationId);
        });
    // Play a sound
    const audio = new Audio("../audios/time_to_lock_in.mp3.mov"); // Replace with the path to your audio file
    audio.play().catch((error) => {
        console.error("Error playing sound:", error);
    });
}

function stopCapturing() {
    clearInterval(captureInterval);
}
