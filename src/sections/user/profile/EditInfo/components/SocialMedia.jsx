import {
  FormControl,
  FormGroup,
  FormHelperText,
  FormLabel,
  Typography,
} from "@mui/material";
import { RHFSwitch } from "src/components/hook-form";
import Translate from "src/components/translate";

const SocialMedia = () => {
  return (
    <FormControl component="fieldset" variant="standard">
      <FormLabel component="legend">
        <Typography
          variant="subtitle2"
          sx={{ mb: 0.5 }}
          style={{ color: "#212B36" }}
        >
          <Translate>{"profile.socialMediaScope"}</Translate>
        </Typography>
      </FormLabel>
      <FormGroup>
        <RHFSwitch
          name="social.scope_phone"
          label="profile.edit.social.phone"
        />
        <RHFSwitch name="social.scope_email" label="profile.edit.social.mail" />
        <RHFSwitch
          name="social.scope_facebook"
          label="profile.edit.social.fb"
        />
        <RHFSwitch name="social.scope_twitter" label="profile.edit.social.x" />
        <RHFSwitch
          name="social.scope_whatsapp"
          label="profile.edit.social.whatsapp"
        />
        <RHFSwitch
          name="social.scope_instagram"
          label="profile.edit.social.insta"
        />
        <RHFSwitch
          name="social.scope_telegram"
          label="profile.edit.social.tele"
        />
        <RHFSwitch
          name="social.scope_medium"
          label="profile.edit.social.medium"
        />
      </FormGroup>
      <FormHelperText>
        <Translate> {"profile.public_private"}</Translate>
      </FormHelperText>
    </FormControl>
  );
};

export default SocialMedia;
