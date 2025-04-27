import { createStore, combineReducers, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk'; 
import { composeWithDevTools } from 'redux-devtools-extension';
import { userLoginReducer, userReducer, forgotPasswordReducer, resetPasswordReducer } from './reducers/userReducer'; 
import storeReducer, { ProductsByReducer, storeListReducer, storeSalesReducer, storeDetailsReducer, blacklistProductsReducer, emailReducer, storeEmailReducer, } from './reducers/storeReducer';
import { documentReducer, uploadDocumentReducer } from './reducers/documentReducer'; 
import AllUserReducer from './reducers/AllUserReducer';
import categoryReducer from './reducers/categoryReducer';
import productDeleteReducer, { addProductReducer, allProductsReducer , productReducer, 
       storeProductsReducer, updateProductReducer } from './reducers/productReducer';
import adReducer from './reducers/adReducer';
import { packageReducer } from './reducers/packageReducer';
import { allOrdersReducer, orderCreateReducer, orderStatusReducer, storeOrdersReducer, userOrdersReducer } from './reducers/orderReducer';
import { getSingleOrderReducer } from './reducers/order';
import { reviewReducer } from './reducers/reviewReducer'
import { emailVerificationReducer, verifyReducer } from './reducers/verifyReducer';
import blacklistReducer, {} from './reducers/blacklistReducer'

const rootReducer = combineReducers({
  SingleproductDetails: productReducer,
  ProductsByReducer: ProductsByReducer,
  storeProducts: storeProductsReducer,
  productUpdate: updateProductReducer,
  deleteProduct: productDeleteReducer,
  categoryForStore: categoryReducer,
  allProducts: allProductsReducer,
  productAdd: addProductReducer,
  userLogin: userLoginReducer,
  categories: categoryReducer,
  storeList: storeListReducer,
  documents: documentReducer, 
  package: packageReducer,
  users: AllUserReducer,
  store: storeReducer,
  adData: adReducer,
  user: userReducer,
  orderCreate: orderCreateReducer,
  userOrders: userOrdersReducer,
  storeOrders: storeOrdersReducer,
  orderStatus: orderStatusReducer,
  allOrders: allOrdersReducer,
  singleOrder: getSingleOrderReducer,
  forgotPassword: forgotPasswordReducer,
  resetPassword: resetPasswordReducer,
  storeSales: storeSalesReducer,
  storeDetails: storeDetailsReducer,
  uploadDocumentStatus: uploadDocumentReducer,
  review: reviewReducer,
  blacklistProducts: blacklistProductsReducer,
  verify:verifyReducer,
  emailVerification: emailVerificationReducer,
  emailRecovery:emailReducer,
  storeEmailVerification: storeEmailReducer,
  blacklist: blacklistReducer,
});

const initialState = {};

const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
