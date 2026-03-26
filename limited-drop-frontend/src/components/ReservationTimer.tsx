import { useEffect, useState } from "react";

interface Props {
  expiresAt: string;
  onExpire: () => void;
}

export const ReservationTimer = ({ expiresAt, onExpire }: Props) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const expireTime = new Date(expiresAt).getTime();
    const update = () => {
      const diff = expireTime - Date.now();
      if (diff <= 0) {
        setTimeLeft(0);
        onExpire();
      } else {
        setTimeLeft(diff);
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return <span className="reservation-timer">{minutes}:{seconds < 10 ? "0" : ""}{seconds}</span>;
};