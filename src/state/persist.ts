// persistConfig.js
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // You can choose the storage type (e.g., localStorage)

const persistConfig = {
   key: "root", // The key to use for storing data in storage
   storage, // The storage engine to use
   whitelist: ["authSlice"], // List of reducers to persist (in this case, 'authSlice')
};

export default persistConfig;
