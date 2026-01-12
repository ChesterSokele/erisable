// Basic performance monitoring
window.addEventListener('load', function() {
  // Track page load time
  const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
  console.log('Page load time:', loadTime + 'ms');
  
  // Track largest contentful paint
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log('LCP:', lastEntry.startTime + 'ms');
  }).observe({type: 'largest-contentful-paint', buffered: true});
});