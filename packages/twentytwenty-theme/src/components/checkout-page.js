import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { connect } from "frontity";
import { showToast, getWpBaseUrl, getCart, removeFromCart } from "../utils";
import FlashScreen from "./FlashScreen";

const apiUrl = "https://www.croscrow.com/a/wp-json";

const CheckoutPage = ({ state, actions }) => {
  const [cart, setCart] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [paymentGateways, setPaymentGateways] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [billingStates, setBillingStates] = useState([]);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [customerId, setCustomerId] = useState(null);
  const emailRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const addressRef = useRef(null);
  const cityRef = useRef(null);
  const shippingMethodRef = useRef(null);
  const paymentMethodRef = useRef(null);
  const [allAddresses, setAllAddresses] = useState([]);
  const [selectedSavedAddress, setSelectedSavedAddress] = useState('');
  const [saveCurrentAddress, setSaveCurrentAddress] = useState(false);
  const [addressNickname, setAddressNickname] = useState('');
  const [loadingAddresses, setLoadingAddresses] = useState(false); 
  const phoneRef = useRef(null);
  const address2Ref = useRef(null);
  const postcodeRef = useRef(null);
  const countryRef = useRef(null);
  const stateRef = useRef(null);

  // For billing address (when useSameAddress is false)
  const billingFirstNameRef = useRef(null);
  const billingLastNameRef = useRef(null);
  const billingAddressRef = useRef(null);
  const billingAddress2Ref = useRef(null);
  const billingCityRef = useRef(null);
  const billingPostcodeRef = useRef(null);
  const billingCountryRef = useRef(null);
  const billingStateRef = useRef(null);
  const billingPhoneRef = useRef(null);

  const handleCheckboxChange = (e) => {
    setUseSameAddress(e.target.checked);
  };

  // Track form data
  const [form, setForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "",
    postcode: "",
    country: "IN",
    phone: "",
    shipping_method: "",
    payment_method: "",

    // billing address fields
    billing_first_name: "",
    billing_last_name: "",
    billing_address_1: "",
    billing_address_2: "",
    billing_city: "",
    billing_state: "",
    billing_postcode: "",
    billing_country: "IN",
    billing_state: "",
    billing_phone: "",
  });

  // Track validation errors for each field
  const [errors, setErrors] = useState({});
  const [showFlashScreen, setShowFlashScreen] = useState(false);

  useEffect(() => {
    const initCheckout = async () => {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        setShowFlashScreen(true);
        return;
      }
      if (typeof window.fbq === "function") {
        window.fbq("track", "InitiateCheckout");
      }
      fetchCart();
      fetchCountries();
      fetchPaymentGateways();
      fetchCustomerAddresses();

      // 3. Load discount from localStorage
      const discount = localStorage.getItem("discountAmount");
      const code = localStorage.getItem("couponCode");

      if (discount) {
        setDiscountAmount(parseFloat(discount));
      }
      if (code) {
        setCouponCode(code);
      }

      // 4. Fetch customer data
      if (token) {
        try {
          // Step 1: Get WP user info
          const wpRes = await fetch(`${apiUrl}/wp/v2/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const wpUser = await wpRes.json();

          if (wpUser && wpUser.id) {
            const userId = wpUser.id;

            // Step 2: Get WooCommerce customer data
            const customerRes = await fetch(`${apiUrl}/wc/v3/customers/${userId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

            const customer = await customerRes.json();

            if (!customer.message) {
              setForm((prevForm) => ({
                ...prevForm,
                email: customer.email || "",
                first_name: customer.first_name || "",
                last_name: customer.last_name || "",
                address_1: customer.shipping?.address_1 || "",
                address_2: customer.shipping?.address_2 || "",
                city: customer.shipping?.city || "",
                state: customer.shipping?.state || "",
                postcode: customer.shipping?.postcode || "",
                country: customer.shipping?.country || "IN",
                phone: customer.billing?.phone || "",

                billing_first_name: customer.billing?.first_name || "",
                billing_last_name: customer.billing?.last_name || "",
                billing_address_1: customer.billing?.address_1 || "",
                billing_address_2: customer.billing?.address_2 || "",
                billing_city: customer.billing?.city || "",
                billing_state: customer.billing?.state || "",
                billing_postcode: customer.billing?.postcode || "",
                billing_country: customer.billing?.country || "IN",
                billing_phone: customer.billing?.phone || "",
              }));
            } else {
              console.error("WooCommerce customer fetch error:", customer.message);
            }
          }
        } catch (error) {
          console.error("Error fetching user/customer data:", error);
        }
      }
    };

    initCheckout();
  }, [actions.router]);

  // Leave this separate - only runs when form.country changes
  useEffect(() => {
    if (form.country) {
      fetchShippingMethodsForCountry(form.country);
    }
  }, [form.country]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const getLoggedInCustomerId = async () => {
    const token = localStorage.getItem("jwt_token");
    if (!token) return null;

    try {
      const wpUserRes = await fetch(`${apiUrl}/wp/v2/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const wpUser = await wpUserRes.json();

      if (wpUser && wpUser.id) {
        return wpUser.id;
      }

      return null;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  };

  const fetchProductDetails = async (productId) => {
    try {
      const res = await axios.get(`${apiUrl}/wc/v3/products/${productId}`, {
        auth: {
          username: "ck_2732dde9479fa4adf07d8c7269ae22f39f2c74a5",
          password: "cs_14996e7e8eed396bced4ac30a0acfd9fea836214",
        },
      });
      return res.data;
    } catch (err) {
      console.error("Product fetch error:", err);
      return null;
    }
  };

  const fetchCustomerAddresses = async () => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      console.log('No token found, skipping address fetch');
      return;
    }

    setLoadingAddresses(true);

    try {
      const response = await fetch(`${apiUrl}/theme/v1/customer-addresses`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const addresses = await response.json();
        console.log('Fetched customer addresses:', addresses);
        setAllAddresses(addresses || []);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch addresses:', errorData);

        if (response.status === 404) {
          // Endpoint doesn't exist yet - normal for first time setup
          setAllAddresses([]);
        }
      }
    } catch (error) {
      console.error("Error fetching customer addresses:", error);
      setAllAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  };

  // 4. Delete additional address (cannot delete default WooCommerce addresses)
  const deleteAdditionalAddress = async (addressId) => {
    const token = localStorage.getItem("jwt_token");
    if (!token) return;

    // Check if it's a default address
    if (addressId === 'default_shipping' || addressId === 'default_billing') {
      showToast("Cannot delete default addresses. Edit them in your account settings.", 'warn');
      return;
    }

    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/theme/v1/customer-addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setAllAddresses(result.all_addresses || []);
          showToast("Address deleted successfully!", 'success');

          // Clear selection if deleted address was selected
          if (selectedSavedAddress === addressId) {
            setSelectedSavedAddress('');
          }
        }
      } else {
        const errorData = await response.json();
        console.error('Delete address error:', errorData);
        showToast(errorData.message || "Failed to delete address", 'error');
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      showToast("Failed to delete address", 'error');
    }
  };

  // 5. Handle using saved address
  const handleUseSavedAddress = (addressId) => {
    setSelectedSavedAddress(addressId);

    if (addressId === '') {
      // Reset form if "Select Address" is chosen
      return;
    }

    const address = allAddresses.find(addr => addr.id === addressId);
    if (address) {
      setForm(prev => ({
        ...prev,
        first_name: address.first_name || '',
        last_name: address.last_name || '',
        address_1: address.address_1 || '',
        address_2: address.address_2 || '',
        city: address.city || '',
        state: address.state || '',
        postcode: address.postcode || '',
        country: address.country || 'IN',
        phone: address.phone || '',
      }));

      // Update states based on selected country
      if (address.country) {
        const selectedCountry = countries.find((c) => c.code === address.country);
        setStates(selectedCountry?.states || []);
        fetchShippingMethodsForCountry(address.country);
      }

      // Clear any validation errors
      setErrors({});

      showToast(`Applied ${address.nickname}`, 'success');
    }
  };

  const fetchCart = async () => {
    const token = localStorage.getItem("jwt_token");

    try {
      const data = await getCart();
      console.log(data, 'cart data from checkout');

      const items = data.items || [];
      setCart(items);

      if (token && items.length === 0) {
        showToast("Pick your product first!", 'warn');
        return;
      }

      // Fetch product details for each cart item
      const details = {};
      await Promise.all(
        items.map(async (item) => {
          const product = await fetchProductDetails(item.product_id); // Use product_id instead of id
          if (product) details[item.product_id] = product;
        })
      );
      setProductDetails(details);

    } catch (err) {
      console.error("Cart fetch error:", err);
      actions.router.set("/");
    }
  };

  const fetchCountries = async () => {
    try {
      const res = await axios.get(`${apiUrl}/wc/v3/data/countries`, {
        auth: {
          username: "ck_2732dde9479fa4adf07d8c7269ae22f39f2c74a5",
          password: "cs_14996e7e8eed396bced4ac30a0acfd9fea836214",
        },
      });

      const countryArray = Object.entries(res.data).map(([code, data]) => ({
        code,
        name: data.name,
        states: data.states,
      }));

      setCountries(countryArray);

      // Set states for default country
      const defaultCountry = countryArray.find((c) => c.code === form.country);
      setStates(defaultCountry?.states || []);
    } catch (err) {
      console.error("Country fetch error:", err);
    }
  };

  const fetchShippingMethodsForCountry = async (countryCode) => {
    try {
      console.log("Starting fetchShippingMethodsForCountry with countryCode:", countryCode);

      if (typeof countryCode !== 'string' || !countryCode) {
        setShippingMethods([]); // Clear or handle empty state
        return;
      }

      // Get all zones
      const zonesRes = await axios.get(`${apiUrl}/wc/v3/shipping/zones`, {
        auth: {
          username: "ck_2732dde9479fa4adf07d8c7269ae22f39f2c74a5",
          password: "cs_14996e7e8eed396bced4ac30a0acfd9fea836214",
        },
      });

      // Default zone ID = 0 (rest of world)
      let zoneId = 0;

      for (const zone of zonesRes.data) {

        const locationsRes = await axios.get(`${apiUrl}/wc/v3/shipping/zones/${zone.id}/locations`, {
          auth: {
            username: "ck_2732dde9479fa4adf07d8c7269ae22f39f2c74a5",
            password: "cs_14996e7e8eed396bced4ac30a0acfd9fea836214",
          },
        });

        const matched = locationsRes.data.some((loc) => {
          if (typeof loc.code !== 'string') return false;
          return loc.code.toLowerCase() === countryCode.toLowerCase();
        });

        if (matched) {
          zoneId = zone.id;
          break;
        } else {
          console.log(`No match found in zone ${zone.id}`);
        }
      }

      // Fetch shipping methods for matched zone
      const methodsRes = await axios.get(`${apiUrl}/wc/v3/shipping/zones/${zoneId}/methods`, {
        auth: {
          username: "ck_2732dde9479fa4adf07d8c7269ae22f39f2c74a5",
          password: "cs_14996e7e8eed396bced4ac30a0acfd9fea836214",
        },
      });

      setShippingMethods(methodsRes.data);
    } catch (err) {
      console.error("Shipping methods fetch error:", err);
      setShippingMethods([]); // Clear or fallback on error
    }
  };

  const fetchPaymentGateways = async () => {
    try {
      const res = await axios.get(`${apiUrl}/wc/v3/payment_gateways`, {
        auth: {
          username: "ck_2732dde9479fa4adf07d8c7269ae22f39f2c74a5",
          password: "cs_14996e7e8eed396bced4ac30a0acfd9fea836214",
        },
      });
      setPaymentGateways(res.data.filter((pg) => pg.enabled));
    } catch (err) {
      console.error("Payment method fetch error:", err);
    }
  };

  // Update form state & clear error on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field as user types
    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "country") {
      const selectedCountry = countries.find((c) => c.code === value);
      setStates(selectedCountry?.states || []);
      setForm((prev) => ({ ...prev, state: "" }));

      // Fetch shipping methods for selected country
      fetchShippingMethodsForCountry(value);
    }

    if (name === "billing_country") {
      const selectedCountry = countries.find((c) => c.code === value);
      setBillingStates(selectedCountry?.states || []);
      setForm((prev) => ({ ...prev, billing_state: "" })); // reset billing state
    }
  };


  // Validate all required fields and email format
  const validateForm = () => {
    const newErrors = {};
    let firstInvalidField = null;

    // Email validation
    if (!form.email) {
      newErrors.email = "Email address is required";
      if (!firstInvalidField) firstInvalidField = emailRef;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
      if (!firstInvalidField) firstInvalidField = emailRef;
    }

    // Shipping address validation
    if (!form.first_name || form.first_name.trim().length < 2) {
      newErrors.first_name = "First name must be at least 2 characters";
      if (!firstInvalidField) firstInvalidField = firstNameRef;
    }

    if (!form.last_name || form.last_name.trim().length < 2) {
      newErrors.last_name = "Last name must be at least 2 characters";
      if (!firstInvalidField) firstInvalidField = lastNameRef;
    }

    if (!form.address_1 || form.address_1.trim().length < 5) {
      newErrors.address_1 = "Address must be at least 5 characters";
      if (!firstInvalidField) firstInvalidField = addressRef;
    }

    if (!form.city || form.city.trim().length < 2) {
      newErrors.city = "City name must be at least 2 characters";
      if (!firstInvalidField) firstInvalidField = cityRef;
    }

    if (!form.postcode || !/^\d{6}$/.test(form.postcode)) {
      newErrors.postcode = "Please enter a valid 6-digit PIN code";
      if (!firstInvalidField) firstInvalidField = postcodeRef;
    }

    if (!form.country) {
      newErrors.country = "Please select a country";
      if (!firstInvalidField) firstInvalidField = countryRef;
    }

    if (!form.state) {
      newErrors.state = "Please select a state";
      if (!firstInvalidField) firstInvalidField = stateRef;
    }

    if (!form.phone || !/^\+?[\d\s\-\(\)]{10,15}$/.test(form.phone)) {
      newErrors.phone = "Please enter a valid phone number";
      if (!firstInvalidField) firstInvalidField = phoneRef;
    }

    if (!useSameAddress) {
      if (!form.billing_first_name || form.billing_first_name.trim().length < 2) {
        newErrors.billing_first_name = "Billing first name must be at least 2 characters";
        if (!firstInvalidField) firstInvalidField = billingFirstNameRef;
      }

      if (!form.billing_last_name || form.billing_last_name.trim().length < 2) {
        newErrors.billing_last_name = "Billing last name must be at least 2 characters";
        if (!firstInvalidField) firstInvalidField = billingLastNameRef;
      }

      if (!form.billing_address_1 || form.billing_address_1.trim().length < 5) {
        newErrors.billing_address_1 = "Billing address must be at least 5 characters";
        if (!firstInvalidField) firstInvalidField = billingAddressRef;
      }

      if (!form.billing_city || form.billing_city.trim().length < 2) {
        newErrors.billing_city = "Billing city name must be at least 2 characters";
        if (!firstInvalidField) firstInvalidField = billingCityRef;
      }

      if (!form.billing_postcode || !/^\d{6}$/.test(form.billing_postcode)) {
        newErrors.billing_postcode = "Please enter a valid 6-digit PIN code";
        if (!firstInvalidField) firstInvalidField = billingPostcodeRef;
      }

      if (!form.billing_country) {
        newErrors.billing_country = "Please select billing country";
        if (!firstInvalidField) firstInvalidField = billingCountryRef;
      }

      if (!form.billing_state) {
        newErrors.billing_state = "Please select billing state";
        if (!firstInvalidField) firstInvalidField = billingStateRef;
      }

      if (form.billing_phone && !/^\+?[\d\s\-\(\)]{10,15}$/.test(form.billing_phone)) {
        newErrors.billing_phone = "Please enter a valid billing phone number";
        if (!firstInvalidField) firstInvalidField = billingPhoneRef;
      }
    }

    // Shipping method validation
    if (!form.shipping_method) {
      newErrors.shipping_method = "Please select a shipping method";
      if (!firstInvalidField) firstInvalidField = shippingMethodRef;
    }

    // Payment method validation
    if (!form.payment_method) {
      newErrors.payment_method = "Please select a payment method";
      if (!firstInvalidField) firstInvalidField = paymentMethodRef;
    }

    // Address nickname validation (if saving address)
    if (saveCurrentAddress && (!addressNickname || !addressNickname.trim())) {
      newErrors.addressNickname = "Please enter a nickname for this address";
    }

    setErrors(newErrors);

    // Scroll to first invalid field
    if (firstInvalidField?.current) {
      firstInvalidField.current.scrollIntoView({ behavior: "smooth", block: "center" });
      firstInvalidField.current.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // block submit if validation errors
    }

    placeOrder();
  };
  const placeOrder = async () => {
    try {
      const customerId = await getLoggedInCustomerId();
  
      const orderData = {
        ...(customerId && { customer_id: customerId }),
        payment_method: form.payment_method,
        payment_method_title: form.payment_method,
        set_paid: false,
        billing: {
          email: form.email,
          first_name: form.first_name,
          last_name: form.last_name,
          address_1: form.address_1,
          address_2: form.address_2,
          city: form.city,
          state: form.state,
          postcode: form.postcode,
          country: form.country,
          phone: form.phone,
        },
        shipping: {
          first_name: form.first_name,
          last_name: form.last_name,
          address_1: form.address_1,
          address_2: form.address_2,
          city: form.city,
          state: form.state,
          postcode: form.postcode,
          country: form.country,
        },
        line_items: cart.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        shipping_lines: [
          {
            method_id: form.shipping_method,
            method_title: form.shipping_method,
            total: shippingCost.toFixed(2),
          },
        ],
        fee_lines: discountAmount > 0
          ? [
            {
              name: `Discount: ${couponCode || 'Coupon'}`,
              total: (-discountAmount).toFixed(2),
            },
          ]
          : [],
      };
  
      // Step 1: Create WooCommerce order
      const res = await axios.post(`${apiUrl}/wc/v3/orders`, orderData, {
        auth: {
          username: "ck_2732dde9479fa4adf07d8c7269ae22f39f2c74a5",
          password: "cs_14996e7e8eed396bced4ac30a0acfd9fea836214",
        },
      });
  
      const wcOrderId = res.data.id;
  
      // Step 2: Send order confirmation email
      const sendOrderEmail = async () => {
        try {
          await axios.post(`${apiUrl}/wc/v3/send-order-email`, {
            order_id: wcOrderId,
            customer_email: form.email,
            customer_name: `${form.first_name} ${form.last_name}`
          }, {
            auth: {
              username: "ck_2732dde9479fa4adf07d8c7269ae22f39f2c74a5",
              password: "cs_14996e7e8eed396bced4ac30a0acfd9fea836214",
            },
          });
          console.log('Order confirmation email sent successfully');
        } catch (emailError) {
          console.error('Failed to send order email:', emailError);
          // Don't block the order flow if email fails
        }
      };
  
      if (form.payment_method === "razorpay") {
        // Step 3: Call backend to create Razorpay order
        const razorRes = await axios.post(`${apiUrl}/razorpay/v1/create-order`, {
          order_id: wcOrderId,
        });
  
        // Step 4: Open Razorpay popup
        const options = {
          key: razorRes.data.key,
          amount: razorRes.data.amount,
          currency: razorRes.data.currency,
          name: "My Shop",
          description: `Order #${wcOrderId}`,
          order_id: razorRes.data.order_id,
          handler: async function (response) {
            try {
              // Step 5: Verify payment on backend
              await axios.post(`${apiUrl}/razorpay/v1/verify`, {
                order_id: wcOrderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              });
  
              // Send email after successful payment
              await sendOrderEmail();
  
              await removeFromCart(state);
              actions.router.set(`/thank-you?order_id=${wcOrderId}`);
            } catch (err) {
              console.error("Verification error:", err);
              showToast("Payment verification failed.", "error");
            }
          },
          prefill: {
            name: `${form.first_name} ${form.last_name}`,
            email: form.email,
            contact: form.phone,
          },
          theme: { color: "#3399cc" },
        };
  
        const rzp = new window.Razorpay(options);
        rzp.open();
  
      } else {
        // COD, Bank Transfer, etc. - send email immediately
        await sendOrderEmail();
        await removeFromCart(state);
        actions.router.set(`/thank-you?order_id=${wcOrderId}`);
      }
    } catch (err) {
      console.error("Order error:", err.response?.data || err.message);
      showToast("Failed to place order.", "error");
    }
  };

  const cartTotal = cart.reduce((total, item) => {
    // Extract number from HTML string
    const priceString = item.price?.match(/[\d,]+\.\d+/)?.[0]?.replace(',', '') || '0';
    const price = parseFloat(priceString);
    const quantity = item.quantity || 1;

    return total + price * quantity;
  }, 0);

  const shippingCost = (() => {
    const selectedMethod = shippingMethods.find(
      (method) => method.method_id === form.shipping_method
    );
    return selectedMethod?.settings?.cost?.value
      ? parseFloat(selectedMethod.settings.cost.value)
      : 0;
  })();

  const grandTotal = cartTotal + shippingCost - discountAmount;

  return (
    <div
      className="checkout-page"
      style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}
    >
      {showFlashScreen && (
        <FlashScreen
          isVisible={showFlashScreen}
          onClose={() => {
            setShowFlashScreen(false);
            actions.router.set("/my-account?back=checkout");
          }}
          onLoginClick={() => {
            setShowFlashScreen(false);
            actions.router.set("/my-account?back=checkout");
          }}
        />
      )}
      <h2 className="checkoutHeading">Checkout</h2>
      <ul className="checkoutImage" style={{ listStyle: "none", padding: 0, gap: "5px" }}>
        {cart.map((item) => {
          const product = productDetails[item.product_id]; // Use product_id instead of id
          const imageSrc = product?.images?.[0]?.src || "";
          const size = product?.attributes[0]?.option || null;

          return (
            <li
              key={item.cart_item_key} // Use cart_item_key instead of key
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}
            >
              {imageSrc && (
                <img
                  src={imageSrc}
                  alt={product?.name || item.name}
                  style={{
                    width: 50,
                    height: 50,
                    objectFit: "contain",
                    marginRight: 10,
                  }}
                />
              )}
              <div>
                {size && <span>{size}</span>}
              </div>
            </li>
          );
        })}
      </ul>

      {allAddresses.length > 0 && (
        <div className="saved-addresses-section" style={{
          margin: '1rem 0',
          padding: '1rem',
          border: '1px solid #ddd',
          borderRadius: '4px',
          backgroundColor: '#f9f9f9'
        }}>
          <h3>Use Saved Address</h3>
          {loadingAddresses ? (
            <p>Loading addresses...</p>
          ) : (
            <>
              <div className="custom-select">
                <select
                  value={selectedSavedAddress}
                  onChange={(e) => handleUseSavedAddress(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem' }}
                >
                  <option value="">Select a saved address</option>
                  {allAddresses.map((address) => (
                    <option key={address.id} value={address.id}>
                      {address.nickname} - {address.address_1}, {address.city}
                      {address.is_default ? ' (Default)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Address management */}
              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ fontSize: '16px', marginBlock: '20px' }}>Saved Addresses:</h4>
                {allAddresses.map((address) => (
                  <div key={address.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    border: '1px solid #eee',
                    borderRadius: '4px',
                    margin: '0.5rem 0',
                    backgroundColor: address.is_default ? '#e8f4fd' : '#fff'
                  }}>
                    <div>
                      <strong style={{ fontSize: '14px' }}>{address.nickname}</strong>
                      {address.is_default && <span style={{ color: '#0073aa', fontSize: '0.8rem' }}> (Default)</span>}
                      <br />
                      <small>{address.first_name} {address.last_name} - {address.address_1}, {address.city}</small>
                    </div>
                    {!address.is_default && (
                      <button
                        type="button"
                        onClick={() => deleteAdditionalAddress(address.id)}
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        Delete
                      </button>
                    )}
                    {address.is_default && (
                      <small style={{ color: '#666', fontStyle: 'italic' }}>
                        Edit in Account Settings
                      </small>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
      <form onSubmit={handleSubmit} noValidate>
        <h3 className="contact-info">Contact Information</h3>
        <input
          ref={emailRef}
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />
        {errors.email && (
          <div className="email-class" style={{ color: "red", fontSize: "12px", marginTop: "0.25rem" }}>
            {errors.email}
          </div>
        )}

        <h3 className="shipping-address">Shipping Address</h3>
        <p className="shipping-msg">Enter the address where you want your order delivered.</p>
        <div className="shipping-address-form">
          <h3 className="shipping-address">Personal Details</h3>
          <div className="checkoutInputs">
            <div className="error fields">
              <input
                ref={firstNameRef}
                name="first_name"
                placeholder="First name"
                value={form.first_name}
                onChange={handleChange}
                required
              />
              {errors.first_name && (
                <div className="first-name" style={{ color: "red", fontSize: "12px", marginTop: "0.25rem" }}>
                  {errors.first_name}
                </div>
              )}
            </div>
            <div className="error fields">
              <input
                ref={lastNameRef}
                name="last_name"
                placeholder="Last name"
                value={form.last_name}
                onChange={handleChange}
                required
              />
              {errors.last_name && (
                <div className="last-name" style={{ color: "red", fontSize: "12px", marginTop: "0.25rem" }}>
                  {errors.last_name}
                </div>
              )}
            </div>
          </div>

          <input
            ref={phoneRef}
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
          />
          {errors.phone && (
            <div style={{ color: "red", fontSize: "12px", marginTop: "0.25rem" }}>
              {errors.phone}
            </div>
          )}

          <h3 className="shipping-address">Address Details</h3>

          <input
            ref={addressRef}
            name="address_1"
            placeholder="Address"
            value={form.address_1}
            onChange={handleChange}
            required
          />
          {errors.address_1 && (
            <div className="address-one" style={{ color: "red", fontSize: "12px", marginTop: "0.25rem" }}>
              {errors.address_1}
            </div>
          )}

          <div className="checkoutInputs">
            <input
              name="address_2"
              placeholder="Apartment, suite, etc."
              value={form.address_2}
              onChange={handleChange}
            />
            <input
              ref={cityRef}
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              required
            />
          </div>
          {errors.city && (
            <div className="address-two" style={{ color: "red", fontSize: "12px", marginTop: "0.25rem" }}>
              {errors.city}
            </div>
          )}

          <input
            ref={postcodeRef}
            name="postcode"
            placeholder="PIN Code"
            value={form.postcode}
            onChange={handleChange}
            required
          />
          {errors.postcode && (
            <div style={{ color: "red", fontSize: "12px", marginTop: "0.25rem" }}>
              {errors.postcode}
            </div>
          )}
          <div className="custom-select-section">
            <div class="custom-select">
              <select
                ref={countryRef}
                name="country"
                value={form.country}
                onChange={handleChange}
                required
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
              {errors.country && (
                <div style={{ color: "red", fontSize: "12px", marginTop: "0.25rem" }}>
                  {errors.country}
                </div>
              )}
            </div>
            <div class="custom-select">
              <select
                ref={stateRef}
                name="state"
                value={form.state}
                onChange={handleChange}
                required
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </select>
              {errors.state && (
                <div style={{ color: "red", fontSize: "12px", marginTop: "0.25rem" }}>
                  {errors.state}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Save Current Address Section */}
        <div className="save-address-section" style={{
          margin: '1rem 0',
          padding: '1rem',
          border: '1px solid #ddd',
          borderRadius: '4px',
          backgroundColor: '#f0f8ff'
        }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={saveCurrentAddress}
              onChange={(e) => setSaveCurrentAddress(e.target.checked)}
            />
            Save this address for future use
          </label>

          {saveCurrentAddress && (
            <div style={{ marginTop: '0.5rem' }}>
              <input
                type="text"
                placeholder="Address nickname (e.g., Home, Office, Work)"
                value={addressNickname}
                onChange={(e) => setAddressNickname(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
                required={saveCurrentAddress}
              />
              {errors.addressNickname && (
                <div style={{ color: 'red', fontSize: '1.5rem', marginTop: '4px' }}>
                  {errors.addressNickname}
                </div>
              )}
              <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
                Note: This will be saved as an additional address. Your default shipping/billing addresses are managed separately in your account settings.
              </div>
            </div>
          )}
        </div>

        <div className="sameAddress">
          <label>
            <input
              type="checkbox"
              checked={useSameAddress}
              onChange={handleCheckboxChange}
            />{" "}
            Use same address for billing
          </label>
        </div>
        {!useSameAddress && (
          <>
            <h3>Billing Address</h3>
            <p>Enter the billing address that matches your payment method.</p>

            <div className="shipping-address-form">
              <div className="checkoutInputs">
                <input
                  ref={billingFirstNameRef}
                  name="billing_first_name"
                  placeholder="First name"
                  value={form.billing_first_name}
                  onChange={handleChange}
                  required={!useSameAddress}
                />
                {errors.billing_first_name && (
                  <div style={{ color: "red", fontSize: "12px", marginTop: "0.25rem" }}>
                    {errors.billing_first_name}
                  </div>
                )}

                <input
                  ref={billingLastNameRef}
                  name="billing_last_name"
                  placeholder="Last name"
                  value={form.billing_last_name}
                  onChange={handleChange}
                  required={!useSameAddress}
                />
                {errors.billing_last_name && (
                  <div style={{ color: "red", fontSize: "12px", marginTop: "0.25rem" }}>
                    {errors.billing_last_name}
                  </div>
                )}
              </div>

              <input
                ref={billingAddressRef}
                name="billing_address_1"
                placeholder="Address"
                value={form.billing_address_1}
                onChange={handleChange}
                required={!useSameAddress}
              />
              {errors.billing_address_1 && (
                <div style={{ color: "red", fontSize: "12px", marginTop: "0.25rem" }}>
                  {errors.billing_address_1}
                </div>
              )}

              <input
                ref={billingAddress2Ref}
                name="billing_address_2"
                placeholder="Apartment, suite, etc."
                value={form.billing_address_2}
                onChange={handleChange}
              />

              <input
                ref={billingCityRef}
                name="billing_city"
                placeholder="City"
                value={form.billing_city}
                onChange={handleChange}
                required={!useSameAddress}
              />
              {errors.billing_city && (
                <div style={{ color: "red", fontSize: "12px", marginTop: "0.25rem" }}>
                  {errors.billing_city}
                </div>
              )}

              <input
                ref={billingPostcodeRef}
                name="billing_postcode"
                placeholder="PIN Code"
                value={form.billing_postcode}
                onChange={handleChange}
                required={!useSameAddress}
              />
              {errors.billing_postcode && (
                <div style={{ color: "red", fontSize: "12px", marginTop: "0.25rem" }}>
                  {errors.billing_postcode}
                </div>
              )}

              <div className="custom-select-section">
                <div className="custom-select">
                  <select
                    ref={billingCountryRef}
                    name="billing_country"
                    value={form.billing_country}
                    onChange={handleChange}
                    required={!useSameAddress}
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {errors.billing_country && (
                    <div style={{ color: "red", fontSize: "12px", marginTop: "0.25rem" }}>
                      {errors.billing_country}
                    </div>
                  )}
                </div>

                <div className="custom-select">
                  <select
                    ref={billingStateRef}
                    name="billing_state"
                    value={form.billing_state}
                    onChange={handleChange}
                    required={!useSameAddress}
                  >
                    <option value="">Select State</option>
                    {billingStates.map((state) => (
                      <option key={state.code} value={state.code}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  {errors.billing_state && (
                    <div style={{ color: "red", fontSize: "12px", marginTop: "0.25rem" }}>
                      {errors.billing_state}
                    </div>
                  )}
                </div>
              </div>

              <input
                ref={billingPhoneRef}
                name="billing_phone"
                placeholder="Billing Phone"
                value={form.billing_phone}
                onChange={handleChange}
              />
              {errors.billing_phone && (
                <div style={{ color: "red", fontSize: "12px", marginTop: "0.25rem" }}>
                  {errors.billing_phone}
                </div>
              )}
            </div>
          </>
        )}
        <h3 className="shipping-options">Shipping Options</h3>
        {shippingMethods.length > 0 ? (
          <div className="shipping-methods">
            {shippingMethods.map((method) => (
              <div className="shippingMethods" key={method.id} style={{ marginBottom: "0.5rem" }}>
                <label>
                  <input
                    ref={method.method_id === form.shipping_method ? shippingMethodRef : null}
                    type="radio"
                    name="shipping_method"
                    value={method.method_id}
                    checked={form.shipping_method === method.method_id}
                    onChange={handleChange}
                    required
                  />{" "}
                    <strong>{method.title}</strong> 
                  {/* {method.title} — {method.settings?.cost?.value
                    ? `₹${method.settings.cost.value}`
                    : "Free"} */}
                </label>
              </div>
            ))}
            {errors.shipping_method && (
              <div style={{ color: "red", fontSize: "12px", marginTop: "0.25rem" }}>
                {errors.shipping_method}
              </div>
            )}
          </div>
        ) : (
          <p>No shipping methods available.</p>
        )}

        <h3 className="payment-options">Payment Options</h3>
        {paymentGateways.length === 0 && <p>Loading payment methods...</p>}

        {paymentGateways.map((gateway) => (
          <div className="payment-gateways" key={gateway.id} style={{ marginBottom: "1rem" }}>
            <label>
              <input
                type="radio"
                name="payment_method"
                value={gateway.id}
                checked={form.payment_method === gateway.id}
                onChange={handleChange}
                required
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <strong>{gateway.title}</strong>
                {gateway.description && (
                  <p style={{ paddingLeft: '0', fontSize: "0.9rem", color: "#555" }}>
                    {gateway.description}
                  </p>
                )}
              </div>
            </label>
          </div>
        ))}
        {errors.payment_method && (
          <div style={{ color: "red", fontSize: "12px", marginTop: "0.25rem" }}>
            {errors.payment_method}
          </div>
        )}


        <h3 className="order-summary">Order Summary</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {/* Cart Total Display */}
          <li
            style={{
              display: "flex",
              justifyContent: "end",
              marginTop: "1rem",
              fontWeight: "bold",
              borderTop: "1px solid #000",
              paddingTop: "0.5rem",
              gap: "10px"
            }}
          >
            <span className="checkout-subtotal">Subtotal</span>
            <span className="checkout-carttotal">₹{cartTotal.toFixed(2)}</span>
          </li>

          {/* Display Delivery Shipping Charges */}
          {form.shipping_method && (
            <li
              style={{
                display: "flex",
                justifyContent: "end",
                marginTop: "1rem",
                fontWeight: "bold",
                borderTop: "1px solid #ccc",
                paddingTop: "0.5rem",
                gap: "10px"
              }}
            >
              <span>
                Shipping
                <small style={{ fontWeight: "normal", fontStyle: "italic" }}>
                  (
                  {(() => {
                    const selectedMethod = shippingMethods.find(
                      (method) => method.method_id === form.shipping_method
                    );
                    return selectedMethod?.title || "N/A";
                  })()}
                  )
                </small>
              </span>
              <span>
                ₹
                {(() => {
                  const selectedMethod = shippingMethods.find(
                    (method) => method.method_id === form.shipping_method
                  );
                  return selectedMethod?.settings?.cost?.value
                    ? parseFloat(selectedMethod.settings.cost.value).toFixed(2)
                    : "0.00";
                })()}
              </span>
            </li>
          )}

          {/* Discount Display */}
          <li
            style={{
              display: "flex",
              justifyContent: "end",
              fontWeight: "bold",
              borderTop: "1px solid #000",
              gap: "10px"
            }}
          >
            {discountAmount > 0 && (
              <>
                <span className="checkout-discount">Discount</span>
                <span className="checkout-discount-price">₹{discountAmount.toFixed(2)} (Coupon: {couponCode})</span>
              </>
            )}
          </li>


          {/* Grand Total Display */}
          <li
            style={{
              display: "flex",
              justifyContent: "end",
              fontWeight: "bold",
              borderTop: "1px solid #000",
              gap: "10px"
            }}
          >
            <span className="checkout-total">Total</span>
            <span className="checkout-grandtotal">₹{grandTotal.toFixed(2)}</span>
          </li>
        </ul>
        <button className="checkout-placeorder" type="submit">Place Order</button>
      </form>
    </div>
  );
};

export default connect(CheckoutPage);
