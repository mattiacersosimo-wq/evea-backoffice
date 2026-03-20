import Ternary from "src/components/ternary";

const ShowForPackage = ({ notReviewed, isReviews, children }) => {
  return <Ternary when={notReviewed && isReviews} then={children} />;
};

export default ShowForPackage;
