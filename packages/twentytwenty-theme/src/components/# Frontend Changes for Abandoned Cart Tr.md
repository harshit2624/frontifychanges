# Frontend Changes for Abandoned Cart Tracking

## Summary of Changes

To enable the abandoned cart tracking, we implemented a "ping" system. Whenever a logged-in user modifies their cart, the frontend now sends a notification to your WordPress backend. This allows the backend `Mailercart` plugin to track when the user was last active.

Here are the specific file changes:

### 1. New File: `apiFetch.js`

A new helper file needs to be created to standardize API requests to your backend.

*   **File Path:** `packages/twentytwenty-theme/src/apiFetch.js`
*   **Purpose:** This file contains a function that automatically includes the user's authentication token and necessary headers for all requests, making API calls cleaner and more secure.

**`apiFetch.js` Content:**
```javascript
import { fetch } from "frontity";

const apiFetch = (url, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = typeof window !== 'undefined' ? localStorage.getItem("jwt_token") : null;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    credentials: "include",
    headers,
  });
};

export default apiFetch;
```

### 2. Modified File: `utils.js`

This is the core file where the changes need to be implemented.

*   **File Path:** `packages/twentytwenty-theme/src/utils.js`

**Instructions:**

1.  **Import `apiFetch`:** Add the following import statement at the top of the file:

    ```javascript
    import apiFetch from "./apiFetch";
    ```

2.  **Add the `pingCartActivity` Function:** Add this new function to the file. It is responsible for sending the "ping" to the `Mailercart` plugin on your backend.

    ```javascript
    export const pingCartActivity = async (state) => {
      const token = localStorage.getItem("jwt_token");
      if (!token) return;

      try {
        await apiFetch(`${getWpBaseUrl(state)}/wp-json/mailercart/v1/activity`, {
          method: 'POST',
        });
      } catch (error) {
        console.error('Error pinging cart activity:', error);
      }
    };
    ```

3.  **Update `addToCart` and `removeCartItem`:** The `pingCartActivity(state)` function needs to be called within these two functions after a successful cart modification.

    *   In the `addToCart` function, add `pingCartActivity(state);` after the `fireAddToCartPixel();` call.
    *   In the `removeCartItem` function, add `pingCartActivity(state);` after the `showToast("Item removed from cart", 'success');` call.

These are all the changes required for the frontend to communicate with the `Mailercart` plugin.
