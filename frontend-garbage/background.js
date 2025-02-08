chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension Installed!");
    chrome.runtime.onInstalled.addListener(() => {
        chrome.tabs.create({ url: "capture.html" }); // Open an instructional page
    });
});