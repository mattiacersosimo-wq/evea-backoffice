const getColor = (badge) => {
  switch (badge) {
    case "expired": {
      return "error";
    }
    case "active": {
      return "success";
    }

    case "renew": {
      return "warning";
    }
  }
};

export default getColor;
