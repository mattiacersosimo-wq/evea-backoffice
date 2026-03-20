import { Box, List } from "@mui/material";
import PropTypes from "prop-types";
import Item from "./item";

const CommentList = ({ comments }) => {
  return (
    <List disablePadding>
      {comments?.map((comment) => {
        const { id, rating, user } = comment;

        return (
          <Box key={id}>
            <Item
              name={user?.username}
              title={comment?.title}
              avatarUrl={user?.user_profile?.profile_image}
              postedAt={comment?.created_at}
              message={comment?.comment}
              rating={rating}
            />
          </Box>
        );
      })}
    </List>
  );
};

CommentList.propTypes = {
  post: PropTypes.object.isRequired,
};

export default CommentList;
