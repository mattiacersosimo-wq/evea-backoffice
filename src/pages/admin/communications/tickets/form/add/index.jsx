import React from "react";
import Form from "../components/form";
import useAddTicket from "./hooks/useAddTicket";

const AddForm = () => {
  const { methods, onSubmit } = useAddTicket();

  return (
    <Form
      buttonLabel="help_center.form.add"
      methods={methods}
      onSubmit={onSubmit}
    />
  );
};

export default AddForm;
