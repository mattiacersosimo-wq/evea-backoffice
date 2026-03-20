import {
  Box,
  Card,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";

import { PATH_DASHBOARD } from "src/routes/paths";

import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router";
import { NavLink as RouterLink } from "react-router-dom";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleListItemClick = (path) => {
    navigate(path);
  };

  const isSelected = (path) => {
    return location.pathname === path;
  };

  const { t } = useTranslation();

  return (
    <>
      <Page title="articles.title">
        <Box>
          <HeaderBreadcrumbs
            heading="articles.title"
            links={[
              { name: "global.dashboard", href: PATH_DASHBOARD.root },
              { name: "articles.title" },
            ]}
          />

          <Card sx={{ p: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4} md={4}>
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                  }}
                >
                  <Paper elevation={3}>
                    <nav aria-label="secondary mailbox folders">
                      <List>
                        <ListItem disablePadding>
                          <ListItemButton>
                            <ListItemIcon>
                              <Iconify icon={"carbon:share-knowledge"} />
                            </ListItemIcon>
                            <ListItemText primary={t("articles.options.title")} />
                          </ListItemButton>
                        </ListItem>
                      </List>
                    </nav>
                    <Divider />
                    <nav aria-label="main mailbox folders">
                      <List>
                        <ListItem disablePadding>
                          <ListItemButton
                            selected={isSelected(
                              PATH_DASHBOARD.communication.com_article
                            )}
                            onClick={() =>
                              handleListItemClick(
                                PATH_DASHBOARD.communication.com_article
                              )
                            }
                            to={PATH_DASHBOARD.communication.com_article}
                            component={RouterLink}
                          >
                            <ListItemIcon>
                              <Iconify
                                icon={"ooui:article-rtl"}
                                style={{ color: "#9575cd" }}
                              />
                            </ListItemIcon>
                            <ListItemText primary={t("articles.options.articles")} />
                          </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                          <ListItemButton
                            selected={isSelected(
                              PATH_DASHBOARD.communication.article_categories
                            )}
                            onClick={() =>
                              handleListItemClick(
                                PATH_DASHBOARD.communication.article_categories
                              )
                            }
                            to={PATH_DASHBOARD.communication.article_categories}
                            component={RouterLink}
                          >
                            <ListItemIcon>
                              <Iconify icon={"ph:article-light"} />
                            </ListItemIcon>
                            <ListItemText primary={t("articles.options.categories")} />
                          </ListItemButton>
                        </ListItem>
                      </List>
                    </nav>
                  </Paper>
                </Box>
              </Grid>
              <Grid item xs={12} sm={8} md={8}>
                <Outlet />
              </Grid>
            </Grid>
          </Card>
        </Box>
      </Page>
    </>
  );
};

export default Index;
