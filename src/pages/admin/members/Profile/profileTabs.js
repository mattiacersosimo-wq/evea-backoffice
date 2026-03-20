import Iconify from "src/components/Iconify";

const PROFILE_TABS = [
  {
    label: "profile.tabs.profile",
    icon: (
      <Iconify icon={"carbon:user-avatar-filled-alt"} width={20} height={20} />
    ),
    value: "profile",
  },
  {
    label: "profile.tabs.edit",
    icon: <Iconify icon={"bx:comment-edit"} width={20} height={20} />,
    value: "edit",
  },
  {
    label: "profile.tabs.settings",
    icon: (
      <Iconify icon={"clarity:settings-solid-badged"} width={20} height={20} />
    ),
    value: "settings",
  },
  {
    label: "profile.tabs.referral",
    icon: (
      <Iconify icon={"icon-park-solid:message-sent"} width={20} height={20} />
    ),
    value: "referrals",
    user: true,
  },

  {
    label: "profile.tabs.note",
    icon: (
      <Iconify
        icon={"fluent:clipboard-note-20-filled"}
        width={20}
        height={20}
      />
    ),
    value: "notes",
  },
];

export default PROFILE_TABS;
