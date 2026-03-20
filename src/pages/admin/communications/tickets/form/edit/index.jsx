import { Typography } from "@mui/material";
import Translate from "src/components/translate";
import Form from "../components/form";
import useUpdateTicket from "./hooks/useUpdateTicket";

const EditForm = () => {
  const { methods, onSubmit, ticketNumber } = useUpdateTicket();

  return (
    <div>
      <Typography>
        <Translate>help_center.form.ticket_id</Translate> :{" "}
        <b>{ticketNumber}</b>
      </Typography>
      <Form
        buttonLabel="help_center.form.add"
        disableUser
        methods={methods}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default EditForm;
