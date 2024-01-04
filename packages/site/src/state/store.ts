import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Middleware } from "redux";
import { persistStore } from "redux-persist";

import { globalSlice } from "./global/slice";
import { snapSlice } from "./snap/slice";

const rootReducer = combineReducers({
  global: globalSlice.reducer,
  snap: snapSlice.reducer,
});

// 使用persistReducer强化reducer,persistReducer(config, reducer)
// const persistedReducer = persistReducer(persistConfig, rootReducer);

const middlewares: Array<Middleware> = [];

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(middlewares),
});

const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default { store, persistor };
