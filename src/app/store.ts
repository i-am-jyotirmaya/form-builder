import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";

import editorSlice from "../features/editor/editorSlice";
import feedReducer from "../features/feed/feedSlice";
import viewerReducer from "../features/Viewer/viewerSlice";

export const store = configureStore({
  reducer: {
    feed: feedReducer,
    editor: editorSlice,
    viewer: viewerReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
