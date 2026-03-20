import { Container, Typography } from "@mui/material";
import LoadingScreen from "src/components/LoadingScreen";
import Page from "src/components/Page";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";
import RootStyle from "src/pages/auth/shared/rootStyle";
import * as Yup from "yup";
import ContentStyle from "./components/content-style";
import Form from "./components/form";
import ImageCard from "./components/image-card";
import useGetTemplate from "./hooks/use-get-template";

export const leadSchema = Yup.object().shape({
  email: Yup.string()
    .email("errors.lead_capture.email.required")
    .required("errors.lead_capture.email.required"),
  username: Yup.string().required("errors.lead_capture.username.required"),
  mobile: Yup.string().required("errors.lead_capture.mobile.required"),
});

const Lead = () => {
  const { template, loading } = useGetTemplate();
  const { headline, Subheading, visuals, features_and_benefits } = template;
  return (
    <Page title="Login">
      <Ternary
        when={loading}
        then={<LoadingScreen />}
        otherwise={
          <RootStyle>
            <ImageCard
              title={headline}
              image={visuals}
              features_and_benefits={features_and_benefits}
            />

            <Container maxWidth="sm">
              <ContentStyle>
                <Typography gutterBottom variant="h6">
                  {Subheading}
                  {/* <Translate>lead_capture.enter_details</Translate> */}
                </Typography>
                <Form />
              </ContentStyle>
            </Container>
          </RootStyle>
        }
      />
    </Page>
  );
};

export default Lead;
