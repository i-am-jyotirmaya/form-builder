import { Sheet } from "@mui/joy";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import EditorItem from "../../components/EditorItem";
import { FormField, getFieldsAsync, reset, selectFields, selectFieldsLoading } from "./editorSlice";

const Editor = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const formId = params.formId as string;

  useEffect(() => {
    dispatch(reset());
    dispatch(getFieldsAsync(formId));
  }, []);

  const fields: FormField[] = useAppSelector(selectFields) ?? [];
  const loading = useAppSelector(selectFieldsLoading);
  return (
    <Sheet
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {loading === "loading"
        ? "Loading"
        : fields.map((e, i) => (
            <EditorItem
              formId={formId}
              index={i}
              data={{
                fieldName: e.name,
                isRequired: e.required,
                type: e.type,
                value: e.value,
              }}
              fieldId={e.id}
              key={e.id}
            />
          ))}
      <EditorItem formId={formId} isNew={true} index={0} />
    </Sheet>
  );
};

export default Editor;
