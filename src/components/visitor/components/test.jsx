import { useTheme } from "@mui/material/styles";
import { ReactComponent as Big } from "./big.svg";
import { ReactComponent as Small } from "./small.svg";

const Test = () => {
  const { palette } = useTheme();
  return (
    <>
      <Small
        style={{
          position: "absolute",
          right: 50,
          bottom: 100,
        }}
        opacity={0.1}
        fill={palette.primary.light}
      />
      <Big
        style={{
          position: "absolute",
          right: -200,
          bottom: -250,
        }}
        opacity={0.6}
        fill={palette.primary.light}
      />
    </>
  );
};

export default Test;
