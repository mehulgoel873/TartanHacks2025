
// Play a sound

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.audio === "notif") {
        const audio = new Audio("audios/notif.mp3"); // Replace with the path to your audio file
        audio.play().catch((error) => {
            console.error("Error playing sound:", error);
        });
        console.log("Got Audio");
    } else if (message.audio === "yell") {
        const audio = new Audio("audios/yell.mp3"); // Replace with the path to your audio file
        audio.play().catch((error) => {
            console.error("Error playing sound:", error);
        });
        console.log("Got Yell");
    }
})