import React, { useEffect, useState, useRef } from "react";
import { connect } from "frontity";
import Link from "@frontity/components/link";
import { addToCart, toggleWishlist, getWishlist, showToast, getWpBaseUrl, consumer_key, consumer_secret } from "../utils";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper";
SwiperCore.use([Navigation]);
import { styled } from "frontity";
import Loading from "./loading";

import "swiper/swiper.min.css";
import "swiper/modules/navigation/navigation.min.css";

const ProductPage = ({ actions, state }) => {
  const [product, setProduct] = useState(null);
  const [variations, setVariations] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [sizeGuideContent, setSizeGuideContent] = useState("");
  const [upsellProducts, setUpsellProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [brandRelatedProducts, setBrandRelatedProducts] = useState([]);
  const [generalRelatedProducts, setGeneralRelatedProducts] = useState([]);

  // const slug = state.router.link.split("/").filter(Boolean).pop();
  const cleanLink = state.router.link.split("?")[0];  // remove query string
  const slug = cleanLink.split("/").filter(Boolean).pop();

  const [wishlist, setWishlist] = useState(getWishlist());
  const [applicableCoupons, setApplicableCoupons] = useState([]);
  const [isBrandLoading, setIsBrandLoading] = useState(true);
  const [isGeneralLoading, setIsGeneralLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  const mainSwiperRef = useRef(null);

  const PriceDisplay = (priceHtml) => {
    const tempDiv = document.createElement("span");
    tempDiv.innerHTML = priceHtml;

    const symbol = tempDiv.querySelector(".woocommerce-Price-currencySymbol")?.textContent;
    const price = tempDiv.querySelector(".woocommerce-Price-amount bdi")?.textContent.replace(symbol, "").trim();

    return (
      <div>
        <span>{symbol}</span>
        <span>{price}</span>
      </div>
    );
  };

  const handleCopy = (coupon) => {
    navigator.clipboard.writeText(coupon.code);
    showToast("Coupon copied and Apply in bag!", 'success');
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 5000);
  };

  const handleAddToCart = async () => {
    const success = await addToCart(state, product, variantForCart);
  };

  const handleBuyNow = async () => {
    try {
      // Add to cart first and wait for it to complete
      const success = await addToCart(state, product, variantForCart);
      if (success) {
        // Only redirect to checkout after successful add to cart
        actions.router.set("/checkout");
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      showToast('Failed to add to cart. Please try again.', 'error');
    }
  };



  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productResponse = await fetch(
          `${getWpBaseUrl(state)}/wp-json/wc/v3/products?slug=${slug}&consumer_key=${consumer_key}&consumer_secret=${consumer_secret}`
        );
        const productData = await productResponse.json();
        setIsBrandLoading(true);
        setIsGeneralLoading(true);
        if (productData.length > 0) {
          const product = productData[0];
          setProduct(product);
          setSelectedImage(product.images?.[0]?.src || null);
          setCurrentImageIndex(0);

          // Track ViewContent event for Facebook Pixel
          if (typeof window !== "undefined" && window.fbq) {
            const price = parseFloat(product.price || product.regular_price || 0);
            window.fbq('track', 'ViewContent', {
              content_ids: [product.id.toString()],
              content_type: 'product',
              currency: 'INR',
              value: price
            });
          }

          const sizeGuideMeta = product.meta_data.find((meta) => meta.key === "size_guide");
          setSizeGuideContent(sizeGuideMeta ? sizeGuideMeta.value : "");

          if (product.type === "variable") {
            const variationsResponse = await fetch(
              `${getWpBaseUrl(state)}/wp-json/wc/v3/products/${product.id}/variations?per_page=100&consumer_key=${consumer_key}&consumer_secret=${consumer_secret}`
            );
            const variationsData = await variationsResponse.json();
            setVariations(variationsData);

            if (variationsData.length > 0) {
              const firstVariation = variationsData[0];
              setSelectedVariation(firstVariation);
              const initialAttributes = {};
              firstVariation.attributes.forEach((attr) => {
                initialAttributes[attr.name] = attr.option;
              });
              setSelectedAttributes(initialAttributes);
            }
          }

          if (product.upsell_ids && product.upsell_ids.length > 0) {
            const upsellResponse = await fetch(
              `${getWpBaseUrl(state)}/wp-json/wc/v3/products?include=${product.upsell_ids.join(",")}&consumer_key=${consumer_key}&consumer_secret=${consumer_secret}`
            );
            const upsellData = await upsellResponse.json();
            setUpsellProducts(upsellData);
          } else {
            setUpsellProducts([]);
          }

          // Fetch coupons after product is set
          fetchApplicableCoupons(product);
          fetchBrandRelatedProducts(product);
          fetchGeneralRelatedProducts(product);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    const fetchBrandRelatedProducts = async (product) => {
      try {
        if (!product.brands || product.brands.length === 0) {
          setBrandRelatedProducts([]);
          return;
        }

        // Get the brand name from the current product
        const brandName = product.brands[0].name;

        // First, get all products
        const response = await fetch(
          `${getWpBaseUrl(state)}/wp-json/wc/v3/products?per_page=100&exclude=${product.id}&consumer_key=${consumer_key}&consumer_secret=${consumer_secret}`
        );
        const allProducts = await response.json();

        // Filter products by the same brand
        const sameBrandProducts = allProducts.filter(prod =>
          prod.brands &&
          prod.brands.length > 0 &&
          prod.brands[0].name === brandName
        ).slice(0, 4); // Limit to 4 products
        setIsBrandLoading(false);
        setBrandRelatedProducts(sameBrandProducts || []);
      } catch (error) {
        console.error("Error fetching brand related products:", error);
        setBrandRelatedProducts([]);
      }
    };

    const fetchGeneralRelatedProducts = async (product) => {
      try {
        // Get the current product's brand name and categories
        const currentBrandName = product.brands?.[0]?.name;
        const productCategories = product.categories || [];

        let filteredProducts = [];

        // Strategy 1: First try to get products from the same categories (excluding same brand)
        if (productCategories.length > 0) {
          // Get the primary category (usually the first one)
          const primaryCategoryId = productCategories[0].id;

          const categoryResponse = await fetch(
            `${getWpBaseUrl(state)}/wp-json/wc/v3/products?category=${primaryCategoryId}&per_page=30&exclude=${product.id}&consumer_key=${consumer_key}&consumer_secret=${consumer_secret}`
          );
          const categoryProducts = await categoryResponse.json();

          setIsGeneralLoading(false);
          // Filter out same brand products
          const sameCategoryDifferentBrand = categoryProducts.filter(prod => {
            if (prod.brands && prod.brands.length > 0 && currentBrandName) {
              return prod.brands[0].name !== currentBrandName;
            }
            return true;
          });

          filteredProducts = [...sameCategoryDifferentBrand];
        }

        // Strategy 2: If we don't have enough products from same category, get more from other categories
        if (filteredProducts.length < 15) {
          const additionalResponse = await fetch(
            `${getWpBaseUrl(state)}/wp-json/wc/v3/products?per_page=50&exclude=${product.id}&consumer_key=${consumer_key}&consumer_secret=${consumer_secret}`
          );
          const allProducts = await additionalResponse.json();

          // Filter out same brand and already included products
          const existingIds = filteredProducts.map(p => p.id);
          const additionalProducts = allProducts.filter(prod => {
            // Skip if already included
            if (existingIds.includes(prod.id)) return false;

            // Skip same brand
            if (prod.brands && prod.brands.length > 0 && currentBrandName) {
              return prod.brands[0].name !== currentBrandName;
            }
            return true;
          });

          // Add additional products to reach 15
          const needed = 15 - filteredProducts.length;
          filteredProducts = [...filteredProducts, ...additionalProducts.slice(0, needed)];
        }

        // Strategy 3: Smart sorting - prioritize products with similar attributes
        const smartSortedProducts = filteredProducts.sort((a, b) => {
          let scoreA = 0;
          let scoreB = 0;

          // Score based on category similarity
          const productCategoryIds = productCategories.map(cat => cat.id);
          const aCategoryIds = (a.categories || []).map(cat => cat.id);
          const bCategoryIds = (b.categories || []).map(cat => cat.id);

          // Count matching categories
          const aMatches = aCategoryIds.filter(id => productCategoryIds.includes(id)).length;
          const bMatches = bCategoryIds.filter(id => productCategoryIds.includes(id)).length;

          scoreA += aMatches * 10;
          scoreB += bMatches * 10;

          // Score based on price similarity (closer price gets higher score)
          const currentPrice = parseFloat(product.price || product.regular_price || 0);
          const aPrice = parseFloat(a.price || a.regular_price || 0);
          const bPrice = parseFloat(b.price || b.regular_price || 0);

          const aPriceDiff = Math.abs(currentPrice - aPrice);
          const bPriceDiff = Math.abs(currentPrice - bPrice);

          // Closer price gets higher score (inverse relationship)
          scoreA += Math.max(0, 100 - aPriceDiff / 10);
          scoreB += Math.max(0, 100 - bPriceDiff / 10);

          // Score based on product type similarity
          if (a.type === product.type) scoreA += 5;
          if (b.type === product.type) scoreB += 5;

          return scoreB - scoreA; // Higher score first
        });

        // Take only 15 products
        const limitedProducts = smartSortedProducts.slice(0, 15);

        setGeneralRelatedProducts(limitedProducts || []);
      } catch (error) {
        console.error("Error fetching general related products:", error);
        setGeneralRelatedProducts([]);
      }
    };

    const fetchApplicableCoupons = async (product) => {
      try {
        const response = await fetch(
          `${getWpBaseUrl(state)}/wp-json/wc/v3/coupons?per_page=100&consumer_key=${consumer_key}&consumer_secret=${consumer_secret}`
        );
        const allCoupons = await response.json();

        const filtered = allCoupons.filter((coupon) => {
          const isGlobalCoupon =
            (!coupon.product_ids || coupon.product_ids.length === 0) &&
            (!coupon.product_categories || coupon.product_categories.length === 0) &&
            (!coupon.excluded_product_ids || coupon.excluded_product_ids.length === 0) &&
            (!coupon.excluded_product_categories || coupon.excluded_product_categories.length === 0);

          const includesProduct =
            coupon.product_ids?.includes(product.id) ||
            coupon.product_categories?.some((catId) =>
              product.categories?.some((cat) => cat.id === catId)
            );

          const isExcluded =
            coupon.excluded_product_ids?.includes(product.id) ||
            coupon.excluded_product_categories?.some((excludedCatId) =>
              product.categories?.some((cat) => cat.id === excludedCatId)
            );

          return (isGlobalCoupon || includesProduct) && !isExcluded;
        });

        if (filtered.length === 0) return null;

        setApplicableCoupons(filtered);
      } catch (error) {
        console.error("Failed to fetch coupons", error);
      }
    };

    fetchProduct();
  }, [slug]);

  useEffect(() => {
    const sync = () => setWishlist(getWishlist());
    window.addEventListener("wishlistUpdated", sync);
    return () => window.removeEventListener("wishlistUpdated", sync);
  }, []);

  const handleThumbnailClick = (imageSrc, index) => {
    setSelectedImage(imageSrc);
    setCurrentImageIndex(index);
    // Slide main swiper to the clicked image
    if (mainSwiperRef.current && mainSwiperRef.current.swiper) {
      mainSwiperRef.current.swiper.slideTo(index);
    }
  };

  const handleToggleWishlist = async (productId) => {
    const updated = await toggleWishlist(productId);
    setWishlist(updated);
  };


  if (!product) return <Loading />;

  const { name, images, description, categories, attributes } = product;
  const brandName = product.brands?.[0]?.name;
  const inWishlist = wishlist.includes(product.id);

  const handleAttributeChange = (attributeName, value) => {
    const updatedAttributes = {
      ...selectedAttributes,
      [attributeName]: value,
    };
    setSelectedAttributes(updatedAttributes);

    const matchedVariation = variations.find((variation) =>
      variation.attributes.every(
        (attr) => updatedAttributes[attr.name] === attr.option
      )
    );
    setSelectedVariation(matchedVariation || null);
  };

  const displayPrice = () => {
    if (product.type === "simple") {
      const { regular_price, sale_price } = product;
      if (sale_price && sale_price !== "") {
        return (
          <>
            <span style={{ textDecoration: "line-through", marginRight: "10px" }}>
              ₹{regular_price}
            </span>
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>₹{sale_price}</span>
          </>
        );
      }
      return <span>₹{regular_price}</span>;
    }

    if (selectedVariation) {
      const { regular_price, sale_price } = selectedVariation;
      if (sale_price && sale_price !== "") {
        return (
          <>
            <span style={{ textDecoration: "line-through", marginRight: "10px" }}>
              ₹{regular_price}
            </span>
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>₹{sale_price}</span>
          </>
        );
      }
      return <span>₹{regular_price}</span>;
    }

    return <span>Price not available</span>;
  };

  const renderCoupon = (coupon) => {
    const isGlobal =
      (!coupon.product_ids || coupon.product_ids.length === 0) &&
      (!coupon.product_categories || coupon.product_categories.length === 0);

    const couponText =
      coupon.description ||
      `Get ${coupon.amount}${coupon.discount_type === "percent" ? "%" : ""} off`;

    const discountAmount =
      coupon.discount_type === "percent"
        ? (product.price * coupon.amount) / 100
        : parseFloat(coupon.amount);

    const discountedPrice = (product.price - discountAmount).toFixed(2);

    const discountPercent =

      coupon.discount_type === "percent"

        ? Math.round(coupon.amount)

        : Math.round((discountAmount / product.price) * 100); // for fixed discount, calculate approx %

    return (
      <div
        key={coupon.id}
        className="border border-gray-300 rounded-lg p-4 bg-[#fff9e6] shadow-sm relative mb-3"
      >

        <div className="coupon-display flex items-center justify-between mb-2">
          <div className="coupon-offer-discount">
            <div className="coupon-img-display flex items-center space-x-2">
              <div className="coupon-container">
                <div className="coupon-logo">
                  <img
                    src={`${getWpBaseUrl(state)}/wp-content/uploads/2025/05/croscrow_logo.png`}
                    alt="Coupon"
                    className="coupon-img"
                    style={{filter: 'invert(1)'}}
                  />
                </div>

                <div className="coupon_details">
                  <p className="get-it-in">
                    Get it in {discountedPrice}
                  </p>
                  <p className="coupon-text">{couponText}</p>
                </div>

                {/* % Off Badge */}
                <div className="percentage-off-display">{discountPercent}% Off</div>
              </div>

            </div>
            <div className="copy-coupon">
              <div className="offer-use-code" style={{display: 'flex', gap: '5px', alignItems: 'center'}}>
                <p className="use-code">Use Code : </p>
                <div className="copy_container">
                  <div className="offer-title">
                    <span className="coupon-code" onClick={() => handleCopy(coupon)} >
                      {coupon.code}
                    </span>

                    {/* <button onClick={() => handleCopy(coupon)} className="percentage-off-display">
                    {copied ? 'Copied !' : 'Copy'}
                  </button> */}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  };




  const variantForCart = selectedVariation
    ? {
      id: selectedVariation.id,
      name:
        selectedVariation.attributes.map((attr) => attr.option).join(" / ") || name,
      price:
        selectedVariation.sale_price && selectedVariation.sale_price !== ""
          ? parseFloat(selectedVariation.sale_price)
          : parseFloat(selectedVariation.regular_price),
      image: selectedVariation.image?.src || images?.[0]?.src || "",
    }
    : product.type === "simple"
      ? {
        id: product.id,
        name: product.name,
        price:
          product.sale_price && product.sale_price !== ""
            ? parseFloat(product.sale_price)
            : parseFloat(product.regular_price),
        image: images?.[0]?.src || "",
      }
      : null;

  return (
    <div>
      {/* <nav class="product-page-breadcrumbs">
        <Link link="/">Home</Link> / <Link link={`/product-category/${categories[0]?.slug}`}>{categories[0]?.name}</Link> / <span>{name}</span>
      </nav> */}
      <div>
        <div class="product-main-class">
          <div class="product-image-gallery" style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
            {/* Thumbnails */}
            <div class="image-gallery-thumbnails" style={{ width: "80px", height: "400px", position: "relative" }}>
              <Swiper
                direction="vertical"
                slidesPerView={4}
                spaceBetween={10}
                style={{ height: "100%" }}
              >
                {images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image.src}
                      alt={`Thumbnail ${index}`}
                      onClick={() => handleThumbnailClick(image.src, index)}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        border:
                          currentImageIndex === index
                            ? "2px solid black"
                            : "1px solid #ccc",
                        cursor: "pointer",
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Main Image with Swiper */}
            <div class="product-main-image" style={{ width: "400px", height: "400px" }}>
              <Swiper
                ref={mainSwiperRef}
                spaceBetween={10}
                onSlideChange={(swiper) => {
                  const newIndex = swiper.activeIndex;
                  setCurrentImageIndex(newIndex);
                  setSelectedImage(images[newIndex]?.src);
                }}
                initialSlide={currentImageIndex}
                style={{ width: "100%", height: "100%" }}
              >
                {images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image.src}
                      alt={`Product image ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        border: "1px solid #eee",
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          <div class="product-desc-details">
            {brandName && <div class="product-brandname">{brandName}</div>}
            <h2 class="product-name-title">{name}</h2>
            <div class="product-price">{displayPrice()}</div>

            {attributes.map((attribute) => (
              <div class="product-variants" key={attribute.id}>


                {sizeGuideContent && sizeGuideContent.trim() !== "" && (
                  <div
                    className="size_guide"
                    onClick={() => setPopupOpen(true)}
                    style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                  >
                    Size Guide
                  </div>
                )}

                <div class="attribute-value">
                  {attribute.options
                    .sort((a, b) => {
                      const order = ["XS", "S", "M", "L", "XL", "XXL"]; // define custom order
                      return order.indexOf(a) - order.indexOf(b);
                    }).map((option) => (
                      <div
                        key={option}
                        onClick={() => handleAttributeChange(attribute.name, option)}
                        className={`attribute-display ${selectedAttributes[attribute.name] === option ? "active" : ""
                          }`}
                        style={{
                          cursor: "pointer",
                          userSelect: "none",
                          display: "inline-block",
                          marginRight: "10px",
                          padding: "5px",
                          border:
                            selectedAttributes[attribute.name] === option
                              ? "2px solid black"
                              : "1px solid #ccc",
                        }}
                      >
                        {option}
                      </div>
                    ))}
                </div>
              </div>
            ))}



            {/* Offers */}
            <div className="coupon-offer-section">
              <h4 className="available-coupons">Available Coupons</h4>

              {applicableCoupons.length > 0 && (
                <>
                  {applicableCoupons.map((coupon) => renderCoupon(coupon))}
                </>
              )}
            </div>



            <AnimatedButton>
              <div className="product-buttons-action">
                {addedToCart ? (
                  <Link link="/cart">
                    <button className="product-addtocart-button added-to-cart">
                      <span className="button-content">
                        <svg
                          className="check-icon"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="9,11 12,14 22,4"></polyline>
                          <path d="M21,12v7a2,2,0,0,1-2,2H5a2,2,0,0,1-2-2V5a2,2,0,0,1,2-2h11"></path>
                        </svg>
                        Go to Cart
                      </span>
                    </button>
                  </Link>
                ) : (
            <div className="cart-buy-buttons">
              <button
                className="product-addtocart-button addBTN"
                onClick={() => addToCart(state, product, variantForCart)}
                disabled={product.type === "variable" && !selectedVariation}
              >
                <span className="button-content">Add to Cart</span>
              </button>
            </div>
                )}
                <button
                  className="product-addtocart-button"
                  onClick={handleBuyNow}
                  disabled={product.type === "variable" && !selectedVariation}
                >
                  <span className="button-content">Buy Now</span>
                </button>

                <button
                  className={`product-wishlist-button ${inWishlist ? "active" : ""}`}
                  onClick={() => handleToggleWishlist(product.id)}
                >
                  {inWishlist ? "Wishlisted" : "Add to Wishlist"}
                </button>
              </div>
            </AnimatedButton>
          </div>
        </div>
        {description && (
          <div className="global_custom_class">
            <div className="product-desc-main">
              {/* Accordion Title */}
              <div
                className="product-description-title"
                onClick={() => setIsOpen(!isOpen)}
                style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
              >
                <span style={{ fontWeight: "bold", marginRight: "8px" }}>Description:</span>

                {/* Show short preview beside heading */}
                <span style={{ color: "#57636C", fontSize: "14px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {description.replace(/<[^>]+>/g, "").slice(0, 50)}...
                </span>

                <span
                  style={{
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                    marginLeft: "8px",
                  }}
                  className="icon"
                >
                  {/* Chevron Down SVG */}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 8L10 13L15 8"
                      stroke="#57636C"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>

              {/* Accordion Content */}
              {isOpen && (
                <div
                  className="product-description-content"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              )}
            </div>
          </div>
        )}

      </div>

      {/* Popup for Size Guide */}
      {popupOpen && (
        <div
          className="popup_overlay"
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 }}
          onClick={() => setPopupOpen(false)}
        >
          <div
            style={{ backgroundColor: "white", padding: "20px", maxWidth: "600px", maxHeight: "80vh", overflowY: "auto", position: "relative" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPopupOpen(false)}
              style={{ position: "absolute", top: 10, right: 10, border: "none", background: "none", fontSize: "24px", cursor: "pointer" }}
            >
              &times;
            </button>
            <div dangerouslySetInnerHTML={{ __html: sizeGuideContent }} />
          </div>
        </div>
      )}

      <div className="similarProd">
        {/* Related Products Section */}
        {isBrandLoading ? (
          <Loading />
        ) : brandRelatedProducts.length > 0 && (
          <div className="related_products_section">
            <h2 className="related-title">More from {product.brands?.[0]?.name}</h2>
            <div className="related-products-show">
              {brandRelatedProducts.map((relatedProduct) => {
                const inWishlistRelated = wishlist.includes(relatedProduct.id);

                const relatedForCart = {
                  id: relatedProduct.id,
                  name: relatedProduct.name,
                  price: parseFloat(relatedProduct.price),
                  image: relatedProduct.images?.[0]?.src || "",
                };

                return (
                  <div className="related-products" key={relatedProduct.id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
                    <Link link={`/product/${relatedProduct.slug}`}>
                      <img src={relatedProduct.images?.[0]?.src || ""} alt={relatedProduct.name} width="150" />
                    </Link>

                    <div className="rel_detail_sec">
                      <div className="rel_prod_desc">
                        {relatedProduct.brands?.[0]?.name && (
                          <div className="product_brand_name_related">{relatedProduct.brands[0].name}</div>
                        )}

                        <div className="product_name_related">{relatedProduct.name}</div>
                        <div className="related_product_price_con">
                          {relatedProduct.on_sale ? (
                            <>
                              <span style={{
                                textDecoration: "line-through",
                                marginRight: "8px",
                                fontSize: "14px",
                              }}>
                                {PriceDisplay(relatedProduct.price_html)}
                              </span>
                              <span style={{
                                fontWeight: "bold",
                              }}>
                                ₹{relatedProduct.price}
                              </span>
                            </>
                          ) : (
                            <span>₹{relatedProduct.price}</span>
                          )}
                        </div>
                      </div>

                      <div className="rel_prod_action">
                        {relatedProduct.type === "variable" ? (
                          <Link link={`/product/${relatedProduct.slug}/`}>
                            <button
                              className="related_product_addtocart"
                              onClick={(e) => {
                                showToast("Please select variants", "info");
                              }}
                              style={{ marginRight: "10px" }}
                            >
                              Add to Cart
                            </button>
                          </Link>
                        ) : (
                          <button
                            className="related_product_addtocart"
                            onClick={async () => {
                              await addToCart(state, relatedProduct, relatedForCart, relatedProduct.stock_quantity);
                            }}
                            style={{ marginRight: "10px" }}
                          >
                            Add to Cart
                          </button>
                        )}

                        <button
                          className="related_product_wishlist"
                          onClick={async () => {
                            const updated = await toggleWishlist(relatedProduct.id);
                            setWishlist(updated);
                          }}
                        >
                          {inWishlistRelated ? "Wishlisted" : "Add to Wishlist"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* General Related Products Section */}
        {isGeneralLoading ? (
          <Loading />
        ) : generalRelatedProducts.length > 0 && (
          <div className="related_products_section also-like-section">
            <h2 className="related-title">You May Also Like</h2>
            <div className="related-products-show">
              {generalRelatedProducts.map((relatedProduct) => {
                const inWishlistRelated = wishlist.includes(relatedProduct.id);

                const relatedForCart = {
                  id: relatedProduct.id,
                  name: relatedProduct.name,
                  price: parseFloat(relatedProduct.price),
                  image: relatedProduct.images?.[0]?.src || "",
                };

                return (
                  <div className="related-products" key={relatedProduct.id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
                    <Link link={`/product/${relatedProduct.slug}`}>
                      <img src={relatedProduct.images?.[0]?.src || ""} alt={relatedProduct.name} width="150" />
                    </Link>

                    <div className="rel_detail_sec">
                      <div className="rel_prod_desc">
                        {relatedProduct.brands?.[0]?.name && (
                          <div className="product_brand_name_related">{relatedProduct.brands[0].name}</div>
                        )}

                        <div className="product_name_related">{relatedProduct.name}</div>
                        <div className="related_product_price_con">
                          {relatedProduct.on_sale ? (
                            <>
                              <span style={{
                                textDecoration: "line-through",
                                marginRight: "8px",
                                fontSize: "14px",
                              }}>
                                {PriceDisplay(relatedProduct.price_html)}
                              </span>
                              <span style={{
                                fontWeight: "bold",
                              }}>
                                ₹{relatedProduct.price}
                              </span>
                            </>
                          ) : (
                            <span>₹{relatedProduct.price}</span>
                          )}
                        </div>
                      </div>

                      <div className="rel_prod_action">
                        {relatedProduct.type === "variable" ? (
                          <Link link={`/product/${relatedProduct.slug}/`}>
                            <button
                              className="related_product_addtocart"
                              onClick={(e) => {
                                showToast("Please select variants", "info");
                              }}
                              style={{ marginRight: "10px" }}
                            >
                              Add to Cart
                            </button>
                          </Link>
                        ) : (
                          <button
                            className="related_product_addtocart"
                            onClick={async () => await addToCart(state, relatedProduct, relatedForCart, relatedProduct.stock_quantity)}
                            style={{ marginRight: "10px" }}
                          >
                            Add to Cart
                          </button>
                        )}

                        <button
                          className="related_product_wishlist"
                          onClick={async () => {
                            const updated = await toggleWishlist(relatedProduct.id);
                            setWishlist(updated);
                          }}
                        >
                          {inWishlistRelated ? "Wishlisted" : "Add to Wishlist"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>


    </div>
  );
};

export default connect(ProductPage);

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
      background-color: rgb(0, 46, 255);
      border-color: rgb(0, 46, 255);
      color: white;
      transform: scale(1.02);
      
      .check-icon {
        opacity: 1;
        transform: scale(1) rotate(0deg);
      }
      
      &:hover {
        background-color: rgb(47 84 255);
        transform: scale(1.05);
      }
    }
    
    &:active:not(.added-to-cart) {
      transform: scale(0.98);
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
