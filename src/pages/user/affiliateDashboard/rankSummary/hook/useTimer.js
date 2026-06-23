import { useEffect, useState } from "react";
import moment from "moment";

const useTimer = (expiry_date) => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Parse expiry_date in UTC format
  const expiryMoment = moment.utc(expiry_date);
  const timestamp = expiryMoment.valueOf();
  const timeBetween = timestamp - currentTime;

  const seconds = Math.floor((timeBetween / 1000) % 60) || 0;
  const minutes = Math.floor((timeBetween / 1000 / 60) % 60) || 0;
  const hours = Math.floor((timeBetween / (1000 * 60 * 60)) % 24) || 0;
  const days = Math.floor(timeBetween / (1000 * 60 * 60 * 24)) || 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    days,
    hours,
    minutes,
    seconds,
    expired: timeBetween <= 0,
  };
};

export default useTimer;
