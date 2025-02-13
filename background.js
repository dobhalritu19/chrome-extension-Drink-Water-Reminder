chrome.alarms.create("drinkWaterReminder", {
  delayInMinutes: 60,
  periodInMinutes: 60
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "drinkWaterReminder") {
    chrome.storage.local.get("popupId", (data) => {
      if (data.popupId) {
        // Check if the stored popup ID is still valid
        chrome.windows.get(data.popupId, (window) => {
          if (chrome.runtime.lastError || !window) {
            console.log("Stored popup not found, creating new one.");
            createPopup();
          } else {
            console.log("Popup already exists, focusing it.");
            chrome.windows.update(data.popupId, { focused: true });
          }
        });
      } else {
        console.log("No stored popup, creating new one.");
        createPopup();
      }
    });
  }
});

function createPopup() {
  chrome.system.display.getInfo((displays) => {
    let screenWidth = displays[0].workArea.width;
    let screenHeight = displays[0].workArea.height;

    let popupWidth = 600;
    let popupHeight = 250;

    let left = Math.floor((screenWidth - popupWidth) / 2);
    let top = Math.floor((screenHeight - popupHeight) / 2);

    chrome.windows.create(
      {
        url: "reminder.html",
        type: "popup",
        width: popupWidth,
        height: popupHeight,
        left: left,
        top: top
      },
      (newWindow) => {
        // Store the popup ID to prevent duplicate popups
        chrome.storage.local.set({ popupId: newWindow.id });
      }
    );
  });
}

// Cleanup storage when popup is closed
chrome.windows.onRemoved.addListener((windowId) => {
  chrome.storage.local.get("popupId", (data) => {
    if (data.popupId === windowId) {
      chrome.storage.local.remove("popupId");
    }
  });
});
