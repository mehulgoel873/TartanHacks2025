chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension Installed!");
    chrome.runtime.onInstalled.addListener(() => {
        chrome.tabs.create({ url: "capture.html" }); // Open an instructional page
    });
});


let port = null;

function connectToNativeApp() {
    port = chrome.runtime.connectNative("com.lighthouse.blockers");

    port.onMessage.addListener((message) => {
        console.log("Received from native app:", message);
    });

    port.onDisconnect.addListener(() => {
        console.error("Disconnected from native app.");
        port = null;
    });
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.status) {
        sendAlertToNative(message.status);
    }
});


// Example: Send an alert signal
function sendAlertToNative(status) {
    if (!port) connectToNativeApp();

    if (port) {
        port.postMessage({ "status": status });
    }
  }