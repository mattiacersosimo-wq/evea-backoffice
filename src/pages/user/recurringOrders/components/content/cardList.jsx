import { Card, IconButton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import creditCardType from "credit-card-type";
import { useState } from "react";
import Iconify from "src/components/Iconify";
import cardLogos from "./assets";

const SingleCard = ({ number, onClick, isActive }) => {
  const { palette } = useTheme();
  const [type] = creditCardType(number);
  return (
    <Card
      sx={{
        padding: "1rem",
        marginBottom: "1rem",
        cursor: "pointer",
        borderColor: isActive && palette.primary.light,
      }}
      onClick={onClick}
      variant={isActive ? "outlined" : "elevation"}
    >
      <Stack
        direction="row"
        spacing={3}
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography>
          <img width="50px" src={cardLogos[type.type]} />
        </Typography>
        <Typography>{number}</Typography>
        <Typography>
          <IconButton
            onClick={(e) => e.preventPropagation()}
            sx={{
              color: "#b8b8b8",
              backgroundColor: palette.background.neutral,
              "&:hover": {
                color: palette.error.dark,
                backgroundColor: palette.background.neutral,
              },
            }}
          >
            <Iconify icon="ic:outline-delete" />
          </IconButton>
        </Typography>
      </Stack>
    </Card>
  );
};

const data = [
  {
    id: 1,
    number: "4923608527301861",
  },
  {
    id: 2,
    number: "4041598350593",
  },
  {
    id: 3,
    number: "5453550490247066",
  },
];

const CardList = () => {
  const [selected, setSelected] = useState("");

  return (
    <>
      {data.map(({ id, number }) => {
        if (selected === "") {
          setSelected(id);
        }
        return (
          <SingleCard
            key={id}
            number={number}
            onClick={() => setSelected(id)}
            isActive={selected === id}
          />
        );
      })}
    </>
  );
};
export default CardList;
