import React, { useEffect, useState } from "react";
import { connect, styled } from "frontity";
import { getCart, removeCartItem, getWpBaseUrl, consumer_key, consumer_secret } from "../utils";
import Link from "@frontity/components/link";
import Loading from "./loading";

const CartPage = ({ state }) => {
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [error, setError] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [isGlobal, setIsGlobal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Utility to extract numeric price from WooCommerce HTML string
  const extractNumericPrice = (htmlPrice) => {
    if (!htmlPrice) return 0;
    const match = htmlPrice.match(/([\d,]+\.\d{2})/);
    return match ? parseFloat(match[1].replace(/,/g, "")) : 0;
  };

  useEffect(() => {
    fetchCartItems();
    fetchAvailableCoupons();

    const handleCartUpdated = () => fetchCartItems();
    window.addEventListener("cartUpdated", handleCartUpdated);
    return () => window.removeEventListener("cartUpdated", handleCartUpdated);
  }, []);

  useEffect(() => {
    if (cartItems.length && availableCoupons.length) {
      filterApplicableCoupons();
    }
  }, [cartItems, availableCoupons]);

  const fetchCartItems = async () => {
    const token = localStorage.getItem("jwt_token");
    setLoading(true);
    const data = await getCart();
    if (!data || !data.items) {
      setCartItems([]);
      return;
    }
    if (token && token.split(".").length === 3) {
      setCartItems(data.items || []);
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      setCartItems(guestCart);
    }
    setLoading(false);
  };

  const fetchAvailableCoupons = async () => {
    try {
      const res = await fetch(
        `${getWpBaseUrl(state)}/wp-json/wc/v3/coupons`,
        {
          headers: {
            Authorization:
              "Basic " +
              btoa(`${consumer_key}:${consumer_secret}`),
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch coupons");
      const data = await res.json();
      setAvailableCoupons(data);
    } catch (err) {
      console.error("Coupon fetch error:", err);
    }
  };

  const filterApplicableCoupons = () => {
    const productIdsInCart = cartItems.map((item) => parseInt(item.product_id));
    const cartTotal = cartItems.reduce(
      (total, item) =>
        total + extractNumericPrice(item.price) * item.quantity,
      0
    );

    const applicable = availableCoupons.filter((coupon) => {
      const couponProductIds = coupon.product_ids?.map((id) => parseInt(id)) || [];
      const excludedIds = coupon.excluded_product_ids?.map((id) => parseInt(id)) || [];

      const isExcluded = excludedIds.some((excludedId) =>
        productIdsInCart.includes(excludedId)
      );
      if (isExcluded) return false;

      const minAmount = parseFloat(coupon.minimum_amount || "0.00");
      if (cartTotal < minAmount) return false;

      if (couponProductIds.length === 0) return true;

      const matchesProduct = productIdsInCart.some((productId) =>
        couponProductIds.includes(productId)
      );

      return matchesProduct;
    });

    setFilteredCoupons(applicable);
  };

  const handleRemoveItem = async (cartItemKey) => {
    const token = localStorage.getItem("jwt_token");
    const isValidJwt = token && token.split(".").length === 3;

    if (isValidJwt) {
      const success = await removeCartItem(state, cartItemKey);
      if (success) fetchCartItems();
    } else {
      let guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      guestCart = guestCart.filter((item) => item.cart_item_key !== cartItemKey);
      localStorage.setItem("guest_cart", JSON.stringify(guestCart));
      setCartItems(guestCart);
    }
  };

  const handleApplyCoupon = () => {
    setError(null);

    const matchingCoupon = filteredCoupons.find(
      (coupon) => coupon.code.toLowerCase() === couponCode.toLowerCase()
    );

    if (!matchingCoupon) {
      setError("Invalid or inapplicable coupon.");
      setDiscountAmount(0);
      localStorage.removeItem("discountAmount");
      localStorage.removeItem("couponCode");
      return;
    }

    const isGlobal = matchingCoupon.product_ids.length === 0;
    setIsGlobal(isGlobal);
    let discount = 0;

    const updatedItems = cartItems.map((item) => {
      let itemDiscount = 0;
      const price = extractNumericPrice(item.price);

      const isEligible =
        isGlobal || matchingCoupon.product_ids.includes(parseInt(item.product_id));

      if (!isGlobal && isEligible) {
        if (matchingCoupon.discount_type === "fixed_product") {
          itemDiscount = parseFloat(matchingCoupon.amount) * item.quantity;
        } else if (matchingCoupon.discount_type === "percent") {
          itemDiscount = (price * item.quantity * parseFloat(matchingCoupon.amount)) / 100;
        }
        discount += itemDiscount;
      }

      return {
        ...item,
        itemDiscount: isGlobal ? 0 : itemDiscount,
      };
    });

    if (isGlobal) {
      if (matchingCoupon.discount_type === "fixed_product") {
        discount =
          parseFloat(matchingCoupon.amount) *
          cartItems.reduce((sum, item) => sum + item.quantity, 0);
      } else if (matchingCoupon.discount_type === "percent") {
        const subtotal = cartItems.reduce(
          (sum, item) => sum + extractNumericPrice(item.price) * item.quantity,
          0
        );
        discount = (subtotal * parseFloat(matchingCoupon.amount)) / 100;
      }
    }

    setCartItems(updatedItems);
    setDiscountAmount(discount);
    localStorage.setItem("discountAmount", discount.toString());
    localStorage.setItem("couponCode", matchingCoupon.code);
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce(
      (acc, item) => acc + extractNumericPrice(item.price) * item.quantity,
      0
    );
    return subtotal - discountAmount;
  };

  if (loading) return <Loading />;

  return (
    <CartContainer>
      <h2>Cart</h2>
      {cartItems.length === 0 ? (
        <>
          <EmptyMessage>Your cart is empty.</EmptyMessage>
        </>
      ) : (
        <>
          <CartHeader>
            <div>PRODUCT</div>
            <div>TOTAL</div>
          </CartHeader>

          {cartItems.map((item) => (
            <div>
              <CartItem key={item.cart_item_key}>
                <ProductInfo>
                  {item.image && (
                    <ProductImage src={item.image} alt={item.name} />
                  )}
                  <div className="cart-products-display">
                    <strong>{item.name}</strong>

                    <div className="cart-products-price">
                      ₹{extractNumericPrice(item.price)} × {item.quantity}
                    </div>

                    {!isGlobal && item.itemDiscount > 0 && (
                      <div style={{ color: "green", fontWeight: "bold" }}>
                        Coupon applied: -₹{item.itemDiscount.toFixed(2)}
                      </div>
                    )}
                  </div>
                </ProductInfo>
                <TotalPrice>
                  <div>
                    ₹
                    {(extractNumericPrice(item.price) * item.quantity)}
                  </div>
                </TotalPrice>
                <Remove
                  className="remove-items-class"
                  onClick={() => handleRemoveItem(item.cart_item_key)}
                >
                  <svg
                    width="28px"
                    height="28px"
                    viewBox="0 0 512 512"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#ff0000"
                    stroke="#ff0000"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M199 103v50h-78v30h270v-30h-78v-50H199zm18 18h78v32h-78v-32zm-79.002 80l30.106 286h175.794l30.104-286H137.998zm62.338 13.38l.64 8.98 16 224 .643 8.976-17.956 1.283-.64-8.98-16-224-.643-8.976 17.956-1.283zm111.328 0l17.955 1.284-.643 8.977-16 224-.64 8.98-17.956-1.284.643-8.977 16-224 .64-8.98zM247 215h18v242h-18V215z"
                        fill="#ff0000"
                      />
                    </g>
                  </svg>

                </Remove>
              </CartItem>
            </div>
          ))}

          <CouponContainer>
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <ApplyButton onClick={handleApplyCoupon}>Apply Coupon</ApplyButton>
          </CouponContainer>

          {discountAmount > 0 && (
            <DiscountInfo>
              Coupon {couponCode.toUpperCase()} applied. You
              saved ₹{discountAmount.toFixed(2)}!
            </DiscountInfo>
          )}
          {error && <ErrorMessage>{error}</ErrorMessage>}

          {filteredCoupons.length > 0 && (
            <CouponList>
              <h4>Available Coupons:</h4>
              <ul>
                {filteredCoupons.map((coupon) => (
                  <li key={coupon.code} onClick={() => setCouponCode(coupon.code)}>
                    <strong>{coupon.code}</strong> —{" "}
                    {coupon.discount_type === "percent"
                      ? `${coupon.amount}% off`
                      : `₹${coupon.amount} off`}{" "}
                    (Use code: {coupon.code})
                    {coupon.description && (
                      <div className="desc">{coupon.description}</div>
                    )}
                  </li>
                ))}
              </ul>
            </CouponList>
          )}

          <CartTotals>
            <strong>CART TOTALS</strong>
            <div>
              Subtotal: ₹
              {cartItems
                .reduce(
                  (acc, item) =>
                    acc + extractNumericPrice(item.price) * item.quantity,
                  0
                )
                .toFixed(2)}
            </div>
            {discountAmount > 0 && (
              <Discount>Discount: -₹{discountAmount.toFixed(2)}</Discount>
            )}
            <TotalAmount>Total: ₹{calculateTotal().toFixed(2)}</TotalAmount>
            <div className="cartActions">
              <Link className="CheckoutButton" link='/checkout'>Proceed to Checkout</Link>
            </div>
          </CartTotals>
        </>
      )}
    </CartContainer>
  );
};

export default connect(CartPage);

// --- Styled Components ---

const CartContainer = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 1rem;
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #777;
`;

const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  font-weight: bold;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  margin-top: 10px;
`;

const ProductInfo = styled.div`
  display: flex;
  gap: 1rem;
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
`;

const TotalPrice = styled.div`
  font-weight: bold;
  font-size: 1rem;
`;

const Remove = styled.button`
  margin-top: 0.5rem;
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 12px;
`;

const CartTotals = styled.div`
  margin-top: 2rem;
  text-align: right;
`;

const TotalAmount = styled.div`
  font-size: 1.5rem;
  margin-top: 0.5rem;
`;

const CouponContainer = styled.div`
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
`;

const ApplyButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: rgb(20, 24, 27);
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: rgb(60 63 65);
  }
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 0.5rem;
  font-weight: bold;
  font-size: 14px;
`;

const Discount = styled.div`
  color: red;
  margin-top: 0.5rem;
  font-weight: bold;
`;

const CouponList = styled.div`
  margin-top: 1rem;

  ul {
    padding-left: 1rem;
  }

  li {
    cursor: pointer;
    padding: 6px 0;
    border-bottom: 1px dashed #ccc;
  }

  .desc {
    font-size: 0.9rem;
    color: #777;
  }
`;

const DiscountInfo = styled.div`
  margin-top: 0.5rem;
  color: red;
  font-weight: bold;
`;