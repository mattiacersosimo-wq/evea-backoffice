import Iconify from "src/components/Iconify";

const TABS = [
  {
    name: "assign_subscriptions.products",
    icon: (
      <Iconify
        icon={"eos-icons:product-classes-outlined"}
        width={20}
        height={20}
      />
    ),
    value: "product",
  },
  {
    name: "assign_subscriptions.trashed",
    icon: <Iconify icon={"bytesize:trash"} width={20} height={20} />,
    value: "trashed",
  },
  {
    name: "assign_subscriptions.category",
    icon: <Iconify icon={"bx:category"} width={20} height={20} />,
    value: "categories",
  },
];

export default TABS;
