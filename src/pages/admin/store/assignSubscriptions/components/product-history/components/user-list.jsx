import { Card, CardHeader, Typography } from "@mui/material";
import Translate from "src/components/translate";

const UserList = ({ children }) => {
  return (
    <Card>
      <CardHeader
        title={
          <Typography variant="subtitle2">
            <Translate>{"assign_subscriptions.subscriptionsList"}</Translate>
          </Typography>
        }
        sx={{ mb: 3 }}
      />
      {children}
    </Card>
  );
};
export default UserList;
