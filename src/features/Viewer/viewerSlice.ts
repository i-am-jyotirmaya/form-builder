import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { get, getDatabase, ref } from "firebase/database";

import { RootState } from "../../app/store";

export interface FormField {
  id: string;
  name: string;
  required: boolean;
  type: "text" | "number";
  value: string;
}

interface ViewerState {
  fields: FormField[];
  status: "idle" | "loading" | "failed";
}

const initialState: ViewerState = {
  fields: [],
  status: "idle",
};

export const getFieldsAsync = createAsyncThunk("viewer/all", async (formId: string) => {
  const db = getDatabase();
  const formRef = ref(db, `forms/${formId}/fields/`);
  const fields = await get(formRef);
  return fields.val();
});

export const viewerSlice = createSlice({
  name: "viewer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFieldsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getFieldsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const fieldsFromServer = [];
        for (const key in action.payload) {
          const f: FormField = {
            id: key,
            name: action.payload[key].name,
            required: action.payload[key].required,
            type: action.payload[key].type,
            value: action.payload[key].value,
          };
          fieldsFromServer.push(f);
        }
        state.fields = fieldsFromServer;
      })
      .addCase(getFieldsAsync.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const selectFields = (state: RootState) => state.viewer.fields;
export const selectFieldsLoading = (state: RootState) => state.viewer.status;

export default viewerSlice.reducer;
