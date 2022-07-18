import { Done } from "@mui/icons-material";
import { Input } from "@mui/joy";
import IconButton from "@mui/joy/IconButton";
import { getDatabase, push, ref, set } from "firebase/database";
import { Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const BuildFormInput = () => {
  const navigate = useNavigate();

  const handleFormSubmit = async (values: { formName: string }) => {
    const db = getDatabase();
    const formRef = ref(db, "forms");
    const newFormRef = push(formRef);

    await set(newFormRef, {
      name: values.formName,
      fields: [],
    });

    const formId = newFormRef.key;
    navigate(`/forms/${formId}`);
  };
  return (
    <Formik
      initialValues={{
        formName: "",
      }}
      validationSchema={Yup.object({
        formName: Yup.string().required("Name is required!"),
      })}
      validateOnBlur={true}
      onSubmit={handleFormSubmit}
    >
      <Form
        style={{
          display: "flex",
          gap: 16,
        }}
      >
        <Field name="formName">
          {({ field, form, meta }: any) => (
            <Input error={!!meta.error} variant="soft" placeholder="Form Name" {...field} />
          )}
        </Field>
        <IconButton type="submit">
          <Done />
        </IconButton>
      </Form>
    </Formik>
  );
};

export default BuildFormInput;
