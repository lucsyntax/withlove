import { useEffect, useState, useCallback } from "react";

export default function Countdown({ startDate }) {
  // Usando useCallback para memorizar a função e evitar recriação
  const calculateTimeLeft = useCallback(() => {
    const now = new Date();
    const start = new Date(startDate);
    const difference = now - start;
    const totalSeconds = Math.floor(difference / 1000);

    const years = Math.floor(totalSeconds / (3600 * 24 * 365));
    const days = Math.floor((totalSeconds % (3600 * 24 * 365)) / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      years,
      days,
      hours,
      minutes,
      seconds,
    };
  }, [startDate]); // Dependência: o valor de startDate

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]); // useEffect vai depender do calculateTimeLeft

  return (
    <div className="text-center mt-6 text-xl">
      <p className="text-4xl font-bold mb-2">
        Juntos há {timeLeft.years} anos, {timeLeft.days} dias, {timeLeft.hours}{" "}
        horas, {timeLeft.minutes} minutos, {timeLeft.seconds} segundos
      </p>
    </div>
  );
}
