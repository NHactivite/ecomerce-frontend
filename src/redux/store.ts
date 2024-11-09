import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { couponApi } from "./api/couponApi";
import { dashboardApi } from "./api/dashboardAPI";
import { orderApi } from "./api/orderAPI";
import { productAPI } from "./api/productAPI";
import { userAPI } from "./api/userAPI";
import { cartReducer } from "./reducer/cartReducer";
import { darkReducer } from "./reducer/darkReducer";
import { userReducer } from "./reducer/userReducer";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
export const server =import.meta.env.VITE_SERVER;

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["cartReducer","darkReducer"], // Only persist cartReducer, or add other reducers if needed
  };
  // Combine reducers
const rootReducer = combineReducers({
    [userAPI.reducerPath]: userAPI.reducer,
    [productAPI.reducerPath]: productAPI.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [couponApi.reducerPath]: couponApi.reducer,
    [userReducer.name]: userReducer.reducer,
    [cartReducer.name]: cartReducer.reducer,
    [darkReducer.name]: darkReducer.reducer,
  });

  // Persist the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store=configureStore({
    reducer:persistedReducer,
    middleware:( getDefaultMiddleware)=> getDefaultMiddleware({serializableCheck: false,}).concat(userAPI.middleware,productAPI.middleware,orderApi.middleware,dashboardApi.middleware,couponApi.middleware),
});

export const persistor = persistStore(store);