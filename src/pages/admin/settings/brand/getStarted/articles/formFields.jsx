import { Box, DialogContent, DialogContentText } from "@mui/material";
import { RHFEditor, RHFSelect, RHFTextField } from "src/components/hook-form";
import LabelStyle from "src/components/label-style";

import useGetSectionNames from "./hooks/useGetSectionNames";
import Translate from "src/components/translate";

const FormFields = ({ isEdit }) => {
  const sectionNames = useGetSectionNames();
  return (
    <>
      <DialogContent>
        <DialogContentText>
          <Box
            sx={{
              display: "grid",
              rowGap: 3,
              columnGap: 2,
              marginTop: 3,
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(3, 1fr)",
              },
            }}
          >
            <RHFSelect
              name="section_id"
              label={"settings.brand.sectionName"}
              InputLabelProps={{ shrink: isEdit }}
            >
              <option value="" />
              {sectionNames.map(({ id, name }) => (
                <option value={id}>{name}</option>
              ))}
            </RHFSelect>
            <RHFTextField
              InputLabelProps={{ shrink: isEdit }}
              name="menu_name"
              type="text"
              label={"settings.brand.menu_name"}
            />
            <RHFTextField
              InputLabelProps={{ shrink: isEdit }}
              name="sort_order"
              type="number"
              label={"settings.brand.sortOrder"}
              onWheel={(e) => e.target.blur()}
            />
          </Box>
          <Box
            sx={{
              display: "grid",
              rowGap: 3,
              columnGap: 2,
              marginTop: 3,
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(1, 1fr)",
              },
            }}
          >
            <LabelStyle>
              <Translate>{"settings.brand.description"}</Translate>
            </LabelStyle>
            <RHFEditor
              simple
              name="content"
              InputLabelProps={{ shrink: isEdit }}
            />
          </Box>
        </DialogContentText>
      </DialogContent>
    </>
  );
};

export default FormFields;
