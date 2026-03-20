import { LoadingButton } from "@mui/lab";
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { FormProvider } from "src/components/hook-form";
import Map from "src/components/map";
import useUpdate from "./hooks/use-update";
import Translate from "src/components/translate";
import Scrollbar from "src/components/Scrollbar";

const Package = () => {
  const { field, methods, onSubmit } = useUpdate();

  const { fields, remove, insert } = field;
  const {
    register,
    formState: { isSubmitting },
  } = methods;

  return (
    <>
      <Scrollbar>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <TableContainer sx={{ minWidth: 960 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Translate>global.package</Translate>
                  </TableCell>
                  <TableCell>
                    <Translate>ROI</Translate>&nbsp; (%)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <Map
                  list={fields}
                  render={(data, i) => {
                    const { name, percentage, id } = data;

                    return (
                      <TableRow key={id}>
                        <TableCell>
                          <TextField
                            type="text"
                            size="small"
                            value={name}
                            disabled
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            {...register(`package.${i}.percentage`)}
                            onChange={(e) => {
                              remove(i);
                              insert(i, {
                                ...data,
                                percentage: parseInt(e.target.value) || "",
                              });
                            }}
                            value={percentage}
                            label="Percentage"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  }}
                />
              </TableBody>
            </Table>
          </TableContainer>
          <Box textAlign="right">
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                onClick={onSubmit}
                type="submit"
                variant="contained"
              >
                <Translate>{"settings.network.update"}</Translate>
              </LoadingButton>
            </Stack>
          </Box>
        </FormProvider>
      </Scrollbar>
    </>
  );
};

export default Package;
