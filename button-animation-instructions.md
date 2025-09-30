# How to Animate the "Add to Cart" Button

This guide explains how to add a glass-like animation to the "Add to Cart" button in your Frontity project.

## 1. Files to Modify

You will need to modify the following file:

*   `packages/twentytwenty-theme/src/components/product-page.js`

## 2. Code Changes

In `product-page.js`, you will need to make the following changes:

### a. Add State for Loading

First, add a new state variable to your component to track the loading state of the button.

```javascript
const [isAddingToCart, setIsAddingToCart] = useState(false);
```

### b. Update the `handleAddToCart` Function

Next, update the `handleAddToCart` function to set the loading state.

```javascript
const handleAddToCart = async () => {
  setIsAddingToCart(true);
  const success = await addToCart(state, product, variantForCart);
  if (success) {
    setAddedToCart(true);
  }
  setIsAddingToCart(false);
};
```

### c. Update the Button JSX

Now, update the "Add to Cart" button to use the new state and apply the glass effect.

```javascript
<button
  className={`product-addtocart-button addBTN ${isAddingToCart ? 'glass-effect' : ''}`}
  onClick={handleAddToCart}
  disabled={product.type === "variable" && !selectedVariation || isAddingToCart}
>
  <span className="button-content">
    {isAddingToCart ? 'Adding...' : 'Add to Cart'}
  </span>
</button>
```

### d. Update the Styled-Component

Finally, update the `AnimatedButton` styled-component to add the glass effect and animations.

```javascript
const AnimatedButton = styled.div`
  .cart-buy-buttons {
    display: flex;
    gap: 12px;
  }

  .product-addtocart-button,
  .product-buynow-button {
    position: relative;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    
    .button-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.3s ease;
    }
    
    .check-icon {
      opacity: 0;
      transform: scale(0) rotate(-180deg);
      transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
    
    &.added-to-cart {
      background: rgba(0, 255, 100, 0.1);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(0, 255, 100, 0.2);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(0, 255, 100, 0.3) inset;
      color: #333;
      animation: glow-success 1.5s infinite alternate;

      .check-icon {
          opacity: 1;
          transform: scale(1) rotate(0deg);
      }

      &:hover {
          background: rgba(0, 255, 100, 0.2);
      }
    }
    
    &:active:not(.added-to-cart) {
      transform: scale(0.98);
    }

    &.glass-effect {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(255, 255, 255, 0.3) inset;
      color: #333;
      animation: glow 1.5s infinite alternate;
    }
  }

  @keyframes glow {
    from {
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(255, 255, 255, 0.3) inset;
    }
    to {
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1), 0 0 10px 4px rgba(0, 150, 255, 0.8) inset;
    }
  }

  @keyframes glow-success {
    from {
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(0, 255, 100, 0.3) inset;
    }
    to {
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1), 0 0 10px 4px rgba(0, 255, 100, 0.8) inset;
    }
  }

  .product-buynow-button {
    background-color: #ff6b35;
    border-color: #ff6b35;
    color: white;
    
    &:hover {
      background-color: #e55a2b;
      border-color: #e55a2b;
    }
    
    &:disabled {
      background-color: #ccc;
      border-color: #ccc;
      cursor: not-allowed;
    }
  }
`;
```

## 3. Explanation of Effects

### Glass Effect

The glass effect is created using the following CSS properties:

*   `background: rgba(255, 255, 255, 0.1);`: A semi-transparent white background.
*   `backdrop-filter: blur(10px);`: This is the key property that creates the "frosted glass" effect by blurring the content behind the button.
*   `border: 1px solid rgba(255, 255, 255, 0.2);`: A subtle border to enhance the glass look.
*   `box-shadow: ...;`: A shadow to give the button some depth.

### Glow Animation

The glow animation is created using a CSS `@keyframes` animation.

*   The `glow` animation is used for the "Add to Cart" button while it's in the loading state. It animates the `box-shadow` to create a pulsating blue glow.
*   The `glow-success` animation is used for the "Go to Cart" button. It animates the `box-shadow` to create a pulsating green glow, indicating that the item was successfully added to the cart.
