import { Box, Button, Card, IconButton, Typography } from "@mui/material";
import Iconify from "src/components/Iconify";
import DataHandlerTable from "src/components/data-handler/table";
import ParseDate from "src/components/date";
import PaginationButtons from "src/components/pagination";
import Ternary from "src/components/ternary";
import useGetDoc from "./hook/useGetDoc";
import Translate from "src/components/translate";

const DocCard = () => {
  const { state, timeOut, ...rest } = useGetDoc();
  const { data, ...dataProps } = state;
  return (
    <>
      <DataHandlerTable dataProps={{ ...dataProps }}>
        <Box
          sx={{
            display: "grid", p:2,
            rowGap: 1.5,
            columnGap: 1.5,
            gridTemplateColumns: {
              xs: "repeat(1 ,1fr)",
              sm: "repeat(2 ,1fr)",
              md: "repeat(4 ,1fr)",
              lg: "repeat(5 ,1fr)",
             
            },
          }}
        >
          {data.map((item) => {
            return (
              <Card sx={{ p: 1, }}>
                <Typography
                  variant="subtitle2"
                  sx={{ padding: "5px 0px 0px 15px" }}
                >
                  {item.title}
                </Typography>
                <Typography
                  sx={{
                    color: "text.disabled",
                    padding: "0px 0px 0px 15px",
                  }}
                  fontSize="small"
                >
                  <Translate>help_center.document.created_at</Translate> :
                  <ParseDate date={item.created_at} />
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1,
                    columnGap: 1,
                  }}
                >
                  <IconButton sx={{ backgroundColor: "#ebebeb" }}>
                    <Iconify icon={"et:document"} width={24} height={24} />
                  </IconButton>

                  <Button
                    LinkComponent="a"
                    href={item.doc_url}
                    target="_blank"
                    size="small"
                    startIcon={<Iconify icon={"carbon:view"} />}
                    sx={{ pl: 2 }}
                  >
                    <Translate>help_center.document.view</Translate>
                  </Button>
                </Box>
              </Card>
            );
          })}
        </Box>
      </DataHandlerTable>

      <Ternary
        when={!dataProps.isArrayEmpty}
        then={<PaginationButtons {...rest} />}
      />
    </>
  );
};
export default DocCard;
