import { LoadingButton } from "@mui/lab";
import Ternary from "src/components/ternary";

const CreateItem = ({ createNewEntry, text, createMode, loading }) => {
  return (
    <Ternary
      when={createMode}
      then={
        <LoadingButton loading={loading} fullWidth onClick={createNewEntry}>
          Create Category: {text}
        </LoadingButton>
      }
      otherwise="No Options"
    />
  );
};

export default CreateItem;
