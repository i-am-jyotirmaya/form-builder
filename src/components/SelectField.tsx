import { FieldProps } from "formik";
import React from "react";
import Select, { SingleValue } from "react-select";

type Option = {
  label: string;
  value: string;
};

export const SelectField: React.FC<
  { label: string; options: Array<{ value: string; label: string }>; disabled: boolean } & FieldProps
> = ({ options, disabled, field, form }) => (
  <Select
    styles={{
      container: () => ({
        minWidth: 150,
      }),
    }}
    options={options}
    name={field.name}
    value={options ? options.find((option) => option.value === field.value) : ""}
    onChange={(option: SingleValue<string | Option>) => form.setFieldValue(field.name, (option as Option).value)}
    onBlur={field.onBlur}
    isDisabled={disabled}
  />
);

export default SelectField;
