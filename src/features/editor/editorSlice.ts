import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { get, getDatabase, push, ref, remove, update } from "firebase/database";

import { RootState } from "../../app/store";

export interface FormField {
  id: string;
  name: string;
  required: boolean;
  type: "text" | "number";
  value: string;
}

interface EditorState {
  id: string;
  fields: FormField[];
  status: "idle" | "loading" | "failed";
}

const initialState: EditorState = {
  id: "",
  fields: [],
  status: "idle",
};

interface SaveOptions extends FormField {
  formId: string;
}

export const saveFieldAsync = createAsyncThunk(
  "editor/save",
  async ({ formId, id, name, required, type, value }: SaveOptions) => {
    const db = getDatabase();
    const formRef = ref(db, `forms/${formId}/fields/${id}`);
    const updates = {
      name,
      required,
      type,
      value,
    };
    await update(formRef, updates);

    return { ...updates, id };
  }
);

export const addFieldAsync = createAsyncThunk(
  "editor/add",
  async ({ formId, name, required, type, value }: SaveOptions) => {
    const db = getDatabase();
    const formRef = ref(db, `forms/${formId}/fields/`);
    const field = {
      name,
      required,
      type,
      value,
    };
    const fieldData = await push(formRef, field);
    const newField: FormField = {
      id: fieldData.key!,
      name,
      required,
      type,
      value,
    };
    console.log("new field", newField);
    return newField;
  }
);

export const deleteFieldAsync = createAsyncThunk(
  "editor/delete",
  async ({ formId, fieldId }: { formId: string; fieldId: string }) => {
    const db = getDatabase();
    const fieldRef = ref(db, `forms/${formId}/fields/${fieldId}`);
    await remove(fieldRef);
    return fieldId;
  }
);

export const getFieldsAsync = createAsyncThunk("editor/all", async (formId: string) => {
  const db = getDatabase();
  const formRef = ref(db, `forms/${formId}/fields/`);
  const fields = await get(formRef);
  return fields.val();
});

export const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    reset: (state) => {
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFieldsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getFieldsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        console.log(action.payload);
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
        console.log(fieldsFromServer);
        state.fields = fieldsFromServer;
      })
      .addCase(getFieldsAsync.rejected, (state) => {
        state.status = "failed";
      });

    builder
      .addCase(addFieldAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addFieldAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.fields = state.fields.concat(action.payload);
      })
      .addCase(addFieldAsync.rejected, (state) => {
        state.status = "failed";
      });

    builder
      .addCase(saveFieldAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveFieldAsync.fulfilled, (state, action) => {
        state.status = "idle";
        let fieldIndex = state.fields.findIndex((x) => x.id === action.payload.id);
        state.fields[fieldIndex] = action.payload;
      })
      .addCase(saveFieldAsync.rejected, (state) => {
        state.status = "failed";
      });

    builder.addCase(deleteFieldAsync.fulfilled, (state, action) => {
      let fieldIndex = state.fields.findIndex((x) => x.id === action.payload);
      state.fields.splice(fieldIndex, 1);
    });
  },
});

export const { reset } = editorSlice.actions;

export const selectFields = (state: RootState) => state.editor.fields;
export const selectFieldsLoading = (state: RootState) => state.editor.status;

export default editorSlice.reducer;
