import ShowTwoFactorAuth from "src/components/show-two-factor-auth";
import Ternary from "src/components/ternary";
import LocalStorageClear from "src/sections/user/profile/LocalStorageClear";
import MarketingPreferences from "./components/marketing-preferences";
import ToggleTwoFactorAuth from "./components/toggle-two-factor-auth";
import UpdatePassword from "./components/update-password";

const ProfileAccountSettings = () => {
  const isImpersonate = localStorage.getItem("isImpersonate");

  return (
    <div>
      <UpdatePassword />

      {/* <ProfilePayoutInfo /> */}
      {/* <ProfileEnable /> */}
      <ShowTwoFactorAuth>
        <ToggleTwoFactorAuth />
      </ShowTwoFactorAuth>
      <MarketingPreferences />
      <Ternary when={!isImpersonate} then={<LocalStorageClear />} />
    </div>
  );
};

export default ProfileAccountSettings;
