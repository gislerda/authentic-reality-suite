// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "toggleScript") {
        // Query for active tabs with LinkedIn URL (you can filter by host_permissions)
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            tabs.forEach(tab => {
                // Optionally, check if the URL includes "linkedin.com"
                if (tab.url && tab.url.includes("linkedin.com")) {
                    chrome.tabs.sendMessage(tab.id, message, (response) => {
                        console.log("Forwarded toggle message to tab", tab.id, response);
                    });
                }
            });
        });
        sendResponse({ status: "Message forwarded" });
        return true; // Keep the message channel open for asynchronous response
    }
});
