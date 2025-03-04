(() => {
    console.log("LinkedOFF script injected!");

    function addToggleToPost(postElement) {
        // Find the actor container (post header)
        const postHeader = postElement.querySelector('.update-components-actor__container');
        if (!postHeader) return;

        // Create a container for the image toggle
        const toggleContainer = document.createElement('div');
        toggleContainer.style.marginLeft = 'auto';
        toggleContainer.style.cursor = 'pointer';

        // Create the image element for the toggle
        const toggleImg = document.createElement('img');
        // Default state: LinkedIN.png
        toggleImg.src = chrome.runtime.getURL("LinkedIN.png");
        toggleImg.style.width = '105px';  // Adjust size as needed

        // Add a small border, margin, and rounded edges
        toggleImg.style.border = "2px solid #ccc";
        toggleImg.style.borderRadius = "8px";
        toggleImg.style.margin = "5px";

        toggleContainer.appendChild(toggleImg);
        postHeader.appendChild(toggleContainer);

        // Locate the post text and store the original text
        const textElement = postElement.querySelector('.feed-shared-text, .update-components-text');
        if (textElement && !textElement.dataset.originalText) {
            textElement.dataset.originalText = textElement.innerText;
        }

        // Extract and deduplicate the poster's name
        const nameElement = postElement.querySelector('.update-components-actor__title span[dir="ltr"]');
        let posterName = nameElement ? nameElement.innerText.trim() : 'Unknown';
        const parts = posterName.split('\n').map(s => s.trim()).filter(Boolean);
        if (parts.length === 2 && parts[0] === parts[1]) {
            posterName = parts[0];
        } else {
            posterName = parts.join(" ");
        }

        // Click event: immediately swap image and trigger Cloud Function call
        toggleImg.addEventListener('click', async function () {
            if (this.src.indexOf("LinkedIN.png") !== -1) {
                // Switch to LinkedOFF state and call rewriting function
                this.src = chrome.runtime.getURL("LinkedOFF.png");
                if (textElement && textElement.dataset.originalText) {
                    const placeholders = [
                        "Turning off the fluff",
                        "Buzzword detox in progress",
                        "Cutting the corporate speak",
                        "Simplifying your feed",
                        "No-nonsense version loading",
                        "De-buzzing your post",
                        "Trimming the fat",
                        "Going straight to the point",
                        "Buzzword-free zone incoming",
                        "Out with the jargon",
                        "Keeping it real"
                    ];
                    let index = Math.floor(Math.random() * placeholders.length);
                    textElement.innerText = placeholders[index] + "...";
                    const placeholderInterval = setInterval(() => {
                        index = (index + 1) % placeholders.length;
                        textElement.innerText = placeholders[index] + "...";
                    }, 2000);

                    try {
                        const response = await fetch("https://rewrite-debunk-in-114019104121.europe-west4.run.app", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                text: textElement.dataset.originalText,
                                mode: "real",
                                name: posterName
                            })
                        });
                        if (!response.ok) throw new Error("Network response was not ok");
                        const data = await response.json();
                        clearInterval(placeholderInterval);

                        const originalText = textElement.dataset.originalText;
                        const rewrittenText = data.rewritten_text || "Error rewriting text";

                        // Calculate word counts
                        const originalWords = originalText.trim().split(/\s+/);
                        const rewrittenWords = rewrittenText.trim().split(/\s+/);
                        const originalWordCount = originalWords.length;
                        const rewrittenWordCount = rewrittenWords.length;

                        // Compute percentage reduction
                        const reductionPercentage = ((originalWordCount - rewrittenWordCount) / originalWordCount * 100).toFixed(0);

                        // Assume an average reading speed of ~3.33 words/sec (200 wpm)
                        const timeOriginal = originalWordCount / 3.33;
                        const timeRewritten = rewrittenWordCount / 3.33;
                        const timeSaved = (timeOriginal - timeRewritten).toFixed(0);
                        const madeWith = placeholders[index];
                        // Compose a hyped buzzwordy LinkedIn-style message (one line with emojis)
                        const buzzMessage = `<br><br>🚀 Supercharged post: <br>✅ trimmed ${reductionPercentage}% 💨 fluff <br>✅ saved ${timeSaved} sec ⏳ <br> ${madeWith} with <a href="https://www.linkedin.com/company/linkedoff-just-switch-off-the-buzzwords/about/" target="_blank" style="color: inherit; text-decoration: underline;">LinkedOFF</a> by <a href="https://atomic-apps.dev" target="_blank" style="color: inherit; text-decoration: underline;">Atomic Apps</a>`;
                        //textElement.innerHTML = rewrittenText + buzzMessage;



                        // Append the buzz message in one line after the rewritten text
                        textElement.innerHTML = rewrittenText + "\n" + buzzMessage;
                    } catch (error) {
                        clearInterval(placeholderInterval);
                        textElement.innerText = textElement.dataset.originalText;
                        console.error("Error rewriting text:", error);
                    }
                }
            } else {
                // Switch back to LinkedIN state and revert text
                this.src = chrome.runtime.getURL("LinkedIN.png");
                if (textElement && textElement.dataset.originalText) {
                    textElement.innerText = textElement.dataset.originalText;
                }
            }
        });
    }

    // Inject toggles into all existing posts
    function injectToggleButtons() {
        const posts = document.querySelectorAll('.feed-shared-update-v2');
        posts.forEach(post => {
            if (!post.dataset.toggleInjected) {
                addToggleToPost(post);
                post.dataset.toggleInjected = "true";
            }
        });
    }

    // Remove all injected toggle UIs and clear markers
    function removeToggleButtons() {
        document.querySelectorAll('img').forEach(el => el.remove());
        document.querySelectorAll('.feed-shared-update-v2').forEach(post => {
            delete post.dataset.toggleInjected;
        });
    }

    chrome.storage.local.get("debunkToggleState", (result) => {
        let state = result.debunkToggleState;
        if (state === undefined) state = true;
        state ? injectToggleButtons() : removeToggleButtons();
    });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "toggleScript") {
            if (message.active) {
                injectToggleButtons();
                sendResponse({ status: "UI injected" });
            } else {
                removeToggleButtons();
                sendResponse({ status: "UI removed" });
            }
        }
    });

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    chrome.storage.local.get("debunkToggleState", (result) => {
                        let state = result.debunkToggleState;
                        if (state === undefined) state = true;
                        if (state) {
                            if (node.matches('.feed-shared-update-v2')) {
                                if (!node.dataset.toggleInjected) {
                                    addToggleToPost(node);
                                    node.dataset.toggleInjected = "true";
                                }
                            } else {
                                const posts = node.querySelectorAll('.feed-shared-update-v2');
                                posts.forEach(post => {
                                    if (!post.dataset.toggleInjected) {
                                        addToggleToPost(post);
                                        post.dataset.toggleInjected = "true";
                                    }
                                });
                            }
                        }
                    });
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
