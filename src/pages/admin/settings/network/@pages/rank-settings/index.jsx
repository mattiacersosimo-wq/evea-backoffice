import { LoadingButton } from "@mui/lab";
import { Box, Button, Dialog, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import Iconify from "src/components/Iconify";
import DataHandlerTable from "src/components/data-handler/table";
import Map from "src/components/map";
import Translate from "src/components/translate";
import Configuration from "../rank-settings-configuration";
import useGetData from "../rank-settings-configuration/hooks/use-get-data";
import Row from "./components/row";
import { AddRankForm } from "./createNew/components/form";
import useProductList from "./hooks/use-product-list";
import useSettings from "./hooks/use-settings";
import useUpdate from "./hooks/use-update";
import Transition from "src/utils/dialog-animation";

const Level = () => {
  const { state, handleUpdate, fetchData } = useSettings();
  const [selectedValue, setSelectedValue] = useState("daily");
  const {
    fetchData: fetchConfig,
    methods,
    data: updateData,
  } = useGetData(setSelectedValue);
  const config = methods.watch();
  const { data, ...dataProps } = state;
  const { onSubmit, loading } = useUpdate(data, config);
  const [open, setOpenCreate] = useState(false);
  const handleClickOpen = () => {
    setOpenCreate(true);
  };
  const handleCloseCreate = () => {
    setOpenCreate(false);
  };
  const theme = useTheme();
  const productList = useProductList();

  const headers = ["settings.network.rank_name"];
  if (config.package_id === 1) {
    headers.splice(1, 0, "global.pqv_required");
  }
  if (config.referral_count === 1 || config.referral_count === true) {
    headers.splice(2, 0, "global.tv_required");
  }
  if (config.team_volume === 1 || config.team_volume === true) {
    headers.splice(3, 0, "global.gv_required");
  }
  // if (config.personal_volume === 1 || config.personal_volume === true) {
  //   headers.splice(4, 0, "global.user_type");
  // }
  // if (config.referral_package === 1 || config.referral_package === true) {
  //   headers.splice(5, 0, "global.min_pqv");
  // }
  // if (config.referral_package === 1 || config.referral_package === true) {
  //   headers.splice(6, 0, "global.Referral_Package_Count");
  // }
  // if (config.package_id === 1 || config.package_id === 0) {
  //   headers.splice(7, 0, "global.rank_bonus");
  // }

  const regularData = data.filter(item => item.is_circle_of_evea === 0);
  const circleData = data.filter(item => item.is_circle_of_evea === 1);

  return (
    <>
      {/* <Configuration
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
        methods={methods}
        fetchConfig={fetchConfig}
      /> */}
      {/* <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
        <Button
          sx={{ mb: 2 }}
          variant="contained"
          size="small"
          startIcon={<Iconify icon={"carbon:add"} />}
          onClick={handleClickOpen}
          name="add-faq"
        >
          <Translate>global.add_Rank</Translate>
        </Button>
      </Box> */}

      <DataHandlerTable headers={headers} dataProps={dataProps}>
        <Map
          list={regularData}
          render={(item) => (
            <Row
              config={config}
              productList={productList}
              fetchData={fetchData}
              key={item.id}
              {...item}
              onSubmit={onSubmit}
              handleUpdate={handleUpdate}
              {...item}
            />
          )}
        />
      </DataHandlerTable>

      <Typography variant="subtitle1" sx={{ mt: 4, mb: 3 ,ml:2, fontWeight: 'bold'}}>
      <Translate>settings.network.circle_of_evelution</Translate>
      </Typography>

      <DataHandlerTable headers={headers} dataProps={dataProps}>
        <Map
          list={circleData}
          render={(item) => (
            <Row
              config={config}
              productList={productList}
              fetchData={fetchData}
              key={item.id}
              {...item}
              onSubmit={onSubmit}
              handleUpdate={handleUpdate}
              {...item}
            />
          )}
        />
      </DataHandlerTable>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <LoadingButton onClick={onSubmit} loading={loading} variant="contained">
          <Translate>settings.network.update</Translate>
        </LoadingButton>

        <Dialog
          open={open}
          onClose={handleCloseCreate}
          TransitionComponent={Transition}
        >
          <AddRankForm
            productList={productList}
            config={updateData}
            fetchData={fetchData}
            cancel={handleCloseCreate}
          />
        </Dialog>
      </Box>
    </>
  );
};

export default Level;