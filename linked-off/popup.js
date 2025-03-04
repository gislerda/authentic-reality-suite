document.addEventListener("DOMContentLoaded", function () {
    const toggleInput = document.getElementById("debunkToggle");
    const toggleStateText = document.getElementById("toggleStateText");
    if (!toggleInput) return;

    // Load the saved state; default to true if not set
    chrome.storage.local.get("debunkToggleState", (result) => {
        let savedState = result.debunkToggleState;
        if (savedState === undefined) {
            savedState = true; // default value
        }
        toggleInput.checked = savedState;
        toggleStateText.textContent = savedState ? "ON" : "OFF";
        toggleStateText.style.color = savedState ? "green" : "red";
    });

    toggleInput.addEventListener("change", async function () {
        const isActive = toggleInput.checked;
        toggleStateText.textContent = isActive ? "ON" : "OFF";
        toggleStateText.style.color = isActive ? "green" : "red";

        // Save the current state
        chrome.storage.local.set({ debunkToggleState: isActive });

        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab || !tab.id) {
            console.error("No active tab found.");
            return;
        }

        chrome.runtime.sendMessage(
            {
                action: "toggleScript",
                active: isActive,
                tabId: tab.id
            },
            (response) => {
                console.log("Toggle response:", response);
            }
        );
    });
});
