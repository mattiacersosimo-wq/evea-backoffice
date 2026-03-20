import { IconButton } from "@mui/material";
import React, { useRef } from "react";
import { useFormContext } from "react-hook-form";
import Iconify from "src/components/Iconify";

const Attachment = () => {
  const openAttachments = () => attachmentsRef.current.click();
  const attachmentsRef = useRef(null);
  const { register } = useFormContext();
  const { ref, ...rest } = register("attachments");

  return (
    <>
      <input
        {...rest}
        ref={(e) => {
          ref(e);
          attachmentsRef.current = e;
        }}
        type="file"
        style={{ display: "none" }}
      />
      <IconButton onClick={openAttachments} size="small">
        <Iconify icon={"eva:attach-2-fill"} width={24} height={24} />
      </IconButton>
    </>
  );
};

export default Attachment;
