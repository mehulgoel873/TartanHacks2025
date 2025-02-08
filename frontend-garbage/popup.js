console.log("popup js loaded")
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("capture").addEventListener("click", () => {
      console.log("clicked sending message")
      chrome.runtime.sendMessage({ action: "capture_screen" });
  });
});
