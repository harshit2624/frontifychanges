import { css } from "frontity";


const cssReset = css`
  html,
  body {
    border: none;
    margin: 0;
    padding: 0;
    background: transparent !important;
    width: 100%;
    font-family: "Roboto", sans-serif !important;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  a,
  div,
  strong,
  blockquote,
  address,
  big,
  cite,
  code,
  em,
  font,
  img,
  small,
  strike,
  sub,
  sup,
  li,
  ol,
  ul,
  fieldset,
  form,
  label,
  legend,
  button,
  table,
  caption,
  tr,
  th,
  td {
    border: none;
    font-size: inherit;
    line-height: inherit;
    margin: 0;
    padding: 0;
    text-align: inherit;
    text-transform: uppercase !important;
    font-family: "Roboto", sans-serif !important;
  }

  blockquote::before,
  blockquote::after {
    content: "";
  }

  a,
  path {
    transition: all 0.15s linear;
  }
`;

/**
 * Styles for Document Setup.
 *
 * See `1. Document Setup` at
 * https://themes.trac.wordpress.org/browser/twentytwenty/1.7/style.css.
 *
 * @param colors - Object with color definitions, from `state.theme.colors`.
 * @returns Serialized style.
 */
const documentSetup = (colors) => css`
  html {
    font-size: 62.5%; /* 1rem = 10px */
  }

  body {
    background: ${colors.bodyBg};
    box-sizing: border-box;
    color: #000;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Helvetica Neue",
      Helvetica, sans-serif;
    font-size: 1.8rem;
    letter-spacing: -0.015em;
    text-align: left;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
    -webkit-font-smoothing: antialiased;
    word-break: break-word;
    word-wrap: break-word;
  }

  #site-content {
    overflow: hidden;
  }
`;

const accessibilitySettings = css`
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0s !important;
      transition-duration: 0s !important;
    }
  }
`;

/**
 * Styles for Element Base.
 *
 * See `2. Element Base` at
 * https://themes.trac.wordpress.org/browser/twentytwenty/1.7/style.css.
 *
 * @param colors - Object with color definitions, from `state.theme.colors`.
 * @returns Serialized style.
 */
const elementBase = (colors) => css`
  main {
    display: block;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  .faux-heading {
    font-feature-settings: "lnum";
    font-variant-numeric: lining-nums;
    font-weight: 700;
    letter-spacing: -0.0415625em;
    line-height: 1.25;
    margin: 3.5rem 0 2rem;
  }

  h1,
  .heading-size-1 {
    font-size: 3.6rem;
    font-weight: 800;
    line-height: 1.138888889;
  }

  h2,
  .heading-size-2 {
    font-size: 3.2rem;
  }

  h3,
  .heading-size-3 {
    font-size: 2.8rem;
  }

  h4,
  .heading-size-4 {
    font-size: 2.4rem;
  }

  h5,
  .heading-size-5 {
    font-size: 2.1rem;
  }

  h6,
  .heading-size-6 {
    font-size: 1.6rem;
    letter-spacing: 0.03125em;
    text-transform: uppercase;
  }

  p {
    line-height: 1.5;
    margin: 0 0 1em 0;
  }

  em,
  i,
  q,
  dfn {
    font-style: italic;
  }

  em em,
  em i,
  i em,
  i i,
  cite em,
  cite i {
    font-weight: bolder;
  }

  big {
    font-size: 1.2em;
  }

  small {
    font-size: 0.75em;
  }

  b,
  strong {
    font-weight: 700;
  }

  ins {
    text-decoration: underline;
  }

  sub,
  sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }

  sup {
    top: -0.5em;
  }

  sub {
    bottom: -0.25em;
  }

  abbr,
  acronym {
    cursor: help;
  }

  address {
    line-height: 1.5;
    margin: 0 0 2rem 0;
  }

  hr {
    border-style: solid;
    border-width: 0.1rem 0 0 0;
    border-color: ${colors.gray.light};
    margin: 4rem 0;
  }

  a {
    color: ${colors.primary};
    text-decoration: underline;
  }

  a:hover,
  a:focus {
    text-decoration: none;
  }
`;

const elementBase700 = css`
  @media (min-width: 700px) {
    h1,
    .heading-size-1,
    h2,
    .heading-size-2,
    h3,
    .heading-size-3 {
      margin: 6rem auto 3rem;
    }

    h4,
    .heading-size-4,
    h5,
    .heading-size-5,
    h6,
    .heading-size-6 {
      margin: 4.5rem auto 2.5rem;
    }

    h1,
    .heading-size-1 {
      font-size: 6.4rem;
    }

    h2,
    .heading-size-2 {
      font-size: 4.8rem;
    }

    h3,
    .heading-size-3 {
      font-size: 4rem;
    }

    h4,
    .heading-size-4 {
      font-size: 3.2rem;
    }

    h5,
    .heading-size-5 {
      font-size: 2.4rem;
    }

    h6,
    .heading-size-6 {
      font-size: 1.8rem;
    }
  }
`;

const elementBase1220 = css`
  @media (min-width: 1220px) {
    h1,
    .heading-size-1 {
      font-size: 8.4rem;
    }
  }
`;

const listStyle = css`
  ul,
  ol {
    margin: 0 0 3rem 3rem;
  }

  ul {
    list-style: disc;
  }

  ul ul {
    list-style: circle;
  }

  ul ul ul {
    list-style: square;
  }

  ol {
    list-style: decimal;
  }

  ol ol {
    list-style: lower-alpha;
  }

  ol ol ol {
    list-style: lower-roman;
  }

  li {
    line-height: 1.5;
    margin: 0.5rem 0 0 2rem;
  }

  li > ul,
  li > ol {
    margin: 1rem 0 0 2rem;
  }

  .reset-list-style,
  .reset-list-style ul,
  .reset-list-style ol {
    list-style: none;
    margin: 0;
  }

  .reset-list-style li {
    margin: 0;
  }

  dt,
  dd {
    line-height: 1.5;
  }

  dt {
    font-weight: 700;
  }

  dt + dd {
    margin-top: 0.5rem;
  }

  dd + dt {
    margin-top: 1.5rem;
  }
`;

/**
 * Styles for blockquotes.
 *
 * See `2. Element Base / Quotes` at
 * https://themes.trac.wordpress.org/browser/twentytwenty/1.7/style.css.
 *
 * @param colors - Object with color definitions, from `state.theme.colors`.
 * @returns Serialized style.
 */
const quoteStyle = (colors) => css`
  blockquote {
    border-color: ${colors.primary};
    border-style: solid;

    /*rtl:ignore*/
    border-width: 0 0 0 0.2rem;
    color: inherit;
    font-size: 1em;
    margin: 4rem 0;

    /*rtl:ignore*/
    padding: 0.5rem 0 0.5rem 2rem;
  }

  cite {
    color: ${colors.gray};
    font-size: 1.4rem;
    font-style: normal;
    font-weight: 600;
    line-height: 1.25;
  }

  blockquote cite {
    display: block;
    margin: 2rem 0 0 0;
  }

  blockquote p:last-child {
    margin: 0;
  }
`;

/**
 * Styles for code elements.
 *
 * See `2. Element Base / Code` at
 * https://themes.trac.wordpress.org/browser/twentytwenty/1.7/style.css.
 *
 * @param colors - Object with color definitions, from `state.theme.colors`.
 * @returns Serialized style.
 */
const codeStyle = (colors) => css`
  code,
  kbd,
  pre,
  samp {
    font-family: monospace;
    font-size: 0.9em;
    padding: 0.4rem 0.6rem;
  }

  code,
  kbd,
  samp {
    background: rgba(0, 0, 0, 0.075);
    border-radius: 0.2rem;
  }

  pre {
    border: 0.1rem solid ${colors.gray.light};
    line-height: 1.5;
    margin: 4rem 0;
    overflow: auto;
    padding: 3rem 2rem;
    text-align: left;
  }

  pre code {
    background: transparent;
    padding: 0;
  }
`;

/**
 * Styles for media elements.
 *
 * See `2. Element Base / Media` at
 * https://themes.trac.wordpress.org/browser/twentytwenty/1.7/style.css.
 *
 * @param colors - Object with color definitions, from `state.theme.colors`.
 * @returns Serialized style.
 */
const mediaStyle = (colors) => css`
  figure {
    display: block;
    margin: 0;
  }

  iframe {
    display: block;
    max-width: 100%;
  }

  video {
    display: block;
  }

  svg,
  img,
  embed,
  object {
    display: block;
    height: auto;
    max-width: 100%;
  }

  figcaption,
  .wp-caption-text {
    color: ${colors.gray.base};
    display: block;
    font-size: 1.5rem;
    font-weight: 500;
    line-height: 1.2;
    margin-top: 1.5rem;
  }

  figcaption a,
  .wp-caption-text a {
    color: inherit;
  }
`;

/**
 * Styles for tables.
 *
 * See `2. Element Base / Tables` at
 * https://themes.trac.wordpress.org/browser/twentytwenty/1.7/style.css.
 *
 * @param colors - Object with color definitions, from `state.theme.colors`.
 * @returns Serialized style.
 */
const tableStyles = (colors) => css`
  table {
    border: 0.1rem solid ${colors.gray.light};
    border-collapse: collapse;
    border-spacing: 0;
    empty-cells: show;
    font-size: 1.6rem;
    margin: 4rem 0;
    max-width: 100%;
    overflow: hidden;
    width: 100%;
  }

  .alignleft > table {
    margin: 0;
  }

  .alignright > table {
    margin: 0;
  }

  th,
  td {
    border: 0.1rem solid ${colors.gray.light};
    line-height: 1.4;
    margin: 0;
    overflow: visible;
    padding: 0.5em;
  }

  caption {
    background: ${colors.gray.light};
    font-weight: 600;
    padding: 0.5em;
    text-align: center;
  }

  thead {
    vertical-align: bottom;
    white-space: nowrap;
  }

  th {
    font-weight: 700;
  }
`;

const headerPageStyle = css`
  header[class*="PageHeader"] {
    display: flex;
    max-width: 1680px;
    margin: 0 auto;
    padding-inline: 5rem;
  }
  header[class*="PageHeader"] div[class*="HeaderInner"] {
    padding: 0px;
    display: grid;
    grid-template-columns: 15% 65% 20%;
    margin: 0;
    gap: 20px;
    width: 100%;
  }
  div[class*="HeaderNavigationWrapper"] {
    width: 100%;
  }
  div[class*="searchGrid"] {
    max-height: 400px;
    overflow-y: auto;
    scrollbar-color: #14181B #fff;
    scrollbar-width: thin;
    padding-right: 20px;
  }
  div[class*="HeaderNavigationWrapper"] ul[class*="ResultList"] {
    position: absolute;
    background: #fff;
    width: 50%;
    top: 85px;
    margin: 0 0 0 5px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  }
  div[class*="HeaderNavigationWrapper"] ul[class*="ResultList"] li {
    margin: 0 0 15px 0;
  }
  div[class*="HeaderNavigationWrapper"] ul[class*="ResultList"] p[class*="no-results"] {
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Roboto", sans-serif;
    font-weight: 500;
    font-size: 20px;
    line-height: 14px;
    letter-spacing: 0%;
  }
  div[class*="CartWrapper"],
  div[class*="WishlistWrapper"],
  .Myaccount {
    background: #F3F4F6;
    padding: 8px;
    border-radius: 5px;
  }
  div[class*="HeaderNavigationWrapper"] ul[class*="ResultList"] li a img {
    height: 80px;
    width: 80px;
    object-fit: contain;
  }
  div[class*="HeaderNavigationWrapper"] ul[class*="ResultList"] li a {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #14181B;
    gap: 10px;
  }
  div[class*="HeaderNavigationWrapper"] form[class*="SearchForm"] {
    width: 80%;
  }
  div[class*="accountIcon"] {
    justify-content: flex-end;
    margin-right: 20px;
  }
  div[class*="HeaderNavigationWrapper"] form[class*="SearchForm"] button[class*="SearchButton"] {
    background: #14181B;
    padding: 12px 21px;
    border-color: #14181b;
    margin-left: -71px;
  }
  div[class*="HeaderNavigationWrapper"] form[class*="SearchForm"] input[class*="SearchInput"] {
    background-color: #F0F0F0 !important;
    border: none;
    padding: 15px 16px;
    font-weight: 300;
  }
  header[class*="PageHeader"] div[class*="HeaderTop"] {
      padding: 0;
  }
  @media (max-width: 767px) {
    header[class*="PageHeader"] {
      max-width: 100%;
      padding-inline: 20px;
      justify-content: space-between;
      margin-block: 20px 0;
    }
    header[class*="PageHeader"] div[class*="HeaderTop"] {
      grid-column: 1 / 2;
      order: 1;
    }
    div[class*="HeaderNavigationWrapper"] {
      display: block;
      order: 3;
      grid-column: 1 / -1;
    }
    div[class*="accountIcon"] {
      order: 2;
      grid-column: 2 / 4;
      margin-right: 0;
    }
    div[class*="HeaderNavigationWrapper"] form[class*="SearchForm"] {
      width: 100%;
    }
    header[class*="PageHeader"] div[class*="HeaderInner"] {
      margin: 0;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: auto auto;
      gap: 0;
    }
    header[class*="PageHeader"] div[class*="ToggleWrapper"] button {
      left: 50%;
      transform: translateX(-50%);
    }
    div[class*="HeaderNavigationWrapper"] ul[class*="ResultList"] {
      width: 100%;
    }
    div[class*="searchGrid"] {
      max-height: 300px;
    }
  }
  @media screen and (min-width: 767px) and (max-width: 992px) {
    header[class*="PageHeader"] {
      max-width: 100%;
      padding-inline: 20px;
      justify-content: space-between;
    }
    div[class*="HeaderNavigationWrapper"] {
      display: block;
    }
    header[class*="PageHeader"] div[class*="ToggleWrapper"] button {
      left: 50%;
      transform: translateX(-50%);
    }
    header[class*="PageHeader"] div[class*="HeaderInner"] {
      grid-template-columns: 15% 58% 20%;
    }
    div[class*="HeaderNavigationWrapper"] form[class*="SearchForm"] {
      width: 100%;
    }
    div[class*="HeaderNavigationWrapper"] ul[class*="ResultList"] {
      width: 100%;
    }
    div[class*="accountIcon"] {
      margin-right: 0;
    }
  }
`;

const PostArticle = css`
  header[class*="PostHeader-Header"] {
    display: none;
  }
`;

const PageWidth = css`
  div[class*="global_custom_class"],
  div[class*="category_page_main_class"],
  div[class*="product-main-class"],
  div[class*="related_products_section"],
  nav[class*="product-page-breadcrumbs"],
  div[class*="wishlist-container"],
  div[class*="order-details"],
  div[class*="thankYouWrapper"],
  h2[class*="global_custom_class"] {
    max-width: 1680px !important;
    margin: 0 auto !important;
    padding-inline: 5rem !important;
  }
  @media (max-width: 767px) {
      div[class*="global_custom_class"],
      div[class*="category_page_main_class"],
       div[class*="thankYouWrapper"],
      div[class*="product-main-class"],
      div[class*="order-details"],
      div[class*="related_products_section"],
      nav[class*="product-page-breadcrumbs"],
      div[class*="wishlist-container"],
      div[class*="CartContainer"],
      h2[class*="global_custom_class"] {
        max-width: 100% !important;
        padding-inline: 15px !important;
    }
  }
  @media screen and (min-width: 767px) and (max-width: 992px) {
      div[class*="global_custom_class"],
      div[class*="category_page_main_class"],
      div[class*="thankYouWrapper"],
      div[class*="order-details"],
      div[class*="product-main-class"],
      div[class*="related_products_section"],
      div[class*="wishlist-container"],
      nav[class*="product-page-breadcrumbs"],
      div[class*="CartContainer"],
      h2[class*="global_custom_class"] {
        max-width: 100% !important;
        padding-inline: 25px !important;
    }
  }
`

const BannerSection = css`
  div[class*="SectionContainer-PostInner"] {
    max-width: 100%;
    margin: 0px;
    padding: 0px;
    width: 100%;
  }
  div[class*="EntryContent"] {
    width: 100%;
    max-width: 100%;
    border-top: 1px solid #0000001A;
    padding-top: 30px;
  }
  div[class*="homepage_banner"] {
    padding-inline: 35px;
    margin-bottom: 40px;
  }
  div[class*="homepage_banner"] figure {
    margin: 0;
  }
  div[class*="homepage_banner"] img {
    width: 100%;
  }
  div[class*="homepage_banner"] div[class*="enhanced-slider-initialized"] {
    overflow: hidden;
  }
  div[class*="homepage_banner"] div[class*="enhanced-slider-initialized"] ul li img {
    width: 100%;
    aspect-ratio: 1000 / 584; /* Keeps height proportional */
    object-fit: cover;        /* Ensures the image doesn’t get stretched */
    border-radius: 9px;
  }
  div[class*="homepage_banner"] div[class*="enhanced-slider-initialized"] ul li {
   padding-inline: 20px;
  }
  div[class*="homepage_banner"] div[class*="enhanced-slider-initialized"] ul,
  div[class*="homepage_banner"] div[class*="enhanced-slider-initialized"] ul li {
    margin: unset;
  }
  @media (max-width: 767px) {
    div[class*="homepage_banner"] {
      padding-inline: 15px;
      margin-bottom: 15px;
    }
    div[class*="homepage_banner"] div[class*="enhanced-slider-initialized"] ul li {
      padding-inline: 0;
      aspect-ratio: 1000 / 584; 
      height: auto;
    }
    div[class*="homepage_banner"] div,
    div[class*="homepage_banner"] figure,
    div[class*="homepage_banner"] img {
      height: 100%;
      border-radius: 10PX;
    }
  }
`;

const BrandsTopsSection = css`
  div[class*="brands_tops_section"] {
    display: flex;
    justify-content: start;
    align-items: center;
    flex-wrap: no-wrap;
    scrollbar-width: none;
    overflow-x: auto;
  }
  div[class*="brands_tops_section"] .wp-block-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 16%;
    max-width: 16%;
    width: 100%;
  }
  div[class*="brands_tops_section"] .wp-block-image, div[class*="brands_tops_section"] .wp-block-heading {
    margin: 0;
    font-weight: 300;
  }
  div[class*="brands_tops_section"] span[class*="Container"] {
   padding-bottom: unset;
  }
  div[class*="brands_tops_section"] span[class*="Container"] img {
   position: static;
  }
  @media(max-width: 767px) {
      div[class*="brands_tops_section"] {
        flex-wrap: nowrap;
        justify-content: flex-start;
        overflow-x: scroll;
        scrollbar-width: none;
      }
      div[class*="brands_tops_section"] .wp-block-column {
        width: 100%;
        min-width: 32%;
        max-width: 32%;
      }
  }
  @media screen and (min-width: 767px) and (max-width: 992px) {
      div[class*="brands_tops_section"] {
        padding-inline: 25px 0 !important;
        flex-wrap: nowrap;
        overflow-x: scroll;
        scrollbar-width: none;
      }
      div[class*="brands_tops_section"] .wp-block-column {
        min-width: 22%;
        max-width: 22%;
        width: 100%;
      }
  }
  @media screen and (min-width: 992px) and (max-width: 1200px) {
      div[class*="brands_tops_section"] {
        padding-block: 30px 0;
      }
  }
`;

const ShopBySections = css`
  div[class*="shop_by_cat_display"] ul {
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    row-gap: 50px;
  }
  .category-products-section div[class*="Container"] {
    height: auto;
  }
  div[class*="shop_by_cat_display"] ul li {
    width: calc(100% / 4);
    margin: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    padding-inline: 30px;
    row-gap: 5px;
  }
  div[class*="shop_by_cat_display"] ul li .wc-block-components-product-image {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
  }
  div[class*="shop_by_cat_display"] ul li .wc-block-components-product-image a {
    height: 100%;
  }
  div[class*="shop_by_cat_display"] ul li .wc-block-components-product-price {
    display: flex;
    // flex-direction: column;
    gap: 10px;
    line-height: normal;
  }
  div[class*="shop_by_cat_display"] ul li .wc-block-components-product-price del {
    text-decoration: none;
  }
  div[class*="shop_by_cat_display"] ul li .wc-block-components-product-price del bdi {
    text-decoration: line-through;
  }
  div[class*="shop_by_cat_display"] img {
    height: auto;
    width: auto;
    // max-height: 322px;
    // max-width: 322px;
    position: static;
    aspect-ratio: 4/5;
    object-fit: contain;
  }
  div[class*="shop_by_cat_display"] li span[class*="Container"] {
    padding-bottom: 0;
  }
  div[class*="shop_by_cat_display"] div[class*="wc-block-components-product-sale-badge"] {
    position: absolute;
    z-index: 1;
    background: rgb(0, 46, 255);
    padding: 5px 22px;
    color: #fff;
    font-size: 14px;
    border-radius: 20px;
    margin: 11px 0 0 10px;
  }
  div[class*="shop_by_cat_display"] div[class*="wc-block-components-product-sale-badge"] .screen-reader-text {
    display: none;
  }
  div[class*="shop_by_cat_display"] h3 a,
  div[class*="category_page_main_class"] .product-card a {
    color: rgb(20, 24, 27);
    text-decoration: none;
    // line-height: 22px;
    display: -webkit-box !important;
    -webkit-line-clamp: 1 !important;
    -webkit-box-orient: vertical !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
  div[class*="shop_by_cat_display"] h3 {
    padding-top: 8px;
  }
  div[class*="shop_by_cat_display"] h3,
  div[class*="category_page_main_class"] .product-card .product-name strong {
    margin: 0;
    font-weight: 400;
    font-size: 13px;
    padding-top: 0;
    line-height: 18px;
    display: -webkit-box !important;
    -webkit-line-clamp: 1 !important;
    -webkit-box-orient: vertical !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
  div[class*="shop_by_cat_display"] .custom-sale-price span[class*="woocommerce-Price-amount"] bdi {
    font-size: 18px;
    font-weight: bold;
  }
  div[class*="category_page_main_class"] div[class*="product-card"] .original-price,
  .original-price {
    text-decoration: line-through;
  }
  div[class*="shop_by_cat_display"] span[class*="woocommerce-Price-amount"] bdi,
  div[class*="category_page_main_class"] div[class*="product-card"] .regular-price,
  div[class*="category_page_main_class"] div[class*="product-card"] .original-price,
  .original-price,
  .regular-price {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    color: #14181B;
    }
  div[class*="category_page_main_class"] div[class*="product-card"] .sale-price,
  .sale-price {
    font-size: 14px;
    font-weight: 600;
    font-family: "Roboto", sans-serif;
    line-height: 17px;
  }
  div[class*="view_all_button"] {
    border-block: 1px solid #57636C;
    padding-block: 8px;
    display: flex;
    justify-content: center;
    margin-block: 60px;
  }
  div[class*="view_all_button"] div[class*="wp-block-button"] {
    width: 100%;
    text-align: center;
  }
  div[class*="view_all_button"] a {
    font-family: "Roboto", sans-serif;
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    text-decoration: none;
    color: #14181B;
    width: 100%;
    display: block;
  }
  div[class*="shop_by_cat_display"] .wishlist_button_wrapper {
    display: flex;
    justify-content: flex-end;
  }
  @media (max-width: 767px) {
    div[class*="shop_by_cat_display"] ul li {
      width: calc(100% / 2);
      padding-inline: 10px;
    }
    div[class*="shop_by_cat_display"] ul li .wc-block-components-product-image {
      height: 100%;
      width: 100%;
    }
    div[class*="shop_by_cat_display"] h3 {
      padding-top: 0;
      min-height: unset;
    }
    div[class*="shop_by_cat_display"] img {
      height: 100%;
      width: 100%;
      aspect-ratio: 4/5;
    }
    div[class*="shop_by_cat_display"] ul {
      row-gap: 30px;
    }
    div[class*="view_all_button"] {
      margin-block: 25px 0;
      padding-block: 6px;
      margin-inline: 30px;
      border: 1px solid #57636C;
    }
    div[class*="category_page_main_class"] .product-card .product-name strong {
      -webkit-line-clamp: 1 !important;
      min-height: 18px;
    }
    div[class*="shop_by_cat_display"] .prod-grid-details span {
      line-height: 14px;
      margin-top: 10px;
    }
    div[class*="shop_by_cat_display"] span[class*="woocommerce-Price-amount"] bdi {
      font-size: 12px !important;
    }
    div[class*="shop_by_cat_display"] .custom-sale-price span[class*="woocommerce-Price-amount"] bdi {
      font-size: 13px;
    }
  }
  @media screen and (min-width: 767px) and (max-width: 992px) {
    div[class*="shop_by_cat_display"] ul {
      justify-content: flex-start;
    }
    div[class*="shop_by_cat_display"] ul li {
      width: calc(100% / 3);
      padding-inline: 20px;
      align-items: center;
    }
    div[class*="wc-block-components-product-button"] {
      align-items: flex-start !important;
      margin-top: 10px;
  }
    div[class*="shop_by_cat_display"] ul li .wc-block-grid__product-image {
      height: 100%;
      width: 100%;
    }
    div[class*="shop_by_cat_display"] img {
      height: 100%;
      width: 100%;  
      aspect-ratio: 4/5;
    }
    div[class*="view_all_button"] {
      margin-block: 30px;
      padding-block: 5px;
      margin-inline: 30px;
      border: 1px solid #57636C;
    }
    div[class*="shop_by_cat_display"] .custom-sale-price span[class*="woocommerce-Price-amount"] bdi {
      font-size: 15px;
    }
  }
  @media screen and (min-width: 992px) and (max-width: 1360px) {
    div[class*="shop_by_cat_display"] ul li {
      width: calc(100% / 4);
      padding-inline: 20px;
      max-width: 340px;
    }
    div[class*="shop_by_cat_display"] ul {
      justify-content: space-evenly;
    }
  }
  // @media (min-width: 1440px) {
  //   div[class*="shop_by_cat_display"] span[class*="Container"] {
  //     padding-bottom: 85%;
  //   }
  // }
`;

const BestSeller = css`
  div[class*="best_seller_products_display"] ul {
    display: flex;
    margin: 0;
    gap: 25px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  div[class*="best_seller_products_display"] ul li {
    width: calc(100% / 12);
    margin: 0;
    list-style: none;
    min-width: calc(100% / 12);
  }
  .custom-product-item a {
    text-decoration: none;
  }
  div[class*="global_custom_class"].best_seller_products_display {
    padding-inline: 5rem 0px!important;
  }
  div[class*="best_seller_products_display"] ul li .wp-block-woocommerce-product-price,
  div[class*="best_seller_products_display"] ul li .wc-block-components-product-button,
  div[class*="best_seller_products_display"] ul li .wc-block-components-product-sale-badge {
    display: none;
  }
  div[class*="best_seller_products_display"] h3 {
    font-family: "Roboto", sans-serif;
    font-weight: 300;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    color: #14181B;
    margin: 10px 0 0 0;
    display: -webkit-box !important;
    -webkit-line-clamp: 1 !important;
    -webkit-box-orient: vertical !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
  div[class*="best_seller_products_display"] h2,
  div[class*="shop_by_cat_display"] h2,
  h2[class*="shop_by_category_heading"],
  h2[class*="related-title"] {
    font-weight: 300;
    font-size: 16px;
    line-height: 24px;
    font-variant: small-caps;
    color: #14181B;
    margin-block: 25px !important;
  }
  .related_products_section h2[class*="related-title"] {
    margin-block: 20px !important;
  }
  div[class*="best_seller_products_display"] h3 a {    
    text-decoration: none;
    color: #14181B;
  }
  div[class*="best_seller_products_display"] span[class*="Container"] {
    padding-bottom: 100%;
  }
  div[class*="best_seller_products_display"] span[class*="Container"] img {
    width: 100%;
    aspect-ratio: 4/5;
    object-fit: contain;
  }
  @media screen and (min-width: 992px) and (max-width: 1440px) {
      div[class*="best_seller_products_display"] ul li {
        width: calc(100% / 10);
        min-width: calc(100% / 10);
        margin: 0;
        list-style: none;
      }
  }
  @media (max-width: 767px) {
    div[class*="global_custom_class"].best_seller_products_display {
      padding-inline: 15px 0 !important;
    }
    .related_products_section h2[class*="related-title"] {
      margin-block: 30px 10px !important;
    }
    div[class*="best_seller_products_display"] ul {
      gap: 0;
      justify-content: flex-start;
      row-gap: 30px;
      overflow-x: scroll;
      flex-wrap: nowrap;
      scrollbar-width: none;
    }
    div[class*="best_seller_products_display"] ul li {
      width: 100%;
      max-width: 28.5%;
      min-width: 28.5%;
      padding-inline: 10px;
    }
    div[class*="best_seller_products_display"] h2,
    div[class*="shop_by_cat_display"] h2,
    h2[class*="shop_by_category_heading"] {
      margin-block: 25px !important;
    }
  }
  @media screen and (min-width: 767px) and (max-width: 992px) {
    div[class*="best_seller_products_display"] ul {
      flex-wrap: nowrap;
      overflow-x: scroll;
      scrollbar-width: none;
    }
    div[class*="global_custom_class"].best_seller_products_display {
      padding-inline: 25px 0 !important;
    }
    div[class*="best_seller_products_display"] ul li {
      width: 100%;
      min-width: calc(100% / 8);
      max-width: calc(100% / 8);
    }
  }
`;

const ShopByCategories = css`
  div[class*="category_display"] {
    display: flex;
    flex-wrap: wrap;
    margin: 0;
  }
  .product-price.custom-price .product-price {
    line-height: 18px;
  }
  .prod-grid-details .product-brand-home {
    margin: 0px;
    font-weight: 400;
    font-size: 11px;
    line-height: 12px;
    color: rgb(87, 99, 108);
    display: -webkit-box !important;
    -webkit-line-clamp: 1 !important;
    -webkit-box-orient: vertical !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
  .prod-grid-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 10px;
  }
  .prod-grid-details .screen-reader-text {
    display: none;
  }
  .prod-grid-details ins {
    text-decoration: none;
  }
  div[class*="shop_by_cat_display"] .prod-grid-details ins bdi {
    font-weight: 600;
    font-size: 16px;
  }
  div[class*="category_display"] .wp-block-column {
    width: calc(100% / 4); 
    margin: 0;
    // flex-direction: column;
    // display: flex;
    // align-items: center;
    // justify-content: end;
  }
  div[class*="category_display"] .wp-block-column figure {
    margin: 0;
    height: 100%;
  }
  // div[class*="category_display"] .wp-block-column figure img {
  //   height: 100%;
  //   width: 100%;
  // }
  div[class*="category_display"] .wp-block-column figure span {
    height: 100%;
  }
  @media(max-width: 767px) {
    div[class*="category_display"] {
      flex-wrap: nowrap;
      overflow-x: scroll;
      scrollbar-width: none;
      margin-top: 40px !important;
    }
    .prod-grid-details {
      // flex-direction: column;
      // align-items: flex-start;
      gap: 0;
    }
    div[class*="category_display"] .wp-block-column {
      width: 100%;
      min-width: 70%;
      max-width: 70%;
    }
    div[class*="category_display"] .wp-block-column img {
      height: auto;
    }
    h2[class*="shop_by_category_heading"] {
      margin-block: 30px 10px !important;
    }
  }
  @media screen and (min-width: 767px) and (max-width: 992px) {
    div[class*="category_display"] .wp-block-column img {
      height: 100%;
    }
    div[class*="category_display"] .wp-block-column figure {
      margin: 0;
    }
    div[class*="category_display"] {
      flex-wrap: nowrap;
      overflow-x: scroll;
      scrollbar-width: none;
    }
    div[class*="category_display"] .wp-block-column {
      width: 100%;
      min-width: 33.33%;
      max-width: 33.33%;
    }
  }
  @media screen and (min-width: 992px) and (max-width: 1200px) {
    div[class*="category_display"] .wp-block-column img {
      height: 100%;
    }
    div[class*="category_display"] .wp-block-column figure {
      margin: 0;
    }
  }
`;

const Footer = css`
  footer[class*="SiteFooter"] {
    margin: 0;
    padding: 0;
    z-index: 9;
  }
  div[class*="SectionContainer-SiteFooterInner"] {
    display: none;
  }
  div[class*="footer_custom_class"] {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    background: #FDF9F9;
    padding-block: 8px;
  }
  @media (max-width: 767px) {
    footer[class*="SiteFooter"] {
      padding-block: 12px;
      position: sticky;
      width: 100%;
      bottom: 0;
    }
    footer[class*="SiteFooter"] div[class*="DynamicWpFooter"] img {
      height: 20px;
    }
  }
  @media screen and (min-width: 767px) and (max-width: 992px) {
    footer[class*="SiteFooter"] {
      position: sticky;
      width: 100%;
      bottom: 0;
    }
  }
  @media screen and (min-width: 994px) and (max-width: 1440px) {
    div[class*="footer_custom_class"] {
      padding-block: 20px;
    } 
    footer[class*="SiteFooter"] div[class*="DynamicWpFooter"] img {
      height: 30px;
      width: 30px;
    }
  }
`;

const CategoryPage = css`
  div[class*="category_page_main_class"] div[class*="product-list"] {
    display: flex;
    flex-wrap: wrap;
    row-gap: 38px;
    margin-top: 20px;
  }
.filter-dropdown {
  display: flex;
}

.filter-dropdown label {
  font-weight: bold;
  font-size: 14px;
}

.filter-dropdown select {
  border-radius: 6px;
  font-size: 13px;
  background: transparent;
  outline: none;
  transition: border 0.3s ease;
  border: none;
}

.filter-dropdown select:hover {
  border-color: #888;
}

 .sort-toggle-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 16px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 8px; /* space between icon & text */
  }
  .sort-toggle-btn .icon {
    font-size: 18px;
  }
  .sort-panel {
    transition: transform 0.4s ease-in-out;
    z-index: 999;
    display: flex;
    gap: 20px;
  }
  div[class*="category_page_main_class"] div[class*="product-list"] div[class*="product-card"]  {
   width: calc(100% / 4);
   padding-inline: 10px;
   min-height: max-content;
   height: 100%;
  }
  div[class*="category_page_main_class"] .product-card .brand-name {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 11px;
    line-height: 20px;
    color: #57636C;
    margin-block: 10px 0;
  }
  div[class*="category_page_main_class"] .product-card .product-name strong {
    min-height: unset !important;
  }
  div[class*="category_page_main_class"] .product-card .product-name {
    margin: 0;
  }
  div[class*="cat_prod_action"] {
      z-index: 0;
      display: flex;
      flex-direction: row-reverse;
      gap: 10px;
  }
  div[class*="category_page_main_class"] .product-card img,
  div[class*="wishlist-container"] ul[class*="wishlist-list"] li img {
    height: 100%;
    width: 100%;
    object-fit: contain;
    margin: 0 auto;
    aspect-ratio: 4 / 5;
  }
  div[class*="category_page_main_class"] .product-card button,
  button[class*="product-wishlist-button"],
  div[class*="wishlist-container"] button[class*="add-to-cart-button"],
  button[class*="related_product_addtocart"],
  button[class*="add_to_cart_button"],
  a[class*="add_to_cart_button"],
  button[class*="wishlist_button"],
  button[class*="related_product_wishlist"] {
    font-size: 0 !important;
    text-indent: -9999px;
    width: 25px !important;
    height: 25px !important;
    border-radius: 50% !important;
    border: none !important;
    background: none !important;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    color: #666;
    margin: 0;
    display: flex;
  }
  div[class*="shop_by_cat_display"] button[class*="add_to_cart_button"]::before,
  div[class*="shop_by_cat_display"] a[class*="add_to_cart_button"]::before {
    left: 100%;
  }
  div[class*="category_page_main_class"] .product-card button[class*="add_to_cart_button"]::before,
  div[class*="wishlist-container"] button[class*="add-to-cart-button"]::before,
  button[class*="add_to_cart_button"]::before,
  a[class*="add_to_cart_button"]::before,
  button[class*="related_product_addtocart"]::before {
    content: "";
    background: url("data:image/png;base64,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");
    font-size: 20px;
    position: absolute;
    z-index: 5;
    top: 50%;
    text-indent: 0px;
    background-repeat: no-repeat;
    left: 50%;
    height: 100%;
    transform: translate(-50%, -50%);
    width: 100%;
    background-size: 25px;
    display: flex;
    align-item: center;
  }
  div[class*="category_page_main_class"] .product-card button[class*="wishlist_button"]::before,
  button[class*="product-wishlist-button"]::before,
  button[class*="related_product_wishlist"]::before,
  button[class*="wishlist_button"]::before {
    content: "";
    background: url("data:image/png;base64,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");
    font-size: 20px;
    position: absolute;
    z-index: 5;
    top: 50%;
    text-indent: 0px;
    background-repeat: no-repeat;
    left: 50%;
    height: 100%;
    transform: translate(-50%, -50%);
    width: 100%;
    background-size: 25px;
    display: flex;
    align-item: center;
  }
  div[class*="wc-block-components-product-button"] {
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    align-items: flex-end;
  }
  .new_in_wrapper {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    margin-top: 6px;
  }
  .new_in_wrapper span {
    font-family: Roboto;
    font-weight: 400;
    font-size: 10px;
    line-height: 14px;
    letter-spacing: 0%;
    color: #2149FF;
  }
  @media (max-width: 767px) {
    div[class*="category_page_main_class"] div[class*="product-list"] {
      margin-top: 30px;
    }
    .action-sec {
      margin-top: 5px;
    }
    .new_in_wrapper {
      margin-top: 0;
    }
    div[class*="category_page_main_class"] div[class*="product-list"] div[class*="product-card"] {
        width: calc(100% / 2);
    }
    div[class*="category_page_main_class"] div[class*="product-list"] div[class*="product-card"].list-view {
        width: 100%;
    }
    div[class*="rel_detail_sec"] {
      // align-items: flex-start !important;
    }
    div[class*="rel_detail_sec"], div[class*="cat_detail_sec"] {
      // flex-direction: column;
      row-gap: 0 !important;
    }
    div[class*="product_name_related"], div[class*="related_product_price"] {
      min-height: unset !important;
    }
    div[class*="wc-block-components-product-button"] {
      align-items: flex-start;
      // margin-top: 10px;
    }
    div[class*="category_page_main_class"] .product-card button[class*="add_to_cart_button"]::before, div[class*="wishlist-container"] button[class*="add-to-cart-button"]::before, button[class*="add_to_cart_button"]::before, a[class*="add_to_cart_button"]::before, button[class*="related_product_addtocart"]::before,
    div[class*="category_page_main_class"] .product-card button[class*="wishlist_button"]::before, button[class*="product-wishlist-button"]::before, button[class*="related_product_wishlist"]::before, button[class*="wishlist_button"]::before {
      background-size: 18px;
    }
    div[class*="category_page_main_class"] .product-card button, button[class*="product-wishlist-button"], div[class*="wishlist-container"] button[class*="add-to-cart-button"], button[class*="related_product_addtocart"], button[class*="add_to_cart_button"], a[class*="add_to_cart_button"], button[class*="wishlist_button"], button[class*="related_product_wishlist"] {
      width: 19px !important;
      height: 20px !important;
    }

  }
  @media screen and (min-width: 767px) and (max-width: 992px) {
    div[class*="category_page_main_class"] div[class*="product-list"] div[class*="product-card"]  {
      width: calc(100% / 2);
      max-width: 250px;
    }
    div[class*="category_page_main_class"] div[class*="product-list"] {
      margin-block: 20px 70px;
      justify-content: space-between;
      max-width: 600px;
      margin: 0 auto;
    }
    div[class*="category_page_main_class"] .product-card button {
      margin-right: 0;
    }
  }
`;

const ProductPage = css`
  footer[class*="SiteFooter"] {
    margin: 0;
    padding: 0;
  }
  h4[class*="available-coupons"] {
    margin: 20px 0;
    color: #14181B;
  }
  .related-products-show div[class*="related_product_price_con"] {
    display: flex !important;
  }
  div[class*="SectionContainer-SiteFooterInner"] {
    display: none;
  }
  div[class*="footer_custom_class"] {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    background: #FDF9F9;
    padding-block: 28px;
  }
  div[class*="product-image-gallery"] {
   overflow: hidden;
   width: 50%;
   height: 615px;
  }
  div[class*="image-gallery-thumbnails"] {
   width: 16% !important;
   height: 100% !important;
  }
  div[class*="image-gallery-thumbnails"] .swiper-slide {
   height: 100px !important;
  }
  div[class*="image-gallery-thumbnails"] .swiper-slide img {
   height: 100px !important;
   width: 100px !important;
   object-fit: contain !important;
  }
  div[class*="product-main-image"] {
   width: 82% !important;
   overflow: hidden;
   height: 100% !important;
  }
  div[class*="product-main-image"] .swiper-wrapper {
    display: flex;
    height: 100%;
  }
  div[class*="product-main-image"] .swiper-wrapper .swiper-slide {
    width: 100% !important;
    max-width: 100%;
    min-width: 100%;
  }
  div[class*="product-main-image"] img {
    width: 100% !important;
    border: 1px solid #00000033 !important;
    height: 100% !important;
  }
  h2[class*="product-name-title"] {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 32px;
    line-height: 34px;
    color: #14181B;
    margin: 24px 0 12px 0;
  }
  div[class*="product-brandname"] {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: rgb(87, 99, 108);
  }
  div[class*="product-main-class"] {
    display: flex;
    gap: 45px;
  }
  div[class*="product-desc-details"] {
   width: 50%;
  }
  div[class*="product-desc-details"] div[class*="product-price"] span {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 16px !important;
    line-height: 20px;
    color: #14181B;
  }
  div[class*="swiper-button-prev"],
  div[class*="swiper-button-next"] {
    padding: 5px 14px;
    background: #000;
  }
  div[class*="swiper-button-prev"].swiper-button-lock,
  div[class*="swiper-button-next"].swiper-button-lock {
    display: none;
  }
  div[class*="swiper-button-prev"]::before,
  div[class*="swiper-button-next"]::before {
    content: "";
    display: inline-block;
    width: 10px;
    height: 10px;
    border-left: 3px solid #fff;
    border-top: 3px solid #fff;
  }
  div[class*="swiper-button-prev"]::before {
    transform: rotate(45deg);
  }
  div[class*="swiper-button-next"]::before {
    transform: rotate(-135deg);
  }
  nav[class*="product-page-breadcrumbs"] {
    margin-block: 20px !important;
  }
  div[class*="product-brandname"],
  div[class*="product-variants"] {
    margin-block: 14px !important;
  }
  div[class*="product-variants"] {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  div[class*="attribute-display"],
  div[class*="variant-select"] button {
    border: 1px solid rgb(87, 99, 108) !important;
    padding: 9px 18px !important;
    border-radius: 4px !important;
    font-size: 14px !important;
    line-height: normal;
  }
  div[class*="attribute-display"].active {
    background: #14181B;
    color: #FFFFFF;
  }
  button[class*="product-addtocart-button"] {
    background: #14181B;
    color: #FFFFFF;
    padding: 13px 65px;
    border-radius: 5px;
    cursor: pointer;
  }
  button[class*="product-addtocart-button"].addBTN {
    background: transparent;
    color: rgb(20, 24, 27);
    border: 1px solid rgb(20, 24, 27);
  }
  div[class*="product-desc-details"] button[class*="product-wishlist-button"]::before {
    margin-top: 0 !important;
    top: 68%;
    left: 68%;
  }
  div[class*="product-desc-details"] button[class*="product-wishlist-button"] {
    padding: 13px;
    border: 1px solid #57636C !important;
    border-radius: 5px !important;
    height: 47px !important;
    width: 47px !important;
  }
  div[class*="product-desc-main"] {
    margin-block: 40px;
  }
  div[class*="BenefitWrapper"] {
    margin: 15px 0px;
  }
  div[class*="product-description-title"] {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 18px;
    line-height: 20px;
    color: #57636C;
    display: flex;
    gap: 10px;
  }
  div[class*="product-description-content"] p {
      font-family: "Roboto", sans-serif;
      font-weight: 300;
      font-size: 14px;
      line-height: 16px;
      color: #57636C;
      margin-top: 14px;
  }
  div[class*="related_products_section"].also-like-section {
    max-width: 100% !important;
    padding-inline: 0 !important;
  }
  div[class*="related_products_section"] .related-products-show {
   display: flex;
   row-gap: 20px;
   overflow-x: auto;
   scrollbar-width: none;
  }
  div[class*="related_products_section"] .related-products-show .related-products {
    width: calc(25% - 1vw);
    height: 100%;
    border: none !important;
    min-width: calc(25% - 1vw);
  }
  div[class*="related_products_section"] .related-products-show .related-products img {
    height: 100%;
    max-width: 100%;
    margin: 0 auto;
    width: 100%;
    max-height: 260px;
    object-fit: contain;
    aspect-ratio: 4 / 5;
  }
  div[class*="related_products_section"] .related-products-show .related-products .rel_prod_action {
    display: flex;
    align-items: center;
  }
  div[class*="product_brand_name_related"] {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 11px;
    line-height: 12px;
    color: #57636C;
    margin-block: 10px 0;
  }
  div[class*="product_name_related"],
  div[class*="related_product_price"] {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
    color: #14181B;
    line-height: 18px;
    display: -webkit-box!important;
    -webkit-line-clamp: 2!important;
    -webkit-box-orient: vertical!important;
    overflow: hidden!important;
    text-overflow: ellipsis!important;
  }
  div[class*="rel_detail_sec"],
  div[class*="cat_detail_sec"] {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  div[class*="coupon-img-display"] {
   display: flex;
   padding-inline: 13px;
  }
  div[class*="coupon-container"] {
   display: grid;
   width: 100%;
   grid-template-columns: 20% 55% 25%;
   align-items: center;
  }
  p[class*="get-it-in"] {
    font-family: "Roboto", sans-serif;
    font-weight: 500;
    font-size: 18px;
    line-height: 20px;
    color: #14181B;
    margin: 8px 0 4px 0;
  }
  p[class*="coupon-text"] {
    font-family: "Roboto", sans-serif;
    font-weight: 300;
    font-size: 14px;
    line-height: 14px;
    margin: 0 0 8px 0;
    color: #57636C;
  }
  span[class*="coupon-code"] {
     border: 1px dashed #57636C;
     color: rgb(0, 46, 255);
     border-radius: 4px;
    padding: 8px 15px;
    text-align: center;
    font-size: 13px;
    font-weight: 500;
  }
  div[class*="percentage-off-display"] {
    color: #57636C;
    border: 1px solid #57636C;
    border-radius: 4px;
    padding: 8px 15px;
    text-align: center;
    font-size: 13px;
    font-weight: 500;
  }
  div[class*="coupon-offer-discount"] {
    border: 1px solid #14181B;
  }
  div[class*="coupon-display"] {
    width: 80%;
  }
  div[class*="copy-coupon"] {
    display: flex;
    border-top: 1px solid #14181B;
    border-radius: 5px;
    padding: 8px 13px 9px 13px;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
  }
  div[class*="copy-coupon"] .use-code {
    margin: 0;
    font-family: "Roboto", sans-serif;
    font-weight: 500;
    font-size: 16px;
    color: #57636C;
    line-height: 20px;
    text-transform: uppercase;
  }
  div[class*="copy-coupon"] .coupon-code {
    font-family: "Roboto", sans-serif;
    font-weight: 500;
    font-size: 13px;
    color: #14181B;
    text-transform: uppercase;
  }
  div[class*="offer-title"] {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  div[class*="offer-title"] p {
    margin: 0;
  }
  button[class*="see-all-btn"] {
    width: 100%;
    background: rgb(20, 24, 27);
    padding: 9px 16px;
    border-radius: 4PX;
    color: #fff;
    text-align: center;
    font-family: "Roboto", sans-serif;
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-height: 40px;
  }
  div[class*="product-buttons-action"] {
    display: flex;
    align-items: center;
    margin-top: 40px;
    gap: 12px;
  }
  .similarProd div[class*="Container"]{
    height: unset !important;
  }
  @media (max-width: 767px) {
    footer[class*="SiteFooter"] {
      padding-block: 12px;
    }
    div[class*="product-main-image"] img {
     border: none !important;
    }
    div[class*="product-main-image"] {
      width: 100% !important;
    }
    div[class*="product-description-title"] {
      font-size: 13px;
      justify-content: space-between;
      grid-template-columns: 30% 50% 20%;
      display: grid !important;
    }
    div[class*="product-description-title"] > span {
      font-size: 13px;
    }
    div[class*="product-description-title"] .icon {
      position: absolute;
      right: 10px;
    }
    div[class*="product-description-content"] p {
      font-size: 12px;
      margin-top: 10px;
    }
    footer[class*="SiteFooter"] div[class*="DynamicWpFooter"] img {
      height: 20px;
    }
    div[class*="product-main-class"] {
      flex-direction: column;
    }
    div[class*="product-desc-details"],
    div[class*="product-image-gallery"] {
      width: 100%;
    }
    div[class*="product-image-gallery"] {
      flex-direction: row-reverse;
      margin-top: 0px !important;
    }
    div[class*="swiper-button-prev"], div[class*="swiper-button-next"] {
      transform: translateX(-50%);
      left: 50% !important;
    }
    div[class*="swiper-button-prev"]::before, div[class*="swiper-button-next"]::before {
      width: 8px;
      height: 8px;
      border-left: 1px solid rgb(255, 255, 255);
      border-top: 1px solid rgb(255, 255, 255);
    }
    div[class*="swiper-button-prev"], div[class*="swiper-button-next"] {
      padding: 2px 10px;
    }
    button[class*="product-addtocart-button"] {
      padding: 9px 22px;
      font-size: 12px;
    }
    div[class*="product-desc-details"] button[class*="product-wishlist-button"] {
      height: 32px !important;
      width: 32px !important;
    }
    div[class*="product-desc-details"] button[class*="product-wishlist-button"]::before {
    top: 74%;
    left: 72%;
    background-size: 15px;
    }
    div[class*="image-gallery-thumbnails"] .swiper-slide {
      height: 71px!important;
    }
    div[class*="image-gallery-thumbnails"] {
      height: inherit !important;
    }
    div[class*="image-gallery-thumbnails"] {
      display: none;
    }
    div[class*="image-gallery-thumbnails"] .swiper-slide img {
      height: 70px !important;
      width: 70px !important;
      object-fit: contain !important;  
    }
    h2[class*="product-name-title"] {
      font-size: 16px;
      line-height: 18px;
      margin: 10px 0px 12px;
    }
    div[class*="product-main-class"] {
      gap: 10px;
      margin-top: 25px !important;
    }
    div[class*="product-brandname"] {
      font-size: 14px;
    }
    div[class*="coupon-display"] {
      width: 100%;
    }
    div[class*="coupon-container"],
    div[class*="copy-coupon"] {
      grid-template-columns: 20% 50% 30%;
      gap: 2px;
    }
    div[class*="copy-coupon"] {
      padding: 5px 13px 5px 13px;
      justify-content: space-between;
    }
    button[class*="see-all-btn"] {
      font-size: 10px;
      justify-content: center;
      gap: 5px;
      padding: 7px 16px;
    }
    button[class*="see-all-btn"] svg {
      height: 16px;
      width: 18px;
    }
    div[class*="percentage-off-display"], span[class*="coupon-code"] {
        padding: 4px 15px;
        font-size: 10px;
        font-weight: 400;
    }
    div[class*="BenefitBoxes"] div[class*="BenefitItem"] {
      font-size: 11px;
      padding: 8px 12px;
    }
    .product-page-breadcrumbs {
      display: none;
    }
    div[class*="BenefitBoxes"] {
      gap: 8px;
    } 
    p[class*="get-it-in"],
    div[class*="copy-coupon"] .use-code {
      font-size: 12px;
      line-height: 15px;
    }
    p[class*="coupon-text"],
    div[class*="copy-coupon"] .coupon-code {
      font-size: 10px;
      line-height: 14px;
    }
    div[class*="product-buttons-action"],
    div[class*="product-desc-main"] {
      margin-top: 20px;
    }
    h2[class*="related-title"] {
      margin-block: 20px !important;
    }
    div[class*="related_products_section"] .related-products-show .related-products {
      width: calc(100% /1.5);
      min-width: calc(100% /1.5);
    }
    div[class*="related_products_section"] .related-products-show {
      display: flex;
      flex-wrap: nowrap;
      overflow-x: scroll;
    }
    body div[class*="related_products_section"],
    body div[class*="related_products_section"].also-like-section {
      padding-inline: 15px 0 !important;
    }
    footer[class*="SiteFooter"] div[class*="DynamicWpFooter"] {
      margin-top: 0;
    }
    div[class*="attribute-display"] {
      padding: 5px 14px !important;
      font-size: 12px !important;
    }
    div[class*="size_guide"] {
      font-size: 16px;
    }
    h4[class*="available-coupons"] {
      margin-block: 18px;
      font-size: 16px;
    }
    div[class*="product_name_related"] {
      -webkit-line-clamp: 1!important;
      font-size: 14px !important;
    }
  }
  @media screen and (min-width: 320px) and (max-width: 390px) {
     div[class*="product-image-gallery"] {
      height: 450px;
    }
  }
  @media screen and (min-width: 390px) and (max-width: 520px) {
     div[class*="product-image-gallery"] {
      height: 500px;
    }
  }
  @media screen and (min-width: 767px) and (max-width: 992px) {
    footer[class*="SiteFooter"] div[class*="DynamicWpFooter"] img {
      height: 30px;
    }
    div[class*="product-main-class"] {
      flex-direction: column;
    }
    div[class*="product-image-gallery"],
    div[class*="product-desc-details"] {
      width: 100%;
    }
    div[class*="product-image-gallery"] {
      max-height: 400px;
    }
    div[class*="image-gallery-thumbnails"] {
      height: inherit !important;
    }
    div[class*="product-main-class"] {
      gap: 20px;
    }
    h2[class*="product-name-title"] {
      font-size: 24px;
      line-height: 28px;
      text-transform: uppercase;
    }
    div[class*="product-brandname"], div[class*="product-variants"] {
      text-transform: uppercase;
    }
    div[class*="related_products_section"] .related-products-show .related-products {
      width: calc(100% /3);
      min-width: 33%;
    }
    div[class*="related_products_section"] .related-products-show {
      flex-wrap: nowrap;
      overflow-x: scroll;
    }
    h2[class*="related-title"] {
      margin-block: 20px !important;
    }
    button[class*="see-all-btn"] {
      font-size: 16px;
      justify-content: center;
      gap: 5px;
    }
    button[class*="see-all-btn"]::after {
      background-size: 30px;
      height: 30px;
      width: 30px;
    }
    div[class*="percentage-off-display"] {
      font-size: 16px;
    }
  }
  @media screen and (min-width: 992px) and (max-width: 1440px) {
    div[class*="coupon-container"],
    div[class*="copy-coupon"] {
      grid-template-columns: 0.5fr 1fr .5fr;
    }
  }
`;

const WishlistPage = css`
  div[class*="wishlist-container"] h2 {
    color: #14181B;
    font-size: 24px;
  }
  div[class*="wishlist-container"] li[class*="wishlist-item"] {
    list-style: none;
  }
  div[class*="wishlist-container"] li[class*="wishlist-item"] a {
    text-decoration: none;
  }
  div[class*="wishlist-container"] li[class*="wishlist-item"] a h3 {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 20px;
    line-height: 20px;
    margin-block: 10px;
    color: #000;
  }
  div[class*="wishlist-container"] li[class*="wishlist-item"] p {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 18px;
    line-height: 20px;
    margin-block: 10px;
    color: rgb(20, 24, 27);
  }
  div[class*="wishlist-container"] li[class*="wishlist-item"] strong {
    font-family: "Roboto", sans-serif;
    font-weight: 600;
    font-size: 18px;
    line-height: 20px;
    color: #000;
  }
  div[class*="wishlist-container"] button[class*="remove-wishlist-button"] {
    background: transparent;
    color: red;
  }
  div[class*="wishlist-container"] div[class*="wishlist_action_container"] {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    padding-right: 20px;
  }
  div[class*="wishlist-container"] ul[class*="wishlist-list"] {
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    row-gap: 38px;
  }
  div[class*="wishlist-container"] ul[class*="wishlist-list"] li {
   width: calc(100% / 4);
   padding-inline: 0 20px;
   margin: 0;
   height: 100%;
  }
  div[class*="variant-select"] {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  @media (max-width: 767px) {
    div[class*="wishlist-container"] ul[class*="wishlist-list"] {
      justify-content: space-between;
    }
    div[class*="wishlist-container"] ul[class*="wishlist-list"] li {
      width: calc(100% / 2 - 10px);
      padding-inline: 0 0;
    }
    div[class*="wishlist-container"] ul[class*="wishlist-list"] li img {
      max-height: 150px;
      min-height: 150px;
    }
    div[class*="variant-select"] button {
      padding: 5px 8px !important;
      border-radius: 4px !important;
      font-size: 10px !important;
    }
    // div[class*="wishlist-container"] button[class*="add-to-cart-button"]::before {
    //   top: 70%;
    // }
    div[class*="wishlist-container"] li[class*="wishlist-item"] a h3 {
      font-size: 12px;
      line-height: 14px;
    }
    div[class*="wishlist-container"] li[class*="wishlist-item"] p {
      font-size: 14px;
      line-height: 16px;
    }
  }
  @media screen and (min-width: 767px) and (max-width: 992px) {
    div[class*="wishlist-container"] ul[class*="wishlist-list"] li {
      width: calc(100% / 3);
      height: 100%;
    }
    div[class*="shop_by_cat_display"] span[class*="woocommerce-Price-amount"] bdi {
      font-size: 12px !important;
    }
    // div[class*="wishlist-container"] button[class*="add-to-cart-button"]::before {
    //   top: 70%;
    // }
  }
`;

const CartDropdown = css`
  div[class*="CartDropdown"] {
    width: 550px;
    padding-inline: 20px;
  }
  span[class*="CartCount"],
  span[class*="WishlistCount"] {
    font-size: 14px;
    width: 22px;
    height: 22px;
    background: red;
    color: rgb(255, 255, 255);
  }
  div[class*="CartDropdown"] .cartItems {
    max-height: 300px;
    overflow-y: auto;
    scrollbar-color: #14181B #fff;
    scrollbar-width: thin;
    padding-right: 20px;
  }
  div[class*="CartDropdown"] div[class*="CartItem"] {
    align-items: center;
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
  }
  div[class*="CartItem"] a {
    text-decoration: none;
    font-size: 18px;
    color: rgb(20, 24, 27);
    font-family: "Roboto", sans-serif;
  }
  div[class*="product-price-display"],
  div[class*="taxes-note-display"] {
    font-size: 14px !important;
    font-family: "Roboto", sans-serif;
  }
  a[class*="StyledLink"] {
    font-family: "Roboto", sans-serif;
  }
  div[class*="taxes-note-display"] {
    margin-block: 15px;
  }
  div[class*="Subtotal"] {
    font-weight: 500;
    font-size: 14px;
  }
  div[class*="Subtotal"] {
    display: flex;
    justify-content: space-between;
    padding-top: 20px;
    font-family: "Roboto", sans-serif;
    flex-direction: column;
    gap: 10px;
  }
  div[class*="CheckoutNote"] {
    font-size: 14px;
    font-family: "Roboto", sans-serif;
  }
  div[class*="Subtotal"] br {
    display: none;
  }
  div[class*="taxes-note-display"] {
    margin-block: 15px;
  }
  div[class*="cartItemPrice"] {
    font-size: 14px;
  }
  img[class*="CartImage"] {
    width: 100px;
    height: 100px;
    object-fit: contain;
  }
  button[class*="RemoveButton"] {
    text-align: end;
    font-size: 24px;
  }
  @media (max-width: 767px) {
    div[class*="CartDropdown"] {
      width: 320px;
      right: -30px;
    }
    div[class*="CartItem"] {
      align-items: center;
      display: grid;
      grid-template-columns: .7fr 1.8fr .2fr;
    }
    img[class*="CartImage"] {
      width: 70px;
      height: 70px;
      padding-right: 10px;
    }
    div[class*="cartItemPrice"] {
      font-size: 12px;
    }
  }
  @media screen and (min-width: 767px ) and (max-width: 992px) {
    div[class*="CartDropdown"] {
      width: 350px;
    }
    div[class*="CartDropdown"] div[class*="CartItem"] {
      gap: 10px;
    }
    div[class*="cartItemPrice"] {
      font-size: 12px;
    }
  }
`;

const CartPage = css`
  div[class*="CartContainer"] {
    margin-top: 0;
  }
  .cartActions {
    display: flex;
    justify-content: flex-end;
    margin-block: 30px 0;
    gap: 20px;
  }
  div[class*="CartContainer"] div[class*="CartTotals"] {
    margin-block: 20px;
    font-family: "Roboto", sans-serif;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  div[class*="CartContainer"] div[class*="TotalAmount"] {
    font-size: 20px;
    font-weight: 600;
    margin-top: 0;
  }
  div[class*="CartContainer"] div[class*="CouponList"] ul {
    padding: 0;
    margin: 0;
  }
  div[class*="CartContainer"] div[class*="CouponList"] ul li div {
    font-size: 14px;
  }
  div[class*="CartContainer"] div[class*="CouponList"] ul li {
    list-style: none;
    margin: 0;
    padding: 0;
    border: 1px dashed rgb(204, 204, 204);
    padding: 20px 10px;
    font-family: "Roboto", sans-serif;
  }
  div[class*="CartContainer"] div[class*="CouponContainer"] input {
    border-color: #000;
  }
  div[class*="CartContainer"] div[class*="CouponContainer"] input,
  div[class*="CartContainer"] div[class*="CouponContainer"] button {
    padding: 12px 30px;
    border-radius: 4px;
    border-width: 1px;
    font-family: "Roboto", sans-serif;
    font-size: 16px;
    text-align: center;
  }
  div[class*="CartContainer"] div[class*="CartItem"] {
    align-items: center;
    position: relative;
  }
  div[class*="CartContainer"] div[class*="CartItem"] div[class*="ProductInfo"] {
    width: 80%;
    gap: 20px;
  }
  div[class*="CartContainer"] div[class*="CartItem"] div[class*="ProductInfo"] img {
    width: 100px;
    height: 100px;
  }
  div[class*="CartContainer"] div[class*="CartItem"] div[class*="ProductInfo"] .cart-products-display {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  div[class*="CartContainer"] div[class*="CartItem"] div[class*="ProductInfo"] .cart-products-display strong,
  div[class*="CartContainer"] div[class*="CartItem"] div[class*="ProductInfo"] .cart-products-display .cart-products-price,
  div[class*="CartContainer"] div[class*="CartItem"] div[class*="ProductInfo"] .cart-products-display button {
    font-family: "Roboto", sans-serif;
  }
  div[class*="CartContainer"] div[class*="CartItem"] div[class*="ProductInfo"] .cart-products-display button {
    margin-top: 0;
  }
  div[class*="CartContainer"] div[class*="CartItem"] div[class*="TotalPrice"] {
    width: 20%;
    text-align: end;
    font-size: 16px;
    font-family: "Roboto", sans-serif;
  }
  div[class*="CartContainer"] div {
    font-size: 14px;
  }
  div[class*="CartContainer"] strong,
  div[class*="CartContainer"] button,
  div[class*="CartContainer"] li,
  div[class*="CartContainer"] li strong div {
    font-size: 14px;
  }
  div[class*="CartContainer"] h2,
  div[class*="checkout-page"] h2,
  div[class*="CartContainer"] h4 {
    margin-top: 30px;
    font-family: "Roboto", sans-serif;
    font-size: 26px;
  }
  div[class*="CartHeader"] {
    font-family: "Roboto", sans-serif;
  }
  @media(max-width: 767px) {
    div[class*="CartItem"] {
      display: flex;
    }
    .cartActions {
      flex-direction: column;
    }
    div[class*="CartContainer"] div[class*="CartItem"] div[class*="ProductInfo"] {
      width: 80%;
    }
    div[class*="CartContainer"] div[class*="CartItem"] div[class*="TotalPrice"] {
      width: 20%;
    }
    div[class*="CartContainer"] div[class*="CouponContainer"] input {
      width: 60%;
    }
    div[class*="CartContainer"] div[class*="CouponContainer"] button {
      width: 40%;
    }
    div[class*="CartContainer"] div[class*="CouponContainer"] input,
    div[class*="CartContainer"] div[class*="CouponContainer"] button,
    div[class*="CartContainer"] div[class*="CouponList"] ul li {
      padding: 10px 15px;
      font-size: 11px;
    }
    div[class*="CartContainer"] div[class*="CouponList"] ul li div {
      font-size: 12px;
    }
    div[class*="CartContainer"] div[class*="CouponList"] h4 {
      font-size: 18px;
      margin-block: 20px;
    }
    div[class*="CartContainer"] div[class*="CartTotals"] {
      margin-block: 20px 0;
      gap: 10px;
    }
    div[class*="CartItem"] a {
      font-size: 13px;
    }
    div[class*="CheckoutNote"] {
      font-size: 11px;
    }
    div[class*="CartContainer"] div[class*="CartTotals"] div {
      font-size: 14px;
      margin-block: 8px;
    }
    div[class*="CartContainer"] h2 {
      margin-top: 0;
      font-size: 20px;
      margin-bottom: 10px;
    }
    div[class*="CartHeader"] div {
      font-size: 16px;
    }
    div[class*="CartContainer"] div[class*="CartItem"] div[class*="ProductInfo"] .cart-products-display strong, div[class*="CartContainer"] div[class*="CartItem"] div[class*="ProductInfo"] .cart-products-display .cart-products-price, div[class*="CartContainer"] div[class*="CartItem"] div[class*="ProductInfo"] .cart-products-display button {
      font-size: 14px;
    }
  }
`;

const CheckoutPage = css`
  div[class*="checkout-page"] {
    max-width: 1160px !important;
  }
  .error.fields {
    width: 50%;
  }
  div[class*="checkout-page"] .checkout-products {
    display: grid;
    width: 100%;
    grid-template-columns: 1.5fr 1.5fr 0.5fr;
  }
  div[class*="checkout-page"] .checkout_product_sale s {
    font-size: 13px;
    margin-right: 5px;
  }
  div[class*="checkout-page"] .checkout_product_price {
    font-size: 13px;
    font-family: "Roboto", sans-serif;
  }
  div[class*="checkout-page"] .checkout_product_sale span,
  div[class*="checkout-page"] .checkout_product_price_total {
    font-size: 16px;
    font-weight: 700;
  }
  div[class*="checkout-page"] .checkout_product_sale_total {
    font-size: 18px;
    font-weight: 700;
  }
  div[class*="CartContainer"] .cartActions a[class*="CheckoutButton"] {
    margin: 0;
    text-decoration: none;
  }
  div[class*="checkout-page"] .checkout-placeorder,
  div[class*="CartContainer"] a[class*="CheckoutButton"] {
    padding: 12px 50px;
    border-radius: 10px;
    font-family: Roboto, sans-serif;
    font-size: 18px;
    background: rgb(20, 24, 27);
    font-weight: bold;
    cursor: pointer;
    margin: 0px auto;
    display: flex;
    margin-block: 80px;
    color: rgb(204,204,204);
  }
  div[class*="checkout-page"] .payment-gateways p {
    font-size: 14px !important;
    padding-left: 20px;
    margin-top: 5px;
    margin-bottom: 0;
  }
  div[class*="checkout-page"] ul li img  {
    height: 300px!important;
    width: 300px!important;
  }
  div[class*="checkout-page"] ul li {
    margin: 0;
    border-top: none !important;
    align-items: center;
  }
  div[class*="checkout-page"] ul li .checkout-grandtotal{
    font-size: 20px;
    font-weight: 500;
  }
  div[class*="checkout-page"] ul {
    margin: 0;
  }
  div[class*="checkout-page"] .shipping-methods {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  div[class*="checkout-page"] p,
  div[class*="checkout-page"] span,
  div[class*="checkout-page"] div {
    font-family: "Roboto", sans-serif;
  }
  div[class*="checkout-page"] p,
  div[class*="checkout-page"] label {
    font-size: 14px;
  }
  div[class*="checkout-page"] h3 {
    font-size: 16px;
    font-family: "Roboto", sans-serif;
    margin-block: 40px 20px;
  }
  div[class*="checkout-page"] label {
    display: flex;
    margin-top: 15px;
    font-family: "Roboto", sans-serif;
    gap: 10px;
    align-items: center;
    margin: 0;
    cursor: pointer;
  }
  div[class*="checkout-page"] .shipping-address-form input,
  div[class*="checkout-page"] .shipping-address-form select {
    margin-block: 8px;
  }
  .custom-select {
    position: relative;
  }
  .custom-select select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }
  .custom-select::after {
    content: '▼'; 
    position: absolute;
    right: 10px; 
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    font-size: 1.8rem;
    color: rgb(204, 204, 204);
  }
  .shippingMethods, .payment-gateways {
    padding: 10px 15px;
    border-radius: 4px;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
    cursor: pointer;
  }
  .shippingMethods label {
    justify-content: space-between;
    flex-direction: row-reverse;
  }
  div[class*="checkout-page"] .shippingMethods label input[type="radio"]:checked {
    color: #14181b;
  }
  .payment-gateways label div {
    width: 97%;
  }
  .checkoutImage {
    display: flex;
    overflow-x: overlay;
    scrollbar-width: none;
  }
  .checkoutImage li {
    flex-direction: column;
    width: calc(33.33%);
    min-width: 33.33%;
  }
  .checkoutImage li span {
    background: silver;
    border-radius: 50%;
    font-size: 12px;
    color: #fff;
    display: flex;
    height: 35px;
    width: 35px;
    align-items: center;
    justify-content: center;
  }
  div[class*="checkout-page"] .shippingMethods label input,
  div[class*="checkout-page"] label input {
    height: 20px;
    width: 3% !important;
  }
  .custom-select-section {
    display: flex;
    gap: 20px;
  }
  .custom-select-section .custom-select {
    width: 100%;
    position: relative;
  }
  div[class*="checkout-page"] select {
    // width: 30% !important;
    margin-right: 20px;
  }
  div[class*="checkout-page"] input,
  form[class*="Form"] input,
  div[class*="checkout-page"] select {
    width: 100%;
    padding: 12px 30px;
    border-radius: 4px;
    border-width: 1px;
    font-family: "Roboto", sans-serif;
    font-size: 16px;
    background-color: transparent !important;
  }
  div[class*="checkout-page"] select {
    background: rgb(20, 24, 27) !important;
    color: rgb(204,204,204); !important;
  }
  .checkoutInputs {
    display: flex;
    gap: 20px;
  }
  .sameAddress {
    margin-top: 20px;
  }
  @media(max-width: 767px) {
    div[class*="checkout-page"] ul li img {
      height: 110px!important;
      width: 110px!important;
      margin-right: 10px!important;
      object-fit: cover !important;
    }    
    .error.fields {
      width: 100% !important;
    }
    div[class*="checkout-page"] h3 {
      font-size: 18px;
      margin-block: 20px;
    }
    div[class*="checkout-page"] h3.shipping-address {
      margin-block: 15px;
    }
    div[class*="checkout-page"] .payment-gateways p {
      font-size: 12px !important;
    }
    .sameAddress {
      margin-top: 10px;
    }
    div[class*="checkout-page"] ul li span,
    div[class*="checkout-page"] ul li p {
      font-size: 14px;
    }
    div[class*="checkout-page"] ul li .checkout-grandtotal {
      font-size: 20px;
    }
    div[class*="checkout-page"] input, form[class*="Form"] input, div[class*="checkout-page"] select {
      padding: 10px 20px;
      border-radius: 4px;
    }
    div[class*="checkout-page"] p,
    div[class*="checkout-page"] label {
      font-size: 14px;
    }
    .checkoutInputs, .custom-select-section {
      display: block;
    }
    div[class*="checkout-page"] .checkout-products {
      grid-template-columns: 1.5fr 1.5fr 0.5fr;
      gap: 8px;
    }
    div[class*="checkout-page"] .checkout-placeorder,
    div[class*="CartContainer"] a[class*="CheckoutButton"] {
      margin-block: 40px 10px;
      font-size: 14px;
      justify-content: center;
    }
    div[class*="checkout-page"] select {
      width: 100% !important;
      margin-right: 0;
    }
    div[class*="checkout-page"] {
      padding-inline: 15px !important;
    }
    .checkoutHeading {
      margin-top: 0px;
      font-size: 20px;
    }
    div[class*="checkout-page"] .shippingMethods label input, div[class*="checkout-page"] label input {
      width: 5% !important;
    }
  }
  @media screen and (min-width: 767px) and (max-width: 992px) {
    div[class*="checkout-page"] select {
      margin-right: 0 !important;
    }
    div[class*="checkout-page"] select[name="country"] {
      margin-right: 10px !important;
    } 
    div[class*="checkout-page"] {
      padding-inline: 25px!important;
    }
    div[class*="checkout-page"] .checkout-placeorder,
    div[class*="CartContainer"] a[class*="CheckoutButton"] {
      margin-block: 40px;
    }
    div[class*="checkout-page"] h3 {
      font-size: 24px;
    }
    div[class*="checkout-page"] p {
      font-size: 16px;
    }
    .checkoutHeading {
      font-size: 30px;
      margin-block: 10px 0;
    }
  }
`;

const LoginPage = css`
  form[class*="Form"] button {
    padding: 12px 80px;
    border-radius: 4px;
    font-family: "Roboto", sans-serif;
    font-size: 18px;
    background: rgb(20, 24, 27);
    font-weight: 500;
    cursor: pointer;
    margin: 0px auto;
    display: flex;
    margin-block: 30px;
    color: #fff;
  }
  form[class*="Form"] .register-account {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  form[class*="Form"] h3 {
    text-align: center;
  }
  form[class*="Form"] h3,
  form[class*="Form"] button,
  form[class*="Form"] input,
  form[class*="Form"] span,
  form[class*="Form"] h3{
    font-family: "Roboto", sans-serif;
  }
`;

const MyAccountPage = css`
  .thirdLogin {
    display: grid;
    grid-template-columns: 50% 50%;
    align-items: center;
  }
  .thirdLogin span {
    text-decoration: underline;
    margin-bottom: 5px;
    cursor: pointer;
    font-size: 14px;
  }
  div[class*="AccountDashboard"] {
    display: grid;
    grid-template-columns: 25% 75%;
  }
  .mobileInput {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
  }
  .mobileInput span {
    position: absolute;
    height: 100%;
    padding-inline: 12px;
    display: flex;
    background: linear-gradient(135deg, rgb(9, 12, 14), rgb(126, 142, 154));
    align-items: center;
    color: #fff;
  }
  div[class*="AccountDashboard"] div[class*="Content"] {
    padding: 30px 40px;
  }
  div[class*="AccountDashboard"] div[class*="Content"] h4 {
    margin: 0px 0 25px 0 !important;
    font-family: "Roboto", sans-serif;
    font-size: 40px;
  }
  div[class*="AccountDashboard"] div[class*="Content"] .content_text {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 20px;
    line-height: 14px;
  }
  div[class*="AccountDashboard"] div[class*="Content"] .AccountDetails input {
    width: 100%;
    padding: 12px 30px;
    border-radius: 4px;
    border-width: 1px;
    font-family: "Roboto", sans-serif;
    font-size: 16px;
    background-color: transparent!important;
    margin-bottom: 20px;
  }
  div[class*="AccountDashboard"] div[class*="Content"] .AccountDetails label {
    display: block;
    font-family: "Roboto", sans-serif;
    font-size: 16px;
    margin-bottom: 10px;
  }
  div[class*="AccountDashboard"] div[class*="Content"] .AccountDetails .inputContainer {
    display: grid;
    grid-template-columns: 50% 50%;
  }
  div[class*="AccountDashboard"] div[class*="Content"] .AccountDetails .inputContainer div:first-child {
    padding-right: 15px;
  }
  div[class*="AccountDashboard"] div[class*="Content"] .AccountDetails .savebtn {
    background: #14181B;
    color: #FFFFFF;
    padding: 13px 65px;
    border-radius: 5px;
    cursor: pointer;
    margin-block: 30px;
  }
  .accountOrderContainer {
    overflow-y: auto;
  }
  @media(max-width: 767px) {
    div[class*="AccountDashboard"] {
      grid-template-columns: 100%;
    }
    .thirdLogin {
      grid-template-columns: 1fr;
      row-gap: 9px;
    }
    div[class*="AccountDashboard"] div[class*="Tabs"] {
      margin-right: 0 !important;
      padding: 10px;
    }
    div[class*="AccountDashboard"] div[class*="Tabs"] button[class*="Tab"] {
      padding: 10px 15px;
    }
    div[class*="AccountDashboard"] div[class*="Content"] .AccountDetails .inputContainer {
      grid-template-columns: 100%;
    }
    div[class*="AccountDashboard"] div[class*="Content"] .content_text {
      line-height: 30px;
    }
    div[class*="AccountDashboard"] div[class*="Content"] {
      padding: 30px 15px;
      margin: 10px;
    }
    div[class*="AccountDashboard"] div[class*="Content"] .AccountDetails input {
      margin-bottom: 10px;
    }
    div[class*="AccountDashboard"] div[class*="Content"] .AccountDetails label {
      margin-bottom: 5px;
    }
    div[class*="AccountDashboard"] div[class*="Content"] .AccountDetails .inputContainer div:first-child {
      padding-right: 10px;
    }
    div[class*="AccountDashboard"] div[class*="Content"] .AccountDetails .savebtn {
      margin-block: 30px 0;
    }
  }
  @media screen and (min-width: 767px) and (max-width: 992px) {
    div[class*="AccountDashboard"] {
        grid-template-columns: 35% 65%;
    }
  }
`;
const ThankYouPage = css`
  .thankYouWrapper .thankYouHeading {
    font-family: "Roboto", sans-serif;
    font-size: 30px;
    margin-block: 30px;
  }
  .thankYouWrapper p {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 16px;
    line-height: 32px;
  }
  .thankYouWrapper .orderGrid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 30px;
    margin: 0;
  }
  .thankYouWrapper .orderGrid li {
    margin: 0;
    list-style: none;
    max-width: 322px;
  }
  .thankYouWrapper .orderGrid li img {
    height: auto;
    width: auto;
    aspect-ratio: 4/5;
  }
  .imageContainer {
    align-items: center;
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }
  .thankYouWrapper .orderGrid li p {
    margin: 0;
    display: -webkit-box!important;
    -webkit-line-clamp: 1!important;
    -webkit-box-orient: vertical!important;
    overflow: hidden!important;
    text-overflow: ellipsis!important;
  }    
  @media (max-width: 767px) {
    .thankYouWrapper .orderGrid {
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }
    .thankYouWrapper .orderGrid li img {
      max-height: 150px;
      min-height: 150px;
    }
    .thankYouWrapper .thankYouHeading {
      font-size: 20px;
      margin-block: 20px;
    }
    .thankYouWrapper p {
      font-size: 14px;
      line-height: 26px;
    }
    .imageContainer {
      height: unset;
    }
  }
  @media screen and (min-width: 767px) and (max-width: 1024px) {
    .thankYouWrapper .orderGrid {
      grid-template-columns: repeat(3, 1fr);
    }
    .thankYouWrapper .orderGrid li img {
      max-height: 200px;
      min-height: 200px;
    }
    .imageContainer {
      height: unset;
    }
  }
`;

const MyAccountOrder = css`
  th, td {
    font-family: "Roboto", sans-serif;
  }
  .orderTable .viewBtn {
    background: rgb(20, 24, 27);
    padding: 5px 15px;
    color: #fff;
    font-family: "Roboto", sans-serif;
    font-size: 16px;
    border-radius: 4px;
    cursor: pointer;
  }
  @media (max-width: 992px) {
    .orderTable {
      margin: 0;
    }
  }
`;

const FriendsPage = css`
  .loaderContainer div[class*="Container"] {
    height: auto;
  }
  @media screen and (min-width: 767px) and (max-width: 992px) {
    .productSec {
      width: calc(100% / 3) !important;
      min-width: calc(100% / 3) !important;
    }
  }
`

const ViewAllPage = css`
/* Skeleton Loading Animation Styles */

/* Skeleton shimmer animation */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

/* Base skeleton styling */
.skeleton-card {
  pointer-events: none;
  opacity: 0.7;
}

.skeleton-image {
  width: 100%;
  height: 200px; /* Adjust based on your product image height */
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 37%,
    #f0f0f0 63%
  );
  background-size: 400px 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 4px;
}

.skeleton-text {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 37%,
    #f0f0f0 63%
  );
  background-size: 400px 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-brand {
  height: 14px;
  width: 60%;
}

.skeleton-name {
  height: 16px;
  width: 90%;
}

.skeleton-price {
  height: 18px;
  width: 50%;
}

.skeleton-button {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 37%,
    #f0f0f0 63%
  );
  background-size: 400px 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-cart-btn {
  height: 40px;
  width: 100%;
  margin-bottom: 8px;
}

.skeleton-wishlist-btn {
  height: 36px;
  width: 100%;
}

/* Loading more text styling */
.loading-more {
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 14px;
}

/* Fade in animation for new products */
.product-card {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dark theme skeleton (optional) */
@media (prefers-color-scheme: dark) {
  .skeleton-image,
  .skeleton-text,
  .skeleton-button {
    background: linear-gradient(
      90deg,
      #2a2a2a 25%,
      #3a3a3a 37%,
      #2a2a2a 63%
    );
  }
}
  .category-sort-bar {
  display: flex;
  justify-content: center;
  margin: 15px 0;
  gap: 20px;
}

.sort-btn {
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  color: #555;
}

.sort-btn.active {
  color: #000;
  border-bottom: 2px solid #000;
}

`;

// Add this to your global styles array
const globalStyle = (colors) =>
  css([
    cssReset,
    documentSetup(colors),
    accessibilitySettings,
    elementBase(colors),
    elementBase700,
    elementBase1220,
    listStyle,
    quoteStyle(colors),
    codeStyle(colors),
    mediaStyle(colors),
    tableStyles(colors),
    headerPageStyle,
    PostArticle,
    BannerSection,
    PageWidth,
    BrandsTopsSection,
    BestSeller,
    ShopBySections,
    ShopByCategories,
    Footer,
    CategoryPage,
    ProductPage,
    WishlistPage,
    CartDropdown,
    CartPage,
    CheckoutPage,
    LoginPage,
    MyAccountPage,
    ThankYouPage,
    MyAccountOrder,
    FriendsPage,
    ViewAllPage,
  ]);

export default globalStyle;
