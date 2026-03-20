import { Box, IconButton } from "@mui/material";
import { useFormContext } from "react-hook-form";
import Iconify from "src/components/Iconify";
import Loop from "src/components/loop";

const Attachments = () => {
  const { watch, setValue } = useFormContext();

  const attachments = watch("attachments");

  const removeAttachments = (i) => () => {
    const newAttachments = [...attachments];
    newAttachments.splice(i, 1);
    setValue("attachments", newAttachments);
  };

  return (
    <>
      <Loop
        list={[...attachments]}
        render={({ name, size }, i) => (
          <Box
            key={i}
            sx={{
              width: "75%",
              padding: "0.8rem",
              backgroundColor: "#f5f5f5",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                fontSize: "0.8rem",
                width: "90%",
                justifyContent: "space-between",
                alignItems: "center",
                display: "flex",
              }}
            >
              <div>{name}</div>
              <div>{size}</div>
            </div>
            <IconButton size="small" onClick={removeAttachments(i)}>
              <Iconify icon="eva:close-fill" />
            </IconButton>
          </Box>
        )}
      />
    </>
  );
};

export default Attachments;
