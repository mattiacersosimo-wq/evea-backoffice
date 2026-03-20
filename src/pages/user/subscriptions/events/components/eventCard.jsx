import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ReactQuill from "react-quill";
import EventsShowDialog from "src/components/events-show-dialog";
import Loop from "src/components/loop";
import { DEFAULT_FALLBACK_IMAGE } from "src/config";
import useQueryParams from "src/hooks/useQueryParams";
import { getClientTime } from "src/utils/dateTime";

const EventCard = ({ data }) => {
  const { addParam } = useQueryParams();

  const { palette } = useTheme();

  return (
    <>
      <div>
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
          }}
        >
          <Loop
            list={data}
            render={(props) => {
              const {
                key,
                image,
                description,
                topic,
                converted_date_in_utc: utc_date,
              } = props;

              return (
                <Card
                  key={key}
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    addParam("event", key);
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      maxHeight: 300,
                      padding: "1rem",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      style={{
                        objectFit: "contain",
                      }}
                      alt="events"
                      src={image ? image : DEFAULT_FALLBACK_IMAGE}
                      ratio="16/9"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
                      }}
                    />
                  </Box>

                  <CardContent>
                    <div>
                      <Typography variant="subtitle1">{topic}</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.72 }}>
                        {getClientTime(utc_date)}
                      </Typography>

                      <ReactQuill
                        value={description.slice(0, 100)}
                        readOnly
                        theme="bubble"
                        modules={{
                          toolbar: false,
                        }}
                      />
                    </div>
                  </CardContent>
                  <CardActions
                    sx={{
                      justifyContent: "flex-end",
                      width: "100%",
                      textAlign: "right",
                      paddingBottom: 4,
                      paddingRight: 3,
                    }}
                  >
                    <Button size="small" disableElevation variant="contained">
                      read more
                    </Button>
                  </CardActions>
                </Card>
              );
            }}
          />
        </Box>
      </div>

      <EventsShowDialog />
    </>
  );
};

export default EventCard;
