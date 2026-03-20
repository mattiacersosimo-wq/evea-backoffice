import { twoPlaceRound } from "src/utils/round";
import Ternary from "../ternary";

export const TwoPrecisionRound = ({ number }) => twoPlaceRound(number);

export const ReturnNullOnCondition = ({ children, condition }) => {
    return <Ternary when={condition} then={children} />;
};
