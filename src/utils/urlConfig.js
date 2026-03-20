import { path } from "src/routes/paths";
const ADMIN_PATH = "/api/admin/";
const ADMIN_DASHBOARD = path(ADMIN_PATH, "dashboard/");

const URI = {
  admin: {
    subAdmin: {
      group: {
        groupMenu: path(ADMIN_PATH, "sub-admin-user-groups-menu"),
        create: path(ADMIN_PATH, `sub-admin-user-groups`),
        update: (id) => path(ADMIN_PATH, `sub-admin-user-groups/${id}`),
      },
    },
    network: {
      binaryBonus: path(ADMIN_DASHBOARD, "binary-bonus-upcoming-week"),
      bonusGraph: path(ADMIN_DASHBOARD, "network-bonus"),
      supportTickets: path(ADMIN_DASHBOARD, "support-tickets"),
      registeredMembers: path(ADMIN_DASHBOARD, "registered-members"),
      latestRegistrations: path(ADMIN_DASHBOARD, "latest-registartions"),
      topRecruiters: path(ADMIN_DASHBOARD, "top-recruiters"),
      networkJoining: path(ADMIN_DASHBOARD, "network-joining"),
      rankCount: path(ADMIN_DASHBOARD, "team-rank-count"),
      worldMap: path(ADMIN_DASHBOARD, "members-map"),
    },

    settings: {
      network: {
        rank: {
          index: path(ADMIN_PATH, "settings-rank"),
          update: (id) => path(ADMIN_PATH, `settings-rank/${id}`),
        },
        bronze: {
          index: path(ADMIN_PATH, "bronzachievementsettings"),
          update: (id) => path(ADMIN_PATH, `bronzachievementsettings/${id}`),
        },
        binary: {
          index: path(ADMIN_PATH, "binarysettings"),
          update: (id) => path(ADMIN_PATH, `binarysettings/${id}`),
        },
        referral: {
          index: path(ADMIN_PATH, "refferalbonussettings"),
          update: (id) => path(ADMIN_PATH, `refferalbonussettings/${id}`),
        },

        firstOrder: {
          index: path(ADMIN_PATH, "firstordersettings"),
          update: (id) => path(ADMIN_PATH, `firstordersettings/${id}`),
        },
        stair: {
          index: path(ADMIN_PATH, "stair-step"),
          update: (id) => path(ADMIN_PATH, `stair-step/${id}`),
        },
      },
    },
  },
  user: {},
};

export default URI;
