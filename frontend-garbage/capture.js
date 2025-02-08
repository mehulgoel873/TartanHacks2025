let track;
let imageCapture;

// var server_path = "http://voltron.lan.cmu.edu:5000";
var server_path = "http://127.0.0.1:5050";


var checkbox = document.querySelector("input[name=checkbox]");

chrome.windows.getCurrent({}, (w) => {
  chrome.windows.update(w.id, { focused: true }, () => {
    checkbox.addEventListener('change', function () {
      if (this.checked) {
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
                  periodInMinutes: 1,
                });

              })
              .catch((err) => {
                console.log(err);
              });
          });
        });
      } else {
        console.log("STOPPED CAPTURE!")
        chrome.alarms.clearAll();
      }
    });
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

  fetch(server_path + "/user_data", { // Replace with your API endpoint
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


function browser_notif() {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icon.png", // Replace with the path to your notification icon
    title: "LOCK BACK IN COME ON",
    message: "LOCK IN LOCK LOCK IN LOCK IN",
    priority: 2}, 
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
      browser_notif();
      break;
    case 1:
      browser_notif();
      break;
    case 2:
      browser_notif();
      break;
    case 3:
      browser_notif();
      break;
    case 4:
      break;
    default:

  }
}

document.getElementById("submit").onclick = () => {
  var focus_text = document.getElementById("focus").value;
  var distract_text = document.getElementById("distract").value;
  sendUserInput(focus_text, distract_text);
  console.log("SUBMITTED USER DATA!");
  console.log(focus_text);
  console.log(distract_text);
}