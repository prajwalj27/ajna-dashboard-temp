import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";

import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "../reducers";
import storage from "redux-persist/lib/storage";
const middleware = [thunk];

const persistConfig = {
  key: "root",
  storage: storage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(
  persistedReducer,
  {},
  process.env.REACT_APP_STAGE == "dev"
    ? composeWithDevTools(applyMiddleware(...middleware))
    : applyMiddleware(...middleware)
);
export const persistor = persistStore(store);
