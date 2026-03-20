import { Card, Divider, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ParseDate from "src/components/date";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";

const Index = ({ data }) => {
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
            <Typography variant="h6">
              <Ternary
                when={data?.created_at}
                then={<ParseDate date={data?.created_at} />}
              />
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              <Translate>support_tickets.view.created</Translate>
            </Typography>
          </Stack>
          {data?.last_response_date ? (
            <Stack width={1} textAlign="center">
              <Typography variant="h6">
                <Ternary
                  when={data?.last_response_date}
                  then={<ParseDate date={data?.last_response_date} />}
                />
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                <Translate>support_tickets.view.last</Translate>
              </Typography>
            </Stack>
          ) : null}
        </Stack>
      </Card>
    </div>
  );
};

export default Index;
