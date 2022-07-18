import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { get, getDatabase, ref } from "firebase/database";

import { RootState } from "../../app/store";

interface FormData {
  name: string;
  id: string;
}

interface FeedState {
  forms: FormData[];
  status: "idle" | "loading" | "failed";
}

const initialState: FeedState = {
  forms: [],
  status: "idle",
};

export const loadFormsAsync = createAsyncThunk("feed/load", async () => {
  const db = getDatabase();
  const formRef = ref(db, "forms");
  const forms = await get(formRef);
  return forms.val();
});

export const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    formAdded: (state, action) => {
      state.forms = state.forms.concat(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFormsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadFormsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const formsFromServer = [];
        for (const key in action.payload) {
          const f = {
            id: key,
            name: action.payload[key].name,
          };
          formsFromServer.push(f);
        }
        state.forms = formsFromServer;
      })
      .addCase(loadFormsAsync.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { formAdded } = feedSlice.actions;

export const selectForms = (state: RootState) => state.feed.forms;

export default feedSlice.reducer;
