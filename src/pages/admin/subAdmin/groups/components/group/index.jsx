import { LoadingButton } from "@mui/lab";
import { Box, Card, Collapse } from "@mui/material";
import { useMemo } from "react";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import Loop from "src/components/loop";

import Translate from "src/components/translate";
import adminNavConfig from "src/nav-config/admin";
import generateMenus from "src/pages/menu-builder/utils/generate-menus";
import { usePlan } from "src/store/plan";
import Item from "./components/item";

const Group = ({ open, methods, onSubmit }) => {
  const {
    getValues,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onExist = (index) => {
    const menu = getValues("menu");
    const temp = [...menu];
    temp.splice(index, 1);
    return temp;
  };

  const getMenuIndex = (v) => {
    const menu = getValues("menu");
    return menu.findIndex(({ title }) => title === v);
  };

  const handleMainMenu = (v) => {
    const menu = getValues("menu");
    const itemIndex = getMenuIndex(v.title);
    const newData = itemIndex < 0 ? [...menu, v] : onExist(itemIndex);
    newData.sort((a, b) => a.placement > b.placement);
    setValue("menu", newData);
  };

  const handleSubMenu = (v) => {
    const menu = getValues("menu");

    const parentMenu = menu.find(({ title }) => title === v.parent);
    const childIndex = parentMenu?.children?.findIndex(
      ({ title }) => title === v.title
    );

    if (childIndex < 0) {
      const children = [...parentMenu.children, v];
      children.sort((a, b) => a.placement > b.placement);
      parentMenu.children = children;
    } else {
      const temp = [...parentMenu.children];
      temp.splice(childIndex, 1);
      parentMenu.children = temp;
    }
    const parentIndex = getMenuIndex(v.parent);

    const temp = [...menu];
    temp.splice(parentIndex, 1, parentMenu);
    temp.sort((a, b) => a.placement > b.placement);
    setValue("menu", temp);
  };

  const handleChange = (v) => {
    if (v.parent) {
      handleSubMenu(v);
    } else {
      handleMainMenu(v);
    }
  };

  const plan = usePlan();

  const navConfig = useMemo(() => {
    return generateMenus(adminNavConfig)[plan];
  }, [plan]);

  return (
    <Collapse in={open}>
      <Card sx={{ p: 3, mb: 2 }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
              },
              rowGap: 2,
            }}
          >
            <RHFTextField
              name="name"
              label={"sub_admin.group"}
              InputLabelProps={{ shrink: true }}
            />
            <span />
            <RHFTextField
              minRows={8}
              maxRows={5}
              multiline
              name="description"
              label={"sub_admin.description"}
              InputLabelProps={{ shrink: true }}
            />
            <span />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "2rem",
            }}
          >
            <Loop
              list={navConfig}
              render={({ items }) => (
                <>
                  <Loop
                    list={items}
                    render={(menu) => {
                      if (menu.disabled) return null;

                      return (
                        <Item
                          key={menu.title}
                          menu={menu}
                          onChange={(v, e) => {
                            handleChange(v);
                          }}
                        />
                      );
                    }}
                  />
                </>
              )}
            />
          </Box>

          <LoadingButton
            loading={isSubmitting}
            variant="contained"
            type="submit"
          >
            <Translate>{"sub_admin.submit"}</Translate>
          </LoadingButton>
        </FormProvider>
      </Card>
    </Collapse>
  );
};

export default Group;
