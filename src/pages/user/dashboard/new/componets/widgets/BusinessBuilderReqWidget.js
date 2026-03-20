import {
  Button,
  Card,
  CardHeader,
  Checkbox,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { capitalCase } from "change-case";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmptyTable from "src/components/emptyTable";
import useErrors from "src/hooks/useErrors";

import { PATH_USER } from "src/routes/paths";
import fetchUser from "src/utils/fetchUser";

const useBusinessBuilderReq = () => {
  const [data, setData] = useState([]);
  const handleErrors = useErrors();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await fetchUser("rank-requirements");
        if (status === 200) {
          setData(data.data);
        }
      } catch (err) {
        handleErrors(err);
      }
    };
    fetchData();
  }, []);

  return data;
};

const BusinessBuilderReqWidget = () => {
  const data = useBusinessBuilderReq();
  const isEmpty = !Boolean(data?.length);
  return (
    <>
      <Card sx={{ p: 1, borderRadius: "7px", minHeight: 312 }}>
        <CardHeader
          title={
            <Typography variant="subtitle2">
              Business Builder : Requirements
            </Typography>
          }
          gutterBottom
        />
        {isEmpty ? (
          <EmptyTable title="No Data Available" />
        ) : (
          <FormControl sx={{ p: 2 }}>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="pay"
              name="radio-buttons-group"
              sx={{ p: 1 }}
            >
              {data?.map(({ message, count, id }) => {
                return (
                  <FormControlLabel
                    key={id}
                    value="active"
                    control={<Checkbox size="small" />}
                    label={`${count} ${capitalCase(message)}`}
                    sx={{
                      border: "solid 1px #f0f0f0",
                      borderRadius: 1,
                      padding: 1,
                      marginTop: 1,
                    }}
                  />
                );
              })}
            </RadioGroup>
            <Button
              variant="contained"
              size="small"
              LinkComponent={Link}
              to={PATH_USER.genealogy.affiliate}
              sx={{ mt: 2 }}
              name="view-affiliate"
            >
              {"userDashboard.viewAffiliateDashboard"}
            </Button>
          </FormControl>
        )}
      </Card>
    </>
  );
};

export default BusinessBuilderReqWidget;
