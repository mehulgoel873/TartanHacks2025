// background.js
chrome.runtime.onInstalled.addListener(async () => {
    console.log("Screen Recorder Extension Installed");
    await createOffscreenDocument();
    console.log("Created offscreen document!");
    chrome.storage.local.set({ toggle: false })
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

chrome.action.onClicked.addListener(() => {
    console.log("Creating Offscreen Document")
    chrome.runtime.sendMessage({ action: "start-recording" });
});