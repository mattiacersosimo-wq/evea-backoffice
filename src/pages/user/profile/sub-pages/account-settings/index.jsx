import ShowTwoFactorAuth from "src/components/show-two-factor-auth";
import Ternary from "src/components/ternary";
import LocalStorageClear from "src/sections/user/profile/LocalStorageClear";
import ToggleTwoFactorAuth from "./components/toggle-two-factor-auth";
import TransactionPassword from "./components/transaction-password";
import UpdatePassword from "./components/update-password";

const ProfileAccountSettings = () => {
  const isImpersonate = localStorage.getItem("isImpersonate");

  return (
    <div>
      <UpdatePassword />
      <TransactionPassword />

      {/* <ProfilePayoutInfo /> */}
      {/* <ProfileEnable /> */}
      <ShowTwoFactorAuth>
        <ToggleTwoFactorAuth />
      </ShowTwoFactorAuth>
      <Ternary when={!isImpersonate} then={<LocalStorageClear />} />
    </div>
  );
};

export default ProfileAccountSettings;
