import { Button, Input, Sheet } from "@mui/joy";
import { Field, FieldInputProps, FieldMetaProps, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import * as Yup from "yup";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { camelize } from "../../utils/utils";
import { FormField, getFieldsAsync, selectFields, selectFieldsLoading } from "./viewerSlice";

interface InputProps<T> {
  field: FieldInputProps<T>;
  form: any;
  meta: FieldMetaProps<T>;
}

const Viewer = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const formId = params.formId as string;

  const [values, setValues] = useState({});

  useEffect(() => {
    dispatch(getFieldsAsync(formId));
  }, []);

  const fields: FormField[] = useAppSelector(selectFields) ?? [];
  const loading = useAppSelector(selectFieldsLoading);

  const initialValues: { [key: string]: any } = {};

  const validationSchema: { [key: string]: any } = {};

  const preparedFields = fields.map(({ id, name, required, type, value }) => {
    const convertedName = camelize(name);
    const idName = convertedName;
    initialValues[idName] = value;
    if (type === "text") {
      if (required) validationSchema[idName] = Yup.string().required("This field is required!");
      else validationSchema[idName] = Yup.string();
    } else {
      if (required) validationSchema[idName] = Yup.number().required("This field is required!");
      else Yup.number();
    }

    return { name, required, type, value, idName };
  });

  const handleFormSubmit = (values: any) => {
    console.log("Form submitted. Values: " + values);
  };

  return (
    <Sheet>
      {Object.keys(initialValues).length && (
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object(validationSchema)}
          onSubmit={handleFormSubmit}
          validateOnBlur={true}
        >
          <Form>
            {preparedFields.map((e) => {
              const id = uuid();
              return (
                <React.Fragment key={id}>
                  <div style={{ margin: "5px 10px" }}>
                    <label htmlFor={id}>{e.name}</label>
                    <Field name={e.idName}>
                      {({ field, form, meta }: InputProps<any>) => {
                        return (
                          <>
                            <Input
                              error={!!meta.error}
                              variant="soft"
                              type={e.type}
                              placeholder="Enter something..."
                              {...field}
                            />
                            {meta.error && <span style={{ fontSize: "0.7rem", color: "red" }}>{meta.error}</span>}
                          </>
                        );
                      }}
                    </Field>
                  </div>
                </React.Fragment>
              );
            })}
            <Button sx={{ marginLeft: "10px" }} type="submit">
              Submit
            </Button>
          </Form>
        </Formik>
      )}
    </Sheet>
  );
};

export default Viewer;
