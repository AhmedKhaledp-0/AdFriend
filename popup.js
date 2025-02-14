document.addEventListener("DOMContentLoaded", () => {
    const toggleSwitch = document.getElementById("toggleSwitch");
  
    // Load saved state
    chrome.storage.sync.get("enabled", (data) => {
      toggleSwitch.checked = !!data.enabled;
    });
  
    toggleSwitch.addEventListener("change", () => {
      if (toggleSwitch.checked) {
        // Enable the extension
        chrome.storage.sync.set({ enabled: true }, () => {
          chrome.scripting.executeScript({
            target: { allFrames: true },
            files: ["content.js"],
          });
        });
      } else {
        // Disable the extension
        chrome.storage.sync.set({ enabled: false }, () => {
          chrome.scripting.executeScript({
            target: { allFrames: true },
            func: () => location.reload(), 
          });
        });
      }
    });
  });
  