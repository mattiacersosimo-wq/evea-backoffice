import { Box, Stack, Typography } from "@mui/material";

import ReferralPerson from "src/images/referral-outline.png";
import { useTheme } from "@mui/material/styles";



const PerformersCardItem = ({ uname, email, children, img }) => {

  const theme = useTheme();

  return (
    <Stack alignItems="center" direction="row" justifyContent="space-between" mb="20px">
      <Stack direction="row" sx={{alignItems:"center"}}>
        <Box
          sx={{
            borderRadius: "6px",
            overflow: "hidden",
            mr: 1,
            width: "35px",
            height: "35px",
          }}
        >
          <img style={{height: "100%", width:"100%", borderRadius:"50%"}} src={img ? img : ReferralPerson} />
        </Box>

        <Stack>
          <Typography sx={{lineHeight:1.1, fontWeight:"300",color:theme.palette.widgets.tertiary[400],fontSize:"16px"}}>{uname}</Typography>
          <Typography variant="subtitle3" sx={{fontWeight:"300",fontSize:"13.5px"}}>
            {email}
          </Typography>
        </Stack>
      </Stack>
      <Typography variant="subtitle2" sx={{fontSize:"14px"}}>{children}</Typography>
    </Stack>
  );
};

export default PerformersCardItem;
