import {
  Avatar,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Rating,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import ParseDate from "src/components/date";

const Item = ({
  name,
  title,
  avatarUrl,
  message,
  tagUser,
  postedAt,
  hasReply,
  rating,
}) => {
  return (
    <>
      <ListItem
        disableGutters
        sx={{
          alignItems: "flex-start",
          py: 3,
          ...(hasReply && {
            ml: "auto",
            width: (theme) => `calc(100% - ${theme.spacing(7)})`,
          }),
        }}
      >
        <ListItemAvatar>
          <Avatar alt={name} src={avatarUrl} sx={{ width: 48, height: 48 }} />
        </ListItemAvatar>

        <ListItemText
          primary={name}
          primaryTypographyProps={{ variant: "subtitle1" }}
          secondary={
            <>
              <Rating value={rating} size="small" readOnly />
              <Typography variant="subtitle2">{title}</Typography>
              <Typography
                gutterBottom
                variant="caption"
                sx={{
                  display: "block",
                  color: "text.disabled",
                }}
              >
                <ParseDate date={postedAt} />
              </Typography>
              <Typography component="span" variant="body2">
                <strong>{tagUser}</strong> {message}
              </Typography>
            </>
          }
        />
      </ListItem>

      <Divider
        sx={{
          ml: "auto",
          width: (theme) => `calc(100% - ${theme.spacing(7)})`,
        }}
      />
    </>
  );
};

Item.propTypes = {
  name: PropTypes.string,
  avatarUrl: PropTypes.string,
  message: PropTypes.string,
  tagUser: PropTypes.string,
  postedAt: PropTypes.string,
  hasReply: PropTypes.bool,
};

export default Item;
