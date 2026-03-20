import { Card, Divider, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ParseDate from "src/components/date";
import Translate from "src/components/translate";

const Index = ({ ticketData }) => {
  const { palette } = useTheme();
  return (
    <div>
      <Card
        sx={{
          py: 3,
          color: palette.primary.main,
        }}
      >
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
        >
          <Stack width={1} textAlign="center">
            <Typography variant="subtitle2">
              <ParseDate date={ticketData?.created_at} />
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              <Translate>help_center.view.created</Translate>
            </Typography>
          </Stack>
          {ticketData?.last_response_date ? (
            <Stack width={1} textAlign="center">
              <Typography variant="subtitle2">
                <ParseDate date={ticketData?.last_response_date} />
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                <Translate>help_center.view.last_response</Translate>
              </Typography>
            </Stack>
          ) : null}
        </Stack>
      </Card>
    </div>
  );
};

export default Index;
