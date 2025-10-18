# Advertisement Integration Guide

This guide explains how to integrate real ad networks with Transynk's ad slot system.

## Current Implementation

The current ad system uses placeholder components that can be easily replaced with real ad network integrations.

### Ad Slot Component Location
- File: `src/lib/components/ads/AdSlot.svelte`
- Slots: header, sidebar, footer
- Sizes: small, medium, large

## Google AdSense Integration

### 1. Setup AdSense Account
1. Create a Google AdSense account
2. Add your domain and get approval
3. Create ad units for each slot type

### 2. Add AdSense Script
Add to `src/app.html`:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX" crossorigin="anonymous"></script>
```

### 3. Update AdSlot Component
Replace the `renderDemoAd()` function in `AdSlot.svelte`:

```javascript
function renderDemoAd() {
  if (!adContainer) return;
  
  // AdSense ad unit
  adContainer.innerHTML = `
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-XXXXXXXXXX"
         data-ad-slot="XXXXXXXXXX"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
  `;
  
  // Initialize AdSense
  (window.adsbygoogle = window.adsbygoogle || []).push({});
}
```

### 4. Environment Variables
Add to `.env`:
```
VITE_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXX
VITE_ADSENSE_HEADER_SLOT=XXXXXXXXXX
VITE_ADSENSE_SIDEBAR_SLOT=XXXXXXXXXX
VITE_ADSENSE_FOOTER_SLOT=XXXXXXXXXX
```

## Alternative Ad Networks

### Media.net
```javascript
// Add to app.html
<script src="//contextual.media.net/dmedianet.js?cid=XXXXXXXXXX" async="async"></script>

// In AdSlot component
adContainer.innerHTML = `
  <div id="XXXXXXXXXX">
    <script type="text/javascript">
      try {
        window._mNHandle.queue.push(function (){
          window._mNDetails.loadTag("XXXXXXXXXX", "300x250", "XXXXXXXXXX");
        });
      } catch (error) {}
    </script>
  </div>
`;
```

### PropellerAds
```javascript
// In AdSlot component
adContainer.innerHTML = `
  <script type="text/javascript">
    atOptions = {
      'key' : 'XXXXXXXXXX',
      'format' : 'iframe',
      'height' : 250,
      'width' : 300,
      'params' : {}
    };
    document.write('<scr' + 'ipt type="text/javascript" src="http' + (location.protocol === 'https:' ? 's' : '') + '://www.profitabledisplaynetwork.com/XXXXXXXXXX/invoke.js"></scr' + 'ipt>');
  </script>
`;
```

## Ad Blocker Detection

The current implementation includes basic ad blocker detection. To enhance it:

```javascript
// Add to AdSlot.svelte
function detectAdBlocker() {
  const testAd = document.createElement('div');
  testAd.innerHTML = '&nbsp;';
  testAd.className = 'adsbox';
  testAd.style.position = 'absolute';
  testAd.style.left = '-10000px';
  document.body.appendChild(testAd);
  
  setTimeout(() => {
    const isBlocked = testAd.offsetHeight === 0;
    document.body.removeChild(testAd);
    
    if (isBlocked) {
      showAdBlockerMessage();
    }
  }, 100);
}

function showAdBlockerMessage() {
  adContainer.innerHTML = `
    <div class="ad-blocker-message">
      <p>Please consider disabling your ad blocker to support Transynk</p>
      <a href="/pricing">Or upgrade to Premium</a>
    </div>
  `;
}
```

## Revenue Tracking

The analytics system already tracks ad impressions. To enhance revenue tracking:

1. Use ad network APIs to fetch revenue data
2. Update the analytics endpoints to include revenue metrics
3. Display revenue in the admin dashboard

## Best Practices

1. **Performance**: Load ads asynchronously to avoid blocking page load
2. **User Experience**: Ensure ads don't interfere with core functionality
3. **Privacy**: Respect user privacy and comply with GDPR/CCPA
4. **Mobile**: Optimize ad sizes for mobile devices
5. **Testing**: Test ad loading and fallbacks thoroughly

## Testing

1. Test with ad blockers enabled/disabled
2. Test on different screen sizes
3. Test ad loading failures
4. Test premium user ad hiding
5. Monitor Core Web Vitals impact

## Compliance

- Implement proper consent management for GDPR
- Add privacy policy updates for ad tracking
- Ensure ads comply with platform policies
- Monitor ad content quality