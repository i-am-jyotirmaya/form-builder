import { Add, Delete, Done, Edit } from "@mui/icons-material";
import { Button, Checkbox, Chip, Input, Sheet } from "@mui/joy";
import IconButton from "@mui/joy/IconButton";
import { getDatabase, ref, set } from "firebase/database";
import { Field, FieldInputProps, FieldMetaProps, Form, Formik } from "formik";
import { useState } from "react";

import { useAppDispatch } from "../app/hooks";
import { addFieldAsync, deleteFieldAsync, saveFieldAsync } from "../features/editor/editorSlice";
import styles from "./EditorItem.module.css";
import SelectField from "./SelectField";

interface FormValues {
  fieldName: string;
  type: string;
  isRequired: boolean;
  value: string;
}

interface InputProps<T> {
  field: FieldInputProps<T>;
  form: any;
  meta: FieldMetaProps<T>;
}

interface IProps {
  index: number;
  fieldId?: string;
  formId: string;
  data?: FormValues;
  isNew?: boolean;
}

const EditorItem: React.FC<IProps> = ({ index, fieldId, formId, data, isNew = false }) => {
  const dispatch = useAppDispatch();
  const options = [
    { value: "text", label: "Text" },
    { value: "number", label: "Number" },
  ];

  const [isEditMode, setEditMode] = useState(false);

  const disabled = !isNew && !isEditMode;

  const handleFormSubmit = (values: FormValues) => {
    if (isNew) {
      dispatch(
        addFieldAsync({
          formId,
          id: "",
          name: values.fieldName,
          required: values.isRequired,
          type: values.type as any,
          value: values.value,
        })
      );
    } else {
      dispatch(
        saveFieldAsync({
          formId,
          id: fieldId!,
          name: values.fieldName,
          required: values.isRequired,
          type: values.type as any,
          value: values.value,
        })
      );
    }
  };

  const initialValuesNew = {
    fieldName: "",
    type: "string",
    isRequired: false,
    value: "",
  };

  const initialValuesExt = {
    ...data,
  };

  return (
    <Sheet
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "2.5rem",
      }}
    >
      <div className={styles.chipHolder}>
        <Chip variant="soft" color="primary">
          {isNew ? <Add /> : index + 1}
        </Chip>
      </div>
      <Formik
        initialValues={isNew ? initialValuesNew : initialValuesExt}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          handleFormSubmit(values as FormValues);
          resetForm();
        }}
      >
        <Form className={styles.editorForm}>
          <Field name="fieldName">
            {({ field, form, meta }: InputProps<string>) => (
              <Input variant="soft" placeholder="Field Name" {...field} disabled={disabled} />
            )}
          </Field>
          <Field name="type" component={SelectField} options={options} disabled={disabled} />
          <Field name="isRequired">
            {({ field, form, meta }: InputProps<boolean>) => (
              <Checkbox variant="soft" label="Required" checked={field.value} {...field} disabled={disabled} />
            )}
          </Field>
          <Field name="value" placeholder="Value">
            {({ field, form, meta }: InputProps<string>) => (
              <Input variant="soft" placeholder="Value" type={form.values.type} {...field} disabled={disabled} />
            )}
          </Field>
          {disabled && (
            <IconButton
              title="Edit field"
              variant="soft"
              onClick={(e) => {
                setEditMode(true);
              }}
            >
              <Edit />
            </IconButton>
          )}
          {!isNew && (
            <IconButton
              title="Delete field"
              variant="soft"
              onClick={(e) => {
                dispatch(deleteFieldAsync({ formId, fieldId: fieldId as string }));
              }}
            >
              <Delete />
            </IconButton>
          )}
          {!disabled && (
            <IconButton title="Save field" variant="soft" type="submit">
              <Done />
            </IconButton>
          )}
        </Form>
      </Formik>
    </Sheet>
  );
};

export default EditorItem;
