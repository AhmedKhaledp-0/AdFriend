// Inject styles more efficiently
const style = document.createElement('style');
style.textContent = `
  .ad-replacement {
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    padding: 10px;
    text-align: center;
    font-family: Arial, sans-serif;
    color: #666;
    margin: 10px 0;
    min-height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
document.documentElement.appendChild(style);

// Cache for processed elements
const processedElements = new WeakSet();

// Debounce function
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
};

// More efficient ad selectors
const adSelectors = [
  'ins.adsbygoogle',
  'iframe[src*="doubleclick.net"]',
  '[id^="google_ads_"]',
  '[id^="ad-"]',
  '[class^="ad-"]'
].join(',');

function replaceAd(element) {
  if (processedElements.has(element)) return;
  
  const replacementDiv = document.createElement('div');
  replacementDiv.className = 'ad-replacement';
  replacementDiv.textContent = 'Ad Removed';
  
  element.parentNode?.replaceChild(replacementDiv, element);
  processedElements.add(replacementDiv);
}

const processAds = () => {
  if (document.hidden) return; // Don't process when page is not visible
  
  requestIdleCallback(() => {
    document.querySelectorAll(adSelectors).forEach(element => {
      if (!processedElements.has(element)) {
        replaceAd(element);
      }
    });
  }, { timeout: 1000 });
};

// Optimized mutation observer
const debouncedProcessAds = debounce(processAds, 100);

const observer = new MutationObserver((mutations) => {
  // Only process if new nodes were added
  if (mutations.some(mutation => mutation.addedNodes.length > 0)) {
    debouncedProcessAds();
  }
});

// Start observing with optimized configuration
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: false,
  characterData: false
});

// Initial scan after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', processAds, { passive: true });
} else {
  processAds();
}

// Clean up on page unload
window.addEventListener('unload', () => {
  observer.disconnect();
}, { passive: true });