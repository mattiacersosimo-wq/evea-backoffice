import { Box, Paper, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { capitalCase } from "change-case";
import Slider from "react-slick";

const ranksMap = {
  1: {
    name: "customer",
    color: "#a2a3a5",
    logo: "https://cdn.bitcointaf.com/ranks/rank1.png",
  },
  2: {
    name: "active_customer",
    color: "#9067d4",
    logo: "https://cdn.bitcointaf.com/ranks/rank2.png",
  },
  3: {
    name: "business_builder",
    color: "#5a379d",
    logo: "https://cdn.bitcointaf.com/ranks/rank3.png",
  },
  4: {
    name: "bronze_executive",
    color: "#c7a564",
    logo: "https://cdn.bitcointaf.com/ranks/rank4.png",
  },
  5: {
    name: "silver_executive",
    color: "#c3c2d4",
    logo: "https://cdn.bitcointaf.com/ranks/rank5.png",
  },
  6: {
    name: "gold_executive",
    color: "#825e0b",
    logo: "https://cdn.bitcointaf.com/ranks/rank6.png",
  },
  7: {
    name: "emerald_executive",
    color: "#45922c",
    logo: "https://cdn.bitcointaf.com/ranks/rank7.png",
  },
};

const getRankAsArray = (ranks = {}) =>
  Object.entries(ranks).map(([id, rest]) => ({ id: parseInt(id), ...rest }));

export const getRankById = (id = 1, isStartup = false) => {
  const rank = ranksMap[id] || {};
  if (isStartup && id === 1) return { ...rank, color: "#bab054" };
  return rank;
};

const slider = getRankAsArray(ranksMap).map((rank) => {
  return (
    <Box
      sx={{
        padding: "0 0.5rem",
      }}
    >
      <Paper
        sx={{
          cursor: "pointer",
          width: "100%",
          padding: "0.5rem 1rem",
          backgroundColor: rank.color,
          color: "#fff",
          display: "flex !important",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <img width="25px" src={rank.logo} />
        <Typography variant="p">{capitalCase(rank.name)}</Typography>
      </Paper>
    </Box>
  );
});

const Ranks = () => {
  const { breakpoints } = useTheme();
  const sm = useMediaQuery(breakpoints.down("sm"));
  const md = useMediaQuery(breakpoints.down("md"));

  return (
    <Box
      sx={{
        marginTop: "1rem",
      }}
    >
      {getRankAsArray()}
      <Slider
        autoplaySpeed={0}
        arrows={true}
        autoplay
        slidesToScroll={1}
        slidesToShow={sm ? 1 : md ? 3 : 5}
        speed={1500}
      >
        {slider}
      </Slider>
    </Box>
  );
};

export default Ranks;
