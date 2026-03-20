import { Button, Card, CardActions, CardContent } from "@mui/material";
import Iconify from "src/components/Iconify";
import TopPanelBox from "../../components/topPanelBox";

const TopPanel = () => {
  return (
    <TopPanelBox>
      {_data.map(({ body, id }) => (
        <Card key={id}>
          <CardContent>{body}</CardContent>
          <CardActions>
            <Button endIcon={<Iconify icon="eva:download-fill" />}>
              Download
            </Button>
            <Button endIcon={<Iconify icon="carbon:view" />}>View</Button>
          </CardActions>
        </Card>
      ))}
    </TopPanelBox>
  );
};

const _data = [
  {
    id: 1,
    body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dum",
  },
  {
    id: 2,
    body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dum",
  },
];
export default TopPanel;
