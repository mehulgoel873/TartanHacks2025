var server_path = "http://127.0.0.1:5050";

// background.js
chrome.runtime.onInstalled.addListener(async () => {
    console.log("Screen Recorder Extension Installed");
    await createOffscreenDocument();
    console.log("Created offscreen document!");
    chrome.storage.local.set({ toggle: false })
    chrome.alarms.create('status-alarm', {
        delayInMinutes: 0,
        periodInMinutes: 0.1,
    });
    chrome.tabs.create({
        url: "hidden.html"
    })

});

async function createOffscreenDocument() {
    const existingContexts = await chrome.runtime.getContexts({
        contextTypes: ["OFFSCREEN_DOCUMENT"],
    });
    if (existingContexts.length === 0) {
        await chrome.offscreen.createDocument({
            url: "offscreen.html",
            reasons: ["DISPLAY_MEDIA"],
            justification: "Screen recording requires an offscreen document"
        });
    }
}
async function browser_notif_lock_in() {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "lighthouse-128.png", // Replace with the path to your notification icon
        title: "LOCK BACK IN PLEASE",
        message: "LOCK IN LOCK LOCK IN LOCK IN",
        priority: 2
    },
        (notificationId) => {
            console.log("Notification sent with ID:", notificationId);
        });
    chrome.runtime.sendMessage({ audio: "notif" });
}

function browser_notif_yells() {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "lighthouse-128.png", // Replace with the path to your notification icon
        title: "ITS TIME TO LOCK IN!!!",
        message: "LOCK IN LOCK LOCK IN LOCK IN",
        priority: 2
    },
        (notificationId) => {
            console.log("Notification sent with ID:", notificationId);
        });
    chrome.runtime.sendMessage({ audio: "yell" });
}

chrome.action.onClicked.addListener(() => {
    console.log("Creating Offscreen Document")
    chrome.runtime.sendMessage({ action: "start-recording" });
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name == "status-alarm") {
        fetch(server_path + "/status")
            .then(response => response.json())
            .then(data => { console.log("Server Response:", data); callAction(data) })
            .catch(error => console.error("Error fetching data:", error));
    }
});

function callAction(status) {
    console.log("STATUS: " + status)
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
            browser_notif_yells();
            break;
        case 4:
            browser_notif_yells();
            break;
        default:
            break;
    }
}