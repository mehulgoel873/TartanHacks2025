let track;
let imageCapture;

var checkbox = document.querySelector("input[name=checkbox]");

document.addEventListener("DOMContentLoaded", async function () {
    const checkbox = document.querySelector("input[type='checkbox']");

    // Set the checkbox to checked
    console.log(chrome.storage.local.get("toggle"))
    chrome.storage.local.get(['toggle'], function (result) {
        console.log(result.toggle);
        checkbox.checked = result.toggle;
    });

    // Set the checkbox to unchecked
    // checkbox.checked = false;
});

chrome.windows.getCurrent({}, (w) => {
    chrome.windows.update(w.id, { focused: true }, () => {
        checkbox.addEventListener('change', function () {
            if (this.checked) {
                chrome.runtime.sendMessage({ action: "start-capturing" });
                chrome.storage.local.set({ toggle: true })
            } else {
                chrome.runtime.sendMessage({ action: "stop-capturing" });
                chrome.storage.local.set({ toggle: false })
            }
        });
    });
});


function sendUserInput(focus_data, distract_data) {
    const formData = new FormData();
    formData.append("focus", focus_data);
    formData.append("distract", distract_data);

    fetch("http://127.0.0.1:5050/user_data", { // Replace with your API endpoint
        method: "POST",
        body: formData
    })
        .then(response => response.json())
        .then(data => console.log("Submit successful:", data))
        .catch(error => console.error("Error submitting data:", error));
}

document.getElementById("submit").onclick = () => {
    var focus_text = document.getElementById("focus").value;
    var distract_text = document.getElementById("distract").value;
    sendUserInput(focus_text, distract_text);
    console.log("SUBMITTED USER DATA!");
    console.log(focus_text);
    console.log(distract_text);

}
