import { Button } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router";
import Iconify from "src/components/Iconify";
import Translate from "src/components/translate";
import buildPath from "src/utils/build-path";
import objectToQueryString from "src/utils/object-to-query-string";
import squashPathAndQueryString from "src/utils/squash-path-and-query-string";

const GoogleOAuthButton = ({ buttonLabel, plan }) => {
    const navigate = useNavigate();

    const login = useGoogleLogin({
        onSuccess: (codeResponse) =>
            navigate(
                squashPathAndQueryString(
                    buildPath("/auth/O-auth", codeResponse.access_token),
                    objectToQueryString({ plan })
                )
            ),
    });

    return (
        <>
            <Button
                endIcon={<Iconify icon="logos:google-icon" />}
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                onClick={login}
            >
                <Translate>{buttonLabel}</Translate>
            </Button>
        </>
    );
};

export default GoogleOAuthButton;
