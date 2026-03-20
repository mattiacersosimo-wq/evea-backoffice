import FourColGrid from "../../components/fourColGrid";
import EventCard from "./EventCard";

const _data = [
  {
    id: 1,
    image: "https://picsum.photos/200/140",
    time: 1661204693000,
    title: "Rosenbaum, Roberts and Lueilwitz",
  },
  {
    id: 2,
    image: "https://picsum.photos/200/140",
    time: 1642231649000,
    title: "Heathcote, Parisian and Morar",
  },
  {
    id: 3,
    image: "https://picsum.photos/200/140",
    time: 1653739819000,
    title: "Beahan-Boyle",
  },
  {
    id: 4,
    image: "https://picsum.photos/200/140",
    time: 1661492869000,
    title: "Greenholt, Bode and Lebsack",
  },
  {
    id: 5,
    image: "https://picsum.photos/200/140",
    time: 1645699758000,
    title: "Osinski-Crona",
  },
  {
    id: 6,
    image: "https://picsum.photos/200/140",
    time: 1654047747000,
    title: "Schimmel, Weimann and Jerde",
  },
  {
    id: 7,
    image: "https://picsum.photos/200/140",
    time: 1662173717000,
    title: "Lesch LLC",
  },
  {
    id: 8,
    image: "https://picsum.photos/200/140",
    time: 1634967311000,
    title: "Berge, Monahan and Stracke",
  },
  {
    id: 9,
    image: "https://picsum.photos/200/140",
    time: 1644290083000,
    title: "Lind Inc",
  },
  {
    id: 10,
    image: "https://picsum.photos/200/140",
    time: 1632295992000,
    title: "Johns-Murphy",
  },
];

const PastEvents = () => {
  return (
    <FourColGrid>
      {_data.map(({ id, ...item }) => (
        <EventCard key={id} {...item} />
      ))}
    </FourColGrid>
  );
};

export default PastEvents;
