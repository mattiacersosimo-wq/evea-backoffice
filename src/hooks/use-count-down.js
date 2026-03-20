import { useEffect, useState } from "react";

// Takes countdown in seconds
const getTime = (countdown = 0) => {
  const formattedCountdown = Math.max(0, countdown); // Ensure countdown doesn't go below zero

  return {
    days: Math.floor(formattedCountdown / (1000 * 60 * 60 * 24)),
    hours: Math.floor((formattedCountdown / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((formattedCountdown / 1000 / 60) % 60),
    seconds: Math.floor((formattedCountdown / 1000) % 60),
  };
};

const useCountDown = (upperLimit, count = true) => {
  const [remainingTime, setRemainingTime] = useState(0); // In seconds
  useEffect(() => {
    setRemainingTime(upperLimit - Date.parse(new Date()));
  }, [upperLimit]);

  const decrementTime = () =>
    setRemainingTime((prevTimeInSeconds) => prevTimeInSeconds - 1000);

  useEffect(() => {
    if (count) {
      const intervalId = setInterval(decrementTime, 1000);
      return () => clearInterval(intervalId);
    }
  }, []);

  return getTime(remainingTime);
};

export default useCountDown;
