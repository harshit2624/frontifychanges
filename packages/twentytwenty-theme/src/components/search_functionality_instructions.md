# Search Functionality Improvement Instructions

This document outlines the changes made to improve the search functionality on your Frontity website.

## Summary of Changes

The search functionality has been updated to provide a better user experience. The following changes have been implemented:

1.  **Real-time Search:** The search results now appear in an overlay as the user types, without needing to navigate to a separate search results page.
2.  **Category Matching:** When the search query matches a product category, a special tile is displayed at the top of the search results, allowing the user to navigate directly to the category page.
3.  **Partial Matching:** The category matching is now based on a partial match, making it more user-friendly. For example, searching for "shirt" will match categories like "T-SHIRT" and "OVERSIZED T-SHIRT".
4.  **Multiple Category Matches:** The search results can now display multiple matching categories.
5.  **Improved UI:** The category tile has been styled to include the site logo, a "View all" message, and an arrow icon.
6.  **Auto-close Overlay:** The search results overlay now closes automatically when a search result (product or category) is clicked.
7.  **Search Tracking:** All search queries and clicks on search results (products and categories) are now tracked and sent to a custom WordPress plugin.

## Modified Files

The following file was modified to implement the new search functionality:

-   `packages/twentytwenty-theme/src/components/header.js`

## Code Changes

### 1. New State Variables

New state variables were added to the `Header` component to store the list of all categories and the categories that match the search query.

```javascript
  const [matchedCategories, setMatchedCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
```

### 2. Fetching Categories

A `useEffect` hook was added to fetch all product categories from the WooCommerce API when the component mounts.

```javascript
  useEffect(() => {
    // ... existing code ...

    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://www.croscrow.com/a/wp-json/wc/v3/products/categories?per_page=100&consumer_key=ck_2732dde9479fa4adf07d8c7269ae22f39f2c74a5&consumer_secret=cs_14996e7e8eed396bced4ac30a0acfd9fea836214");
        const data = await response.json();
        setAllCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
```

### 3. Search Logic

The `performSearch` function was updated to include logic for finding matching categories using a partial, case-insensitive search.

```javascript
  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setSearchPerformed(false);
      setIsSearching(false);
      setShowSearchResults(false);
      setMatchedCategories([]);
      return;
    }

    setIsSearching(true);
    setShowSearchResults(true);

    // Find matching categories
    const matches = allCategories.filter((cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
    setMatchedCategories(matches);

    try {
      const res = await fetch(
        `https://www.croscrow.com/a/wp-json/wc/v3/products?search=${encodeURIComponent(
          searchQuery
        )}&consumer_key=ck_2732dde9479fa4adf07d8c7269ae22f39f2c74a5&consumer_secret=cs_14996e7e8eed396bced4ac30a0acfd9fea836214`
      );
      const data = await res.json();
      setResults(data);
      setSearchPerformed(true);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
      setSearchPerformed(true);
    } finally {
      setIsSearching(false);
    }
  };
```

### 4. Rendering Search Results

The `ResultList` component was updated to render the matched category tiles and the product search results. A `closeSearch` function was added and attached to the `onClick` event of the result items to close the search overlay.

```javascript
  const closeSearch = () => {
    setShowSearchResults(false);
    setQuery("");
    setResults([]);
    setMatchedCategories([]);
    setSearchPerformed(false);
  };

// ...

          {(showSearchResults && (searchPerformed || isSearching)) && (
            <ResultList>
              {matchedCategories.map((category) => (
                <CategoryTile key={category.id} onClick={closeSearch}>
                  <Link link={`/product-category/${category.slug}/`}>
                    <img src={headerData.logo} alt="logo" />
                    <span>View all {category.name}</span>
                    <span>&rarr;</span>
                  </Link>
                </CategoryTile>
              ))}
              <div className="searchGrid">
                {isSearching ? (
                  <LoadingContainer>
                    <LoadingSpinner />
                    <p>Searching...</p>
                  </LoadingContainer>
                ) : results.length > 0 ? (
                  results.map((product) => (
                    <li key={product.id} onClick={closeSearch}>
                      <Link link={`/product/${product.slug}`}>
                        <img src={product.images[0]?.src} alt={product.name} width="40" />
                        {product.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <p className="no-results" style={{ marginTop: "1rem", color: "#777" }}>
                    No result found.
                  </p>
                )}
              </div>
            </ResultList>
          )}
```

### 5. Category Tile Styling

A new styled component `CategoryTile` was created to style the category search result items.

```javascript
const CategoryTile = styled.div`
  background: #eee;
  padding: 1rem;
  margin-bottom: 1rem;
  a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #333;
    text-decoration: none;
    font-weight: bold;
  }
  img {
    height: 30px;
    width: auto;
    margin-right: 1rem;
  }
`;
```

### 6. Search Tracking

A `trackSearch` function was added to the `Header` component to send search data to a custom WordPress REST API endpoint.

```javascript
  const trackSearch = (searchQuery, clickedItemId = null, itemType = null) => {
    axios.post(`${getWpBaseUrl(state)}/wp-json/search-tracker/v1/track`, {
      search_query: searchQuery,
      clicked_item_id: clickedItemId,
      item_type: itemType,
    }).catch(error => {
      console.error("Error tracking search:", error);
    });
  };
```

This function is called in two places:

1.  When a search is performed in the `performSearch` function:

```javascript
    trackSearch(searchQuery);
```

2.  When a user clicks on a category or product in the search results:

```javascript
// Category click
<CategoryTile key={category.id} onClick={() => trackSearch(query, category.id, 'category')}>

// Product click
<li key={product.id} onClick={() => trackSearch(query, product.id, 'product')}>
```
