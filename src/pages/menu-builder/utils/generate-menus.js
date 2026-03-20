import genArchives from "./gen-archive";

const generateMenus = (menuList = []) => {
  let temp = genArchives();
  menuList.forEach(({ items }) => {
    items.forEach((menu) => {
      const { children, plans, ...restMenu } = menu;
      if (plans?.length > 0) {
        plans.forEach((plan) => {
          let tempMenu = { ...restMenu, children: [] };
          let planData = temp[plan];
          children?.forEach((child) => {
            const { plans, ...restMenu } = child;
            if (plans?.length > 0) {
              plans.forEach((innerPlan) => {
                if (innerPlan === plan) {
                  tempMenu.children = [...tempMenu.children, restMenu];
                }
              });
            } else {
              tempMenu.children = [...tempMenu.children, restMenu];
            }
          });
          planData = [...planData, tempMenu];
          temp[plan] = planData;
        });
      } else {
        Object.keys(temp).forEach((plan) => {
          let tempMenu = { ...restMenu, children: [] };
          children?.forEach((child) => {
            const { plans, ...restMenu } = child;
            if (plans?.length > 0) {
              plans.forEach((innerPlan) => {
                if (innerPlan === plan) {
                  tempMenu.children = [...tempMenu.children, restMenu];
                }
              });
            } else {
              tempMenu.children = [...tempMenu.children, restMenu];
            }
          });
          temp[plan] = [...temp[plan], tempMenu];
        });
      }
    });
  });
  return Object.entries(temp).reduce((acc, [k, v]) => {
    return { ...acc, [k]: [{ items: v }] };
  }, {});
};

export default generateMenus;
