import Iconify from "src/components/Iconify";
import { PATH_DASHBOARD } from "src/routes/paths";

const useProfileTabs = () => {
  return [
    {
      label: "profile.tabs.profile",
      value: "profile",
      icon: (
        <Iconify
          icon={"carbon:user-avatar-filled-alt"}
          width={20}
          height={20}
        />
      ),
      href: PATH_DASHBOARD.user.profile,
      name: "profile",
      is_subAdmin: false,
    },
    {
      label: "profile.tabs.edit",
      value: "edit-info",
      icon: <Iconify icon={"bx:comment-edit"} width={20} height={20} />,
      href: "edit",
      name: "edit-info",
      is_subAdmin: false,
    },
    {
      label: "profile.tabs.settings",
      value: "settings",
      icon: (
        <Iconify
          icon={"clarity:settings-solid-badged"}
          width={20}
          height={20}
        />
      ),
      href: "settings",
      name: "settings",
      is_subAdmin: false,
    },
    // {
    //   value: 'pay out',
    //   icon: <Iconify icon={'bi:currency-exchange'} width={20} height={20} />,
    // },
    // {
    //   value: 'enable 2FA',
    //   icon: <Iconify icon={'ic:baseline-security'} width={20} height={20} />,
    // },
    {
      label: "profile.tabs.referral",
      value: "referrals",
      icon: (
        <Iconify icon={"icon-park-solid:message-sent"} width={20} height={20} />
      ),
      href: "referrals",
      name: "referrals",
      is_subAdmin: true,
    },
    // {
    //   value: 'email settings',
    //   icon: <Iconify icon={'dashicons:email-alt'} width={20} height={20} />,
    // },
    {
      label: "profile.tabs.note",
      value: "notes",
      icon: (
        <Iconify
          icon={"fluent:clipboard-note-20-filled"}
          width={20}
          height={20}
        />
      ),
      href: "notes",
      name: "notes",
      is_subAdmin: false,
    },
  ];
};
export default useProfileTabs;
