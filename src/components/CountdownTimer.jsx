import { useState, useEffect } from "react";

export default function CountdownTimer({ departureDate, departureTime }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const target = new Date(`${departureDate}T${departureTime}`).getTime();

    const update = () => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft("Departed");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    update();
    const int = setInterval(update, 1000);
    return () => clearInterval(int);
  }, [departureDate, departureTime]);

  return (
    <span className={`text-sm font-mono ${timeLeft === "Departed" ? "text-red-500" : "text-purple-600 dark:text-purple-400"}`}>
      {timeLeft}
    </span>
  );
}
