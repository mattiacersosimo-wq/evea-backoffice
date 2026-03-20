import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  CardActions,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Iconify from "src/components/Iconify";
import Ternary from "src/components/ternary";
import useIsPackage from "src/components/package-or-product/hooks/use-is-package";
import Translate from "src/components/translate";
import { PATH_DASHBOARD } from "src/routes/paths";
import useDelete from "../../hook/useDelete";
import DeleteProductDialog from "./DeleteProductDialog";
import ShowForPackage from "src/components/package-or-product/show-for-package";
import useIsSubscription from "src/components/package-or-product/hooks/use-is-subscription";

const useStyles = makeStyles({
  buttonVideo: {
    "&:hover": {
      backgroundColor: "#fff",
      color: "#3c52b2",
    },
  },
  buttonDocument: {
    "&:hover": {
      backgroundColor: "#fff",
      color: "#ff9100",
    },
  },
  buttonQuestions: {
    "&:hover": {
      backgroundColor: "#fff",
      color: "#00a152",
    },
  },
  buttonSampleDoc: {
    "&:hover": {
      backgroundColor: "#fff",
      color: "#ab003c",
    },
  },
});

const Actions = ({ data, refresh, status }) => {
  const { closeDelete, itemId, openDelete } = useDelete();
  const classes = useStyles();
  const { palette } = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const isPackage = useIsPackage();
  const isSubscription = useIsSubscription();
  const { id } = data;

  const theme = useTheme();

  return (
    <>
      {!isDesktop && (
        <CardActions disableSpacing sx={{ float: "right", columnGap: "6px" }}>
          <Ternary
            when={status.video}
            then={
              <Tooltip title={<Translate>products.title.video_edit</Translate>}>
                <IconButton
                  aria-label="videos"
                  className={classes.buttonVideo}
                  component={RouterLink}
                  sx={{
                    color: palette.primary.main,
                    backgroundColor: "#f1f1f1a8",
                  }}
                  to={`${PATH_DASHBOARD.store.products}/${data.id}/video`}
                  name="video"
                  size="small"
                >
                  <Iconify icon={"akar-icons:video"} />
                </IconButton>
              </Tooltip>
            }
          />
          <Ternary
            when={status.document}
            then={
              <Tooltip
                title={<Translate>products.title.document_view_edit</Translate>}
                name="document"
              >
                <IconButton
                  aria-label="documents"
                  className={classes.buttonDocument}
                  state={{ productDocuments: data.product_docs }}
                  component={RouterLink}
                  sx={{
                    color: palette.primary.main,
                    backgroundColor: "#f1f1f1a8",
                  }}
                  to={`${PATH_DASHBOARD.store.products}/${data.id}/document`}
                  size="small"
                >
                  <Iconify icon={"clarity:document-line"} />
                </IconButton>
              </Tooltip>
            }
          />
          <Ternary
            when={status.questions}
            then={
              <Tooltip
                title={
                  <Translate>products.title.questions_view_edit</Translate>
                }
              >
                <IconButton
                  aria-label="questions"
                  className={classes.buttonQuestions}
                  component={RouterLink}
                  sx={{
                    color: palette.primary.main,
                    backgroundColor: "#f1f1f1a8",
                  }}
                  state={{ questions: data.product_questions }}
                  to={`${PATH_DASHBOARD.store.products}/${data.id}/questions`}
                  name="questions"
                  size="small"
                >
                  <Iconify icon={"akar-icons:chat-question"} />
                </IconButton>
              </Tooltip>
            }
          />
          <Ternary
            when={status.sampleDocument}
            then={
              <Tooltip
                title={
                  <Translate>
                    products.title.sample_document_view_edit
                  </Translate>
                }
              >
                <IconButton
                  aria-label="product_edit"
                  className={classes.buttonSampleDoc}
                  component={RouterLink}
                  sx={{
                    color: palette.primary.main,
                    backgroundColor: "#f1f1f1a8",
                  }}
                  to={`${PATH_DASHBOARD.store.products}/${data.id}/sample`}
                  name="sample"
                  size="small"
                >
                  <Iconify icon={"healthicons:i-documents-accepted-outline"} />
                </IconButton>
              </Tooltip>
            }
          />

          <Ternary
            when={status.edit}
            then={
              <Tooltip
                title={
                  <Ternary
                    when={isSubscription}
                    then={
                      <Translate>
                        products.title.subscription_view_edit
                      </Translate>
                    }
                    otherwise={
                      <Ternary
                        when={isPackage}
                        then={
                          <Translate>
                            products.title.package_view_edit
                          </Translate>
                        }
                        otherwise={
                          <Translate>
                            products.title.product_view_edit
                          </Translate>
                        }
                      />
                    }
                  />
                }
              >
                <IconButton
                  aria-label="product_edit"
                  component={RouterLink}
                  sx={{
                    color: palette.primary.main,
                    backgroundColor: "#f1f1f1a8",
                  }}
                  to={
                    isPackage
                      ? PATH_DASHBOARD.store.packages_edit(id)
                      : isSubscription
                      ? PATH_DASHBOARD.store.subscription_edit(id)
                      : PATH_DASHBOARD.store.product_edit(id)
                  }
                  name="edit"
                  size="small"
                >
                  <Iconify icon={"akar-icons:edit"} />
                </IconButton>
              </Tooltip>
            }
          />

          <ShowForPackage>
            <Ternary
              when={status.delete}
              then={
                <Tooltip title={<Translate>products.title.delete</Translate>}>
                  <IconButton
                    aria-label="settings"
                    color="error"
                    onClick={openDelete(data.id)}
                    sx={{ backgroundColor: "#f1f1f1a8" }}
                    name="delete"
                    size="small"
                  >
                    <Iconify icon={"eva:trash-2-outline"} />
                  </IconButton>
                </Tooltip>
              }
            />
          </ShowForPackage>
        </CardActions>
      )}
      {isDesktop && (
        <>
          <Box
            sx={{
              alignItems: "right",
              position: "absolute",
              top: "17px",
              right: "-13px",
            }}
          >
            <Tooltip title="Product">
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                name="account-menu"
              >
                <Iconify
                  icon="ph:dots-three-vertical-bold"
                  style={{ color: theme.palette.widgets.tertiary[400] }}
                />
              </IconButton>
            </Tooltip>
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <Ternary
              when={status.video}
              then={
                <MenuItem>
                  <Tooltip title={"adminStore.products.videoView_edit"}>
                    <IconButton
                      aria-label="videos"
                      className={classes.buttonVideo}
                      component={RouterLink}
                      sx={{
                        color: palette.primary.main,
                        backgroundColor: "#f1f1f1a8",
                      }}
                      to={`${PATH_DASHBOARD.store.products}/${data.id}/video`}
                      name="video"
                    >
                      <Iconify icon={"akar-icons:video"} />
                    </IconButton>
                  </Tooltip>
                </MenuItem>
              }
            />
            <Ternary
              when={status.document}
              then={
                <MenuItem>
                  <Tooltip title={"adminStore.products.documentView_Edit"}>
                    <IconButton
                      aria-label="documents"
                      className={classes.buttonDocument}
                      state={{ productDocuments: data.product_docs }}
                      component={RouterLink}
                      sx={{
                        color: palette.primary.main,
                        backgroundColor: "#f1f1f1a8",
                      }}
                      to={`${PATH_DASHBOARD.store.products}/${data.id}/document`}
                      name="document"
                    >
                      <Iconify icon={"clarity:document-line"} />
                    </IconButton>
                  </Tooltip>
                </MenuItem>
              }
            />
            <Ternary
              when={status.questions}
              then={
                <MenuItem>
                  <Tooltip title={"adminStore.products.questionsView_Edit"}>
                    <IconButton
                      aria-label="questions"
                      className={classes.buttonQuestions}
                      component={RouterLink}
                      sx={{
                        color: palette.primary.main,
                        backgroundColor: "#f1f1f1a8",
                      }}
                      state={{ questions: data.product_questions }}
                      to={`${PATH_DASHBOARD.store.products}/${data.id}/questions`}
                      name="questions"
                    >
                      <Iconify icon={"akar-icons:chat-question"} />
                    </IconButton>
                  </Tooltip>
                </MenuItem>
              }
            />
            <Ternary
              when={status.sampleDocument}
              then={
                <MenuItem>
                  <Tooltip
                    title={"adminStore.products.sampleDocumentView_Edit"}
                  >
                    <IconButton
                      aria-label="product_edit"
                      className={classes.buttonSampleDoc}
                      component={RouterLink}
                      sx={{
                        color: palette.primary.main,
                        backgroundColor: "#f1f1f1a8",
                      }}
                      to={`${PATH_DASHBOARD.store.products}/${data.id}/sample`}
                      name="sample"
                    >
                      <Iconify
                        icon={"healthicons:i-documents-accepted-outline"}
                      />
                    </IconButton>
                  </Tooltip>
                </MenuItem>
              }
            />

            <Ternary
              when={status.edit}
              then={
                <MenuItem>
                  <Tooltip title={"adminStore.products.productView_Edit"}>
                    <IconButton
                      aria-label="product_edit"
                      component={RouterLink}
                      sx={{
                        color: palette.primary.main,
                        backgroundColor: "#f1f1f1a8",
                      }}
                      to={
                        isPackage
                          ? PATH_DASHBOARD.store.packages_edit(id)
                          : isSubscription
                          ? PATH_DASHBOARD.store.subscription_edit(id)
                          : PATH_DASHBOARD.store.product_edit(id)
                      }
                      // to={squashPathAndQueryString(
                      //   `${PATH_DASHBOARD.store.product_edit}/${data.id}`,
                      //   objectToQueryString(queryParam)
                      // )}
                      name="edit"
                    >
                      <Iconify icon={"akar-icons:edit"} />
                    </IconButton>
                  </Tooltip>
                </MenuItem>
              }
            />

            <Ternary
              when={status.delete}
              then={
                <MenuItem>
                  <Tooltip title={"adminStore.products.delete"}>
                    <IconButton
                      aria-label="settings"
                      color="error"
                      onClick={openDelete(data.id)}
                      sx={{ backgroundColor: "#f1f1f1a8" }}
                      name="delete"
                    >
                      <Iconify icon={"eva:trash-2-outline"} />
                    </IconButton>
                  </Tooltip>
                </MenuItem>
              }
            />
          </Menu>
        </>
      )}

      <DeleteProductDialog
        itemId={itemId}
        onClose={closeDelete}
        refresh={refresh}
      />
    </>
  );
};
export default Actions;
