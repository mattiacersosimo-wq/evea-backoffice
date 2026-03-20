import { Box, Card, Stack, Typography } from "@mui/material";
import React from "react";
import ReactQuill from "react-quill";
import Iconify from "src/components/Iconify";
import ParseDate from "src/components/date";
import "./style.css";
import { useTheme } from "@mui/material/styles";

const DataList = ({ knowledge }) => {
  const { title, description, created_at } = knowledge;
  const { palette } = useTheme();
  const isDark = palette.mode === "dark";
  return (
    <>
      <Card
        sx={{
          py: 2,
          px: 2,
          height: "100%",
          mb: 2,
        }}
        component={Stack}
        spacing={1}
      >
        <Typography
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            textTransform: "capitalize",
            fontWeight: 300,
          }}
          variant="h6"
        >
          {title}
        </Typography>
        <div className="text-white">
          <ReactQuill  className={`${isDark ? 'darkeditor' : 'lighteditor'}`}
            value={description}
            theme="bubble"
            modules={{
              toolbar: null,

            }}
            readOnly
          />
          
        </div>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1,1fr)",
              sm: "repeat(2, 1fr)",
            },
            marginTop: "15px !important",
          }}
        >
          <Box>
            <Typography variant="caption" sx={{ display: "flex" }}>
              <Iconify
                icon="lets-icons:date-today-duotone"
                style={{ fontSize: "20px", marginRight: "5px" }}
              />
              <ParseDate date={created_at} />
            </Typography>
          </Box>
        </Box>
      </Card>
    </>
  );
};

export default DataList;
