document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("setTimeBtn").addEventListener("click", function () {
        const reminderTime = parseInt(document.getElementById("reminderTime").value, 10);

        if (isNaN(reminderTime) || reminderTime < 1) {
            alert("Please enter a valid time in minutes.");
            return;
        }

        // Cancel the existing alarm (if any)
        chrome.alarms.clear("drinkWaterReminder", () => {
            // Set a new alarm with the user-specified time
            chrome.alarms.create("drinkWaterReminder", {
                delayInMinutes: reminderTime,
                periodInMinutes: reminderTime
            });

            alert(`Reminder set to every ${reminderTime} minute(s).`);
            window.close();
        });
    });

    // Close button functionality
    document.getElementById("closeBtn").addEventListener("click", function () {
        window.close();
    });
});
