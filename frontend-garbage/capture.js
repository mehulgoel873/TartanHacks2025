let track;
let imageCapture;

chrome.windows.getCurrent({}, (w) => {
  chrome.windows.update(w.id, { focused: true }, () => {
    document.getElementById("capture").onclick = () => {
      const sources = ["screen", "window", "tab"];
      chrome.tabs.getCurrent((tab) => {
        chrome.desktopCapture.chooseDesktopMedia(sources, tab, (streamId) => {
          navigator.mediaDevices
            .getUserMedia({
              video: {
                mandatory: {
                  chromeMediaSource: "desktop",
                  chromeMediaSourceId: streamId,
                },
              },
            })
            .then((stream) => {
              track = stream.getVideoTracks()[0];
              imageCapture = new ImageCapture(track); // Correct capitalization

              chrome.alarms.create("screenshot-alarm", {
                delayInMinutes: 0.0,
                periodInMinutes: 0.1,
              });

            })
            .catch((err) => {
              console.log(err);
            });
        });
      });
    };
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  console.log("Alarm Rang: " + alarm.name);

  if (alarm.name === "screenshot-alarm" && imageCapture) {
    imageCapture.grabFrame()
      .then((bitmap) => {
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

        // Convert canvas to image
        canvas.toBlob((blob) => {
          console.log("Screenshot captured:", blob);
          sendImage(blob);
          // You can now save the image or display it
        }, "image/png");
        url = canvas.toDataURL();
        chrome.downloads.download({
          filename: "screenshot.png",
          url: url,
        }, () => {

          canvas.remove();
        })
      })
      .catch((error) => console.error("Error capturing frame:", error));
  };
});

function sendUserInput(focus_data, distract_data) {
  const formData = new FormData();
  formData.append("focus", focus_data);
  formData.append("distract", distract_data);

  fetch("http://127.0.0.1:5000/user_data", { // Replace with your API endpoint
    method: "POST",
    body: formData
  })
    .then(response => response.json())
    .then(data => console.log("Submit successful:", data))
    .catch(error => console.error("Error submitting data:", error));
}
function sendImage(blob) {
  const formData = new FormData();
  formData.append("screenshot", blob, "screenshot.png");

  fetch("http://127.0.0.1:5000/upload", { // Replace with your API endpoint
    method: "POST",
    body: formData
  })
    .then(response => response.json())
    .then(data => { console.log("Upload successful:", data); fetchServerData() })
    .catch(error => console.error("Error uploading image:", error));
}


// Function to fetch data from the server automatically after each screenshot
function fetchServerData() {
  fetch("http://127.0.0.1:5000/status") // Replace with actual server endpoint
    .then(response => response.json())
    .then(data => {console.log("Server Response:", data); callAction(data)})
    .catch(error => console.error("Error fetching data:", error));
}


function callAction(status) {
  console.log("status!!")
  console.log(status)
}

document.getElementById("stop-capture").onclick = () => {
  console.log("STOPPED CAPTURE!")
  chrome.alarms.clearAll();
}

document.getElementById("submit").onclick = () => {
  focus_text = console.log(document.getElementById("focus").value)
  distract_text = console.log(document.getElementById("distract").value)
  console.log("SUBMITTED USER DATA!")

}

document.getElementById("stop-capture").onclick = () => {
  console.log("STOPPED CAPTURE!")
  chrome.alarms.clearAll();
}