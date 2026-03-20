import { Card, IconButton, TableCell, TableRow } from "@mui/material";
import { useNavigate } from "react-router";
import Iconify from "src/components/Iconify";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import { PATH_DASHBOARD } from "src/routes/paths";
import useReviewList from "./hooks/useReviewList";

const headers = [
  "user_review.no",
  "user_review.product",
  "user_review.total_review",
  "user_review.rating",
  "user_review.view",
];

const ReviewsList = ({ view }) => {
  const { state, rowStart, ...rest } = useReviewList();
  const { data, ...dataProps } = state;
  const navigate = useNavigate();

  const goToView = (selectedId) =>
    navigate(`${PATH_DASHBOARD.store.user_reviews_edit}/${selectedId}`);

  return (
    <>
      <Card sx={{ pt: 1 }}>
        <Scrollbar>
          <DataHandlerTable
            name="faq-table"
            headers={headers}
            dataProps={{ ...dataProps }}
          >
            <Map
              list={data}
              render={(item, i) => (
                <>
                  <TableRow key={item.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell>{item.total_reviews}</TableCell>
                    <TableCell>{item.rating}</TableCell>
                    <TableCell>
                      <IconButton
                        disabled={!view}
                        onClick={() => goToView(item.product_id)}
                      >
                        <Iconify icon="carbon:view" width={20} height={20} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </>
              )}
            />
          </DataHandlerTable>
        </Scrollbar>
      </Card>
      <PaginationButtons {...rest} />
    </>
  );
};

export default ReviewsList;
