import isAdmin from "./isAdmin";

const getActions = (gp, p) => {
  const menu = JSON.parse(localStorage.getItem("menu") || "[]");

  return gp !== p
    ? menu
        ?.find(Boolean)
        .items?.find(({ title }) => title === gp)
        ?.children?.find(({ title }) => title === p)?.actions || []
    : menu?.find(Boolean).items?.find(({ title }) => title === gp)?.actions ||
        [];
};

export const checkActive = (arg, actions = []) =>
  Boolean(actions.find((action) => action === arg));

export const notActive = (arg, actions) => checkActive(arg, actions);

export const isMenuActive = (gp, p) => (arg) =>
  isAdmin() ? true : checkActive(arg, getActions(gp, p ? p : gp));

export const menuExist = () => Boolean(localStorage.getItem("menu"));

export const isMenuEmpty = () => !menuExist();
