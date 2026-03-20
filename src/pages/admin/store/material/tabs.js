import Iconify from "src/components/Iconify";

import Document from "./documents/index";
import Video from "./videos/index";

const useTab = () => {
  return [
    {
      label: "business_builder.materials.menu.document",
      value: "document",
      icon: <Iconify icon={"radix-icons:section"} width={20} height={20} />,
      component: <Document />,
    },
    {
      label: "business_builder.materials.menu.video",
      value: "video",
      icon: (
        <Iconify
          icon={"pixelarticons:article-multiple"}
          width={20}
          height={20}
        />
      ),
      component: <Video />,
    },
  ];
};
export default useTab;
