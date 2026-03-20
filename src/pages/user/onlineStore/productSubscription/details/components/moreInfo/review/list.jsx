import {
  Avatar,
  Box,
  List as MuiList,
  ListItem as MuiListItem,
  Rating,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import ParseDate from "src/components/date";
import EmptyTable from "src/components/emptyTable";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";

const List = ({ reviews, ...rest }) => {
  const isEmpty = !Boolean(reviews?.length);
  return (
    <Box sx={{ pt: 3, px: 2, pb: 5 }}>
      {isEmpty ? (
        <EmptyTable title="No Data Available" />
      ) : (
        <>
          <MuiList disablePadding>
            <Map
              list={reviews}
              render={(review) => <ListItem key={review.id} review={review} />}
            />
          </MuiList>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <PaginationButtons {...rest} />
          </Box>
        </>
      )}
    </Box>
  );
};

List.propTypes = {
  reviews: PropTypes.array,
};

const ListItem = ({ review }) => {
  const {
    username: name,
    rating,
    comment,
    created_at: postedAt,
    title,
  } = review;

  return (
    <>
      <MuiListItem
        disableGutters
        sx={{
          mb: 5,
          alignItems: "flex-start",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Box
          sx={{
            mr: 2,
            display: "flex",
            alignItems: "center",
            mb: { xs: 2, sm: 0 },
            minWidth: { xs: 160, md: 240 },
            textAlign: { sm: "center" },
            flexDirection: { sm: "column" },
          }}
        >
          <Avatar
            src={review.user?.user_profile?.profile_image}
            sx={{
              mr: { xs: 2, sm: 0 },
              mb: { sm: 2 },
              width: { md: 64 },
              height: { md: 64 },
            }}
          />
          <div>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary" }}
              noWrap
            >
              <ParseDate date={postedAt} />
            </Typography>
          </div>
        </Box>

        <div>
          <Rating size="small" value={rating} precision={0.1} readOnly />

          <Typography variant="body2">{title}</Typography>

          <Box
            sx={{
              mt: 1,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" sx={{ mr: 1 }}>
              {comment}
            </Typography>
          </Box>
        </div>
      </MuiListItem>
    </>
  );
};

ListItem.propTypes = {
  review: PropTypes.object,
};

export default List;
