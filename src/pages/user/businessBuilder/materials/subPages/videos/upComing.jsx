import FourColGrid from "../../components/fourColGrid";
import EventCard from "./EventCard";

const _data = [
  {
    id: 1,
    image: "https://picsum.photos/200/140",
    time: 1657368789000,
    title: "Hirthe-Wiegand",
  },
  {
    id: 2,
    image: "https://picsum.photos/200/140",
    time: 1638000597000,
    title: "Roob LLC",
  },
  {
    id: 3,
    image: "https://picsum.photos/200/140",
    time: 1637227112000,
    title: "Ziemann Inc",
  },
  {
    id: 4,
    image: "https://picsum.photos/200/140",
    time: 1655079036000,
    title: "Rogahn-Pfeffer",
  },
  {
    id: 5,
    image: "https://picsum.photos/200/140",
    time: 1636184319000,
    title: "Botsford, Monahan and Hintz",
  },
  {
    id: 6,
    image: "https://picsum.photos/200/140",
    time: 1648892705000,
    title: "Ullrich-Kris",
  },
  {
    id: 7,
    image: "https://picsum.photos/200/140",
    time: 1642234956000,
    title: "Durgan, Connelly and Nader",
  },
  {
    id: 8,
    image: "https://picsum.photos/200/140",
    time: 1650001261000,
    title: "Pfannerstill-Beer",
  },
  {
    id: 9,
    image: "https://picsum.photos/200/140",
    time: 1636637633000,
    title: "Keeling-Ratke",
  },
  {
    id: 10,
    image: "https://picsum.photos/200/140",
    time: 1644525178000,
    title: "Weissnat-Schumm",
  },
];

const UpComing = () => {
  return (
    <FourColGrid>
      {_data.map(({ id, ...item }) => (
        <EventCard key={id} {...item} />
      ))}
    </FourColGrid>
  );
};

export default UpComing;
