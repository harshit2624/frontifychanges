# Facebook Pixel Event Tracking Setup Instructions

This document provides instructions for setting up Facebook Pixel event tracking in your Frontity application, with event data being stored and displayed in your WordPress admin dashboard.

## 1. WordPress Plugin Setup

A custom plugin is required to store and display the Facebook Pixel events in your WordPress admin.

### Installation

1.  In your WordPress admin dashboard, navigate to **Plugins > Add New**.
2.  Click on **Upload Plugin**.
3.  Upload the `fb-pixel-event-tracker.zip` file.
4.  After installation, click **Activate Plugin**.

### What it Does

This plugin creates a new table in your WordPress database called `wp_fb_pixel_events` to store the tracked events. It also adds a new page in your admin menu called **"FB Pixel Events"** where you can view the tracked events in a list.

## 2. Frontend Setup

The following changes are required in your Frontity theme to track the events.

### Step 1: Add the Tracking API File

Create a new file at `packages/twentytwenty-theme/src/api/track.js` with the following content:

```javascript
import axios from "axios";

const getWpBaseUrl = () => {
    return `https://www.croscrow.com/a`;
};

export const trackFbqEvent = async (eventName, params = {}) => {
  const apiUrl = getWpBaseUrl();
  const endpoint = `${apiUrl}/wp-json/fb-pixel-event-tracker/v1/track`;

  let itemName = null;
  let itemPhoto = null;
  let productId = null;

  if (params && params.contents && params.contents.length > 0) {
    productId = params.contents[0].id;
    itemName = params.contents[0].id; // Fallback to id if name not available
  } else if (params && params.content_name) {
    itemName = params.content_name;
  }

  if (params && params.content_ids && params.content_ids.length > 0) {
    productId = params.content_ids[0];
  }

  if (productId) {
    try {
      const productResponse = await axios.get(`${apiUrl}/wp-json/wc/v3/products/${productId}`);
      const product = productResponse.data;
      if (product) {
        itemName = product.name;
        if (product.images && product.images.length > 0) {
          itemPhoto = product.images[0].src;
        }
      }
    } catch (error) {
      console.error("Error fetching product data for tracking:", error);
    }
  }


  const data = {
    eventName,
    itemName,
    itemPhoto,
  };

  // This is a fire and forget request, so we don't need to handle the response
  axios.post(endpoint, data).catch(err => {
    console.error('Error tracking event', err);
  });
};
```

### Step 2: Wrap the `fbq` Function

In `packages/twentytwenty-theme/src/components/index.js`, import the `trackFbqEvent` function and use a `useEffect` hook to wrap the `window.fbq` function. This will intercept all `fbq` track calls and send the data to your WordPress backend.

```javascript
// packages/twentytwenty-theme/src/components/index.js

// Add this import at the top of the file
import { trackFbqEvent } from "../api/track";

// ... inside the Theme component
const Theme = ({ state, actions }) => {
  // ...

  useEffect(() => {
    if (window.fbq) {
      const originalFbq = window.fbq;
      window.fbq = function(...args) {
        if (args[0] === 'track') {
          trackFbqEvent(args[1], args[2]);
        }
        return originalFbq.apply(this, args);
      };
      Object.assign(window.fbq, originalFbq);
    }
  }, []);

  // ... rest of the component
};
```

## 3. Implementing Pixel Events

With the setup above, all existing `fbq('track', ...)` calls will be automatically tracked. Here are the specific events you requested:

### ViewContent

This event should be fired when a user views a product page.

**File:** `packages/twentytwenty-theme/src/components/product-page.js`

**Implementation:**
The `ViewContent` event is likely already implemented in your `product-page.js` file. The code should look something like this:

```javascript
// Inside a useEffect hook that fetches the product data
if (typeof window !== "undefined" && window.fbq) {
  const price = parseFloat(product.price || product.regular_price || 0);
  window.fbq('track', 'ViewContent', {
    content_ids: [product.id.toString()],
    content_type: 'product',
    currency: 'INR',
    value: price
  });
}
```

### InitiateCheckout

This event should be fired when a user lands on the checkout page.

**File:** `packages/twentytwenty-theme/src/components/checkout-page.js`

**Implementation:**
Add the following code to the `useEffect` hook that runs when the checkout page component mounts:

```javascript
// Inside the initCheckout function in the main useEffect
if (typeof window.fbq === "function") {
  window.fbq("track", "InitiateCheckout");
}
```

### Purchase

This event should be fired on the "Thank You" page after a successful purchase.

**File:** `packages/twentytwenty-theme/src/components/thankyou-page.js`

**Implementation:**
The `Purchase` event is likely already implemented in your `thankyou-page.js` file. The code should look something like this:

```javascript
// Inside a useEffect hook that fetches the order details
if (typeof window !== "undefined" && window.fbq && res.data) {
  const order = res.data;
  const products = order.line_items.map(item => ({
    id: item.product_id,
    quantity: item.quantity,
    price: item.price
  }));

  window.fbq('track', 'Purchase', {
    value: order.total,
    currency: order.currency,
    contents: products,
    content_type: 'product'
  });
}
```
