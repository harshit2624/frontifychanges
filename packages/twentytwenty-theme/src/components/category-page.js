// CategoryPage.js - Complete file with global filter component
import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { connect } from "frontity";
import Link from "@frontity/components/link";
import Loading from "./loading";
import ProductFilter from "./ProductFilter";
import {
  addToCart,
  toggleWishlist,
  getWishlist,
  getWpBaseUrl,
  showToast,
  consumer_key,
  consumer_secret
} from "../utils";

const CategoryPage = ({ state, actions }) => {
  const data = state.source.get(state.router.link);
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState(getWishlist());
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allSizes, setAllSizes] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categoryId, setCategoryId] = useState(null);
  const [currentFilterCategoryId, setCurrentFilterCategoryId] = useState(null);
  const [viewType, setViewType] = useState("grid");

  // Filter states
  const [activeFilters, setActiveFilters] = useState({
    category: "all",
    price: "default",
    size: "all"
  });

  // Ref for infinite scroll
  const observerRef = useRef();

  // const categorySlug = useMemo(() => {
  //   return (
  //     data.params?.slug ||
  //     data.slug ||
  //     state.router.link.split("/").filter(Boolean).pop()
  //   );
  // }, [data, state.router.link]);

  const categorySlug = useMemo(() => {
    // Remove query string first
    const cleanLink = state.router.link.split("?")[0];
  
    return (
      data.params?.slug ||
      data.slug ||
      cleanLink.split("/").filter(Boolean).pop()
    );
  }, [data, state.router.link]);  

  // Handle filter changes from the global filter component
  const handleFilterChange = async (filterData) => {
    const { type, value, categoryId: newCategoryId } = filterData;

    if (type === 'viewType') {
      setViewType(value);
      return;
    }

    setActiveFilters(prev => ({
      ...prev,
      [type]: value
    }));

    if (type === 'category') {
      // Reset page and products for category changes
      setCurrentPage(1);
      setProducts([]);
      setFilteredProducts([]);

      // Use the new category ID or fallback to current page category
      const targetCategoryId = newCategoryId || categoryId;
      setCurrentFilterCategoryId(targetCategoryId);
      await fetchProducts(1, false, targetCategoryId);
    }
    // Price and size filtering will be handled by useEffect
  };

  // Fetch products function
  const fetchProducts = async (page = 1, append = false, targetCategoryId = null) => {
    try {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      const useCategoryId = targetCategoryId || currentFilterCategoryId || categoryId;
      if (!useCategoryId) return;

      const productRes = await fetch(
        `${getWpBaseUrl(state)}/wp-json/wc/v3/products?category=${useCategoryId}&per_page=12&page=${page}&consumer_key=${consumer_key}&consumer_secret=${consumer_secret}`
      );

      const productData = await productRes.json();
      const totalCount = parseInt(productRes.headers.get('X-WP-Total') || '0');

      // Process products and extract sizes
      const sizesSet = new Set(append ? allSizes : []);
      const processedProducts = productData.map(product => {
        const sizeAttribute = product.attributes?.find(
          attr => attr.name.toLowerCase() === 'size' || attr.name.toLowerCase() === 'pa_size'
        );

        if (sizeAttribute?.options) {
          sizeAttribute.options.forEach(size => sizesSet.add(size));
        }

        return {
          ...product,
          size_options: sizeAttribute?.options || []
        };
      });

      let newProducts;
      if (append) {
        newProducts = [...products, ...processedProducts];
        setProducts(newProducts);
      } else {
        newProducts = processedProducts;
        setProducts(newProducts);
      }

      setAllSizes(Array.from(sizesSet).sort());
      setTotalProducts(totalCount);

      // Fix: Use newProducts.length instead of calculating separately
      const hasMore = newProducts.length < totalCount && processedProducts.length > 0;
      setHasMoreProducts(hasMore);

    } catch (err) {
      console.error("Error loading products:", err);
      showToast("Error loading products", "error");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const lastProductElementRef = useCallback(node => {
    if (loadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();

    // Only create observer if we have more products to load
    if (!hasMoreProducts) return;

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMoreProducts && !loadingMore && filteredProducts.length > 0) {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchProducts(nextPage, true);
      }
    }, {
      // Add some threshold to prevent premature triggering
      threshold: 0.1,
      rootMargin: '100px'
    });

    if (node) observerRef.current.observe(node);
  }, [loadingMore, hasMoreProducts, currentPage, filteredProducts.length]);

  // 3. Add cleanup effect to disconnect observer when no more products
  useEffect(() => {
    if (!hasMoreProducts && observerRef.current) {
      observerRef.current.disconnect();
    }
  }, [hasMoreProducts]);

  // Initial load - fetch category and products
  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true);
        setProducts([]);
        setFilteredProducts([]);
        setCurrentPage(1);
        setHasMoreProducts(true);
        setTotalProducts(0);
        setCategoryId(null);
        setCurrentFilterCategoryId(null);

        // Fetch category first
        const categoryRes = await fetch(
          `${getWpBaseUrl(state)}/wp-json/wc/v3/products/categories?per_page=100&consumer_key=${consumer_key}&consumer_secret=${consumer_secret}`
        );
        const categories = await categoryRes.json();
        const matched = categories.find(
          (cat) => cat.slug.toLowerCase() === categorySlug.toLowerCase()
        );

        if (!matched) {
          setProducts([]);
          setTotalProducts(0);
          setHasMoreProducts(false);
          setLoading(false);
          return;
        }

        setCategoryId(matched.id);
        setCurrentFilterCategoryId(matched.id);
        await fetchProducts(1, false, matched.id);

      } catch (err) {
        console.error("Error loading category and products:", err);
        showToast("Error loading products", "error");
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [categorySlug]);

  // Apply price and size filters
  useEffect(() => {
    let filtered = [...products];

    // Price filter
    if (activeFilters.price === "price-asc") {
      filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (activeFilters.price === "price-desc") {
      filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    // Size filter
    if (activeFilters.size !== "all") {
      filtered = filtered.filter((product) =>
        (product.size_options || []).includes(activeFilters.size)
      );
    }

    setFilteredProducts(filtered);
  }, [products, activeFilters.price, activeFilters.size]);

  const handleWishlistToggle = useCallback((id) => {
    setWishlist(toggleWishlist(state, id));
  }, [state]);

  const parsePriceHtml = useCallback((product, html) => {
    try {
      // Safety check for html input
      if (!html || typeof html !== 'string') {
        return {
          regularPrice: null,
          salePrice: null,
          onlyPrice: product.price ? `₹${product.price}` : 'Price not available',
        };
      }

      // Use DOMParser to decode HTML entities
      const decodeHtml = (htmlString) => {
        try {
          if (!htmlString) return '';
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlString, "text/html");
          const textContent = doc.documentElement?.textContent || '';
          const cleaned = textContent.replace(/\.00$/, "");
          return cleaned.trim();
        } catch (e) {
          console.warn('Error decoding HTML:', e);
          return htmlString || '';
        }
      };

      // For variable products: keep full price range
      if (product.type === "variable" && !product?.on_sale) {
        return {
          regularPrice: null,
          salePrice: null,
          onlyPrice: decodeHtml(html),
        };
      }

      // For simple or sale products
      const div = document.createElement("div");
      div.innerHTML = html;

      const del = div.querySelector("del");
      const ins = div.querySelector("ins");

      if ((del && ins) || product?.on_sale) {
        return {
          regularPrice: del?.textContent ? decodeHtml(del.textContent) : null,
          salePrice: ins?.textContent ? decodeHtml(ins.textContent) : null,
          onlyPrice: null,
        };
      }

      const priceText = decodeHtml(div.textContent || '');
      const priceMatches = priceText.match(/₹[\d,]+(?:\.\d+)?/g);

      if (priceMatches?.length === 2 || product?.on_sale) {
        return {
          regularPrice: priceMatches[0] || null,
          salePrice: priceMatches[1] || null,
          onlyPrice: null,
        };
      }

      return {
        regularPrice: null,
        salePrice: null,
        onlyPrice: priceText || `₹${product.price || 'N/A'}`,
      };
    } catch (error) {
      console.error('Error parsing price HTML for product:', product.id, error);
      return {
        regularPrice: null,
        salePrice: null,
        onlyPrice: product.price ? `₹${product.price}` : 'Price not available',
      };
    }
  }, []);

  if (!data.isReady || loading) return <Loading />;

  return (
    <div className="category_page_main_class">
      {/* Use the global filter component */}
      <ProductFilter
        state={state}
        actions={actions}
        onFilterChange={handleFilterChange}
        totalProducts={totalProducts}
        filteredProducts={filteredProducts}
        allSizes={allSizes}
        showCategoryFilter={true}
        currentCategoryId={categoryId}
        viewType={viewType}  // ADD THIS LINE
        currentCategory={categorySlug}
      />

      {filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="product-list">
          {filteredProducts.map((product, index) => {
            // Safety checks for product data
            if (!product || !product.id) return null;

            const { regularPrice, salePrice, onlyPrice } = parsePriceHtml(product, product.price_html);
            const inWishlist = Array.isArray(wishlist) && wishlist.includes(product.id);
            const brandName = product.brands?.[0]?.name;
            const sizes = product.size_options || [];

            // Add ref to the last product for infinite scroll
            const isLastProduct = index === filteredProducts.length - 1;

            return (
              <div
                className={`product-card ${viewType === "list" ? "list-view" : ""}`}  // CHANGE THIS LINE
                key={`${product.id}-${index}`}
                ref={isLastProduct ? lastProductElementRef : null}
              >
                <Link link={`/product/${product.slug}/`}>
                  <img
                    src={product.images?.[0]?.src || '/placeholder-image.jpg'}
                    alt={product.name || 'Product'}
                    className="product-image"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                </Link>

                <div className="cat_detail_sec">
                  <div className="cat_prod_desc">
                    {brandName && <p className="brand-name">{brandName}</p>}
                    <p className="product-name">
                      <strong>{product.name || 'Unnamed Product'}</strong>
                    </p>
                    <div className="product-price">
                      {salePrice && regularPrice ? (
                        <>
                          <span className="original-price">{regularPrice}</span>{" "}
                          <span className="sale-price">{salePrice}</span>
                        </>
                      ) : (
                        <span className="regular-price">{onlyPrice}</span>
                      )}
                    </div>
                  </div>

                  <div className="cat_prod_action">
                    {product.type === "variable" ? (
                      <Link link={`/product/${product.slug}/`}>
                        <button
                          className="add_to_cart_button"
                          onClick={(e) => {
                            showToast("Please select variants", "info");
                          }}
                        >
                          Add to Cart
                        </button>
                      </Link>
                    ) : (
                      <button
                        className="add_to_cart_button"
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </button>
                    )}

                    <button
                      className="wishlist_button"
                      onClick={() => handleWishlistToggle(product.id)}
                    >
                      {inWishlist ? "Wishlisted" : "Add to Wishlist"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Loading indicator for infinite scroll */}
      {loadingMore && (
        <div className="loading-more">
          <p>Loading more products...</p>
        </div>
      )}
    </div>
  );
};

export default connect(CategoryPage);