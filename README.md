src/
├── assets/                     # Static assets (images, icons, etc.)
├── components/
│   ├── common/                 # Shared components (Header, Footer, etc.)
│   ├── homepage/               # Homepage-specific components
│   ├── products/               # Product listing and details components
│   ├── cart/                   # Cart components
│   ├── checkout/               # Checkout components
│   ├── dashboard/              # Seller and Buyer dashboard components
│   └── auth/                   # Registration and login components
├── containers/
│   ├── HomeContainer.js        # Homepage data fetching and logic
│   ├── ProductContainer.js     # Product listing and sorting
│   └── DashboardContainer.js   # Buyer/Seller dashboard logic
├── pages/                      # Page-level components for routes
│   ├── HomePage.js
│   ├── ProductPage.js
│   ├── CartPage.js
│   ├── CheckoutPage.js
│   ├── SellerDashboard.js
│   ├── BuyerDashboard.js
│   ├── ContactPage.js
│   ├── FAQPage.js
│   ├── AboutPage.js
│   └── SupportPage.js
├── services/                   # API services for backend interaction
│   ├── productService.js
│   ├── userService.js
│   └── orderService.js
├── store/                      # Redux store
│   ├── slices/                 # Redux slices
│   ├── actions.js
│   ├── reducers.js
│   └── store.js
├── utils/                      # Utility functions (validation, formatting, etc.)
├── App.js                      # Main app component
└── index.js                    # Entry point
