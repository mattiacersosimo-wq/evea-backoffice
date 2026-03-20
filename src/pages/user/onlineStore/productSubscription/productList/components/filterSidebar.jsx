import {
  Box,
  Button,
  Checkbox,
  Divider,
  Drawer,
  FormControlLabel,
  IconButton,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import { capitalCase } from "change-case";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Iconify from "src/components/Iconify";
import Scrollbar from "src/components/Scrollbar";
import { NAVBAR } from "src/config";

import fetchUser from "src/utils/fetchUser";

const useFilterCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { status, data } = await fetchUser.get("product-categories");
        if (status === 200) {
          setCategories(data.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchCategories();
  }, []);

  return categories;
};

const FilterSidebar = ({
  isOpen,
  filterIds,
  onOpen,
  onClose,
  setFilterIds,
}) => {
  const categories = useFilterCategories();
  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={<Iconify icon={"ic:round-filter-list"} />}
        onClick={onOpen}
        name="filter"
      >
        {"userOnlineStore.filters"}
      </Button>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={onClose}
        PaperProps={{
          sx: { width: NAVBAR.BASE_WIDTH },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 1, py: 2 }}
        >
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            {"userOnlineStore.filters"}
          </Typography>
          <IconButton onClick={onClose} name="close">
            <Iconify icon={"eva:close-fill"} width={20} height={20} />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1}>
              <Typography variant="subtitle1">
                {"userOnlineStore.category"}
              </Typography>
              <RadioGroup>
                {categories.map(({ id, name }) => (
                  <FormControlLabel
                    key={id}
                    value={id}
                    onChange={(e) => {
                      setFilterIds((state) => {
                        let prev = [...state];
                        const index = prev.findIndex((item) => item === id);
                        if (index > -1) {
                          prev.splice(index, 1);
                        } else {
                          prev = [...prev, id];
                        }
                        return prev;
                      });
                    }}
                    control={<Checkbox checked={filterIds?.includes(id)} />}
                    label={capitalCase(name)}
                  />
                ))}
              </RadioGroup>
            </Stack>
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            onClick={() => setFilterIds([])}
            startIcon={<Iconify icon={"ic:round-clear-all"} />}
            name="clear-all"
          >
            {"clearAll"}
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

FilterSidebar.propTypes = {
  isOpen: PropTypes.bool,
  onResetAll: PropTypes.func,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
};

export default FilterSidebar;
