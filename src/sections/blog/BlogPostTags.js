import { Box, Checkbox, FormControlLabel } from "@mui/material";
import PropTypes from "prop-types";
import { useParams } from "react-router";
import Iconify from "src/components/Iconify";
import fetchUser from "src/utils/fetchUser";
import { fShortenNumber } from "src/utils/formatNumber";

BlogPostTags.propTypes = {
  post: PropTypes.object.isRequired,
};

const useLike = () => {
  const { id } = useParams();
  const like = async () => {
    const reqData = new FormData();
    reqData.append("reaction", 1);
    try {
      const { status, data } = await fetchUser.post(
        `blog-reviewreaction/${id}`,
        reqData
      );
      if (status === 200) {
        console.log(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return like;
};

export default function BlogPostTags({ post }) {
  const { favorite } = post;
  const like = useLike();
  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              onChange={like}
              defaultChecked
              size="small"
              color="error"
              icon={<Iconify icon="eva:heart-fill" />}
              checkedIcon={<Iconify icon="eva:heart-fill" />}
            />
          }
          label={fShortenNumber(favorite)}
        />
      </Box>
    </Box>
  );
}
