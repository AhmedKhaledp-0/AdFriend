chrome.storage.sync.get("enabled", (data) => {
  if (!data.enabled) return;

  console.log("Ad replacement activated");

  const style = document.createElement("style");
  style.textContent = `
    .ad-replacement {
      background-color: #fffbe6;
      border: 2px solid #ffcc00;
      padding: 15px;
      text-align: center;
      font-family: "Georgia", serif;
      color: #333;
      margin: 10px 0;
      min-height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-size: 16px;
      border-radius: 8px;
      box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
    }
    .quote-text {
      font-style: italic;
      font-size: 18px;
      color: #444;
    }
  `;
  document.documentElement.appendChild(style);

  const processedElements = new WeakSet();
  const adSelectors = [
    "ins.adsbygoogle",
    'iframe[src*="doubleclick.net"]',
    '[id^="google_ads_"]',
    '[id^="ad-"]',
    '[class^="ad-"]',
  ].join(",");

  function replaceAd(element) {
    if (processedElements.has(element)) return;

    const replacementDiv = document.createElement("div");
    replacementDiv.className = "ad-replacement";
    replacementDiv.innerHTML =
      '<span class="quote-text">Loading quote...</span>';

    fetch("https://dummyjson.com/quotes")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.quotes && data.quotes.length > 0) {
          const randomQuote =
            data.quotes[Math.floor(Math.random() * data.quotes.length)];
          replacementDiv.innerHTML = `
            <span class="quote-text">"${randomQuote.quote}"</span>
          `;
        } else {
          replacementDiv.innerHTML =
            '<span class="quote-text">No quotes available.</span>';
        }
      })
      .catch(() => {
        replacementDiv.innerHTML =
          '<span class="quote-text">Enjoy an ad-free experience!</span>';
      });

    element.parentNode?.replaceChild(replacementDiv, element);
    processedElements.add(replacementDiv);
  }

  const processAds = () => {
    if (document.hidden) return;

    requestIdleCallback(
      () => {
        document.querySelectorAll(adSelectors).forEach((element) => {
          if (!processedElements.has(element)) {
            replaceAd(element);
          }
        });
      },
      { timeout: 1000 }
    );
  };

  const observer = new MutationObserver((mutations) => {
    if (mutations.some((mutation) => mutation.addedNodes.length > 0)) {
      processAds();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", processAds, {
      passive: true,
    });
  } else {
    processAds();
  }

  window.addEventListener("pagehide", () => observer.disconnect(), {
    passive: true,
  });
});
