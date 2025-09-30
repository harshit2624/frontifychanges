# Frontend Instructions for Mailercart Plugin

Here are the required changes to connect the frontend to the `Mailercart` abandoned cart plugin.

### Step 1: Create a New File

Create a new file named `apiFetch.js` at the following location:
`packages/twentytwenty-theme/src/apiFetch.js`

Copy and paste the entire content below into this new file:

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

### Step 2: Modify `utils.js`

Open the following file:
`packages/twentytwenty-theme/src/utils.js`

Make the following three changes to this file:

**A. Add this import statement at the top of the file:**

```javascript
import apiFetch from "./apiFetch";
```

**B. Add this new function after the `isUserLoggedIn` function:**

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

**C. Add `pingCartActivity(state);` in two places:**

1.  **Inside the `addToCart` function**, add it after `showToast(`${product.name} added to cart!`, "success");`:

    ```javascript
    // ... inside addToCart()
    showToast(`${product.name} added to cart!`, "success");
    pingCartActivity(state); // <-- ADD THIS LINE

    return true;
    ```

2.  **Inside the `removeCartItem` function**, add it after `showToast("Item removed from cart", 'success');`:

    ```javascript
    // ... inside removeCartItem()
    showToast("Item removed from cart", 'success');
    pingCartActivity(state); // <-- ADD THIS LINE
    return true;
    ```

---

These are all the necessary changes.
