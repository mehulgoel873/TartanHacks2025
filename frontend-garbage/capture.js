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

document.getElementById("stop-capture").onclick = () => {
  console.log("STOPPED CAPTURE!")
  chrome.alarms.clearAll();
}