import * as React from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Translate from "src/components/translate";

const Message = ({ isReject, title, severity }) => {
  return (
    <div>
      <Stack>
        <Alert severity={severity} sx={{ padding: "0px 16px" }}>
          {isReject ? (
            <>
              <Translate>global.kyc_reject</Translate> {title}
            </>
          ) : (
            title
          )}
        </Alert>
      </Stack>
    </div>
  );
};

export default Message;
