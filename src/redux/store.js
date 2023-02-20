import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { activeTabSlice } from './'

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import localStorage from "redux-persist/es/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage: localStorage,
};
const reducer = combineReducers({
  activeTab: activeTabSlice
})
const persistedReducer = persistReducer(persistConfig, reducer);
const configureAppStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat([]),
  });
};
export default configureAppStore;
