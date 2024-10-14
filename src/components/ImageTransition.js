import Image from "next/image";
import React, { useEffect, useState } from "react";
import styles from "./slider.module.css"; // Reutilizando o CSS existente

const ImageTransition = ({ validImageUrls }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    if (validImageUrls.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          return nextIndex >= validImageUrls.length ? 0 : nextIndex;
        });
      }, 5000); // Tempo de troca de imagem

      return () => clearInterval(interval);
    }
  }, [validImageUrls]);

  useEffect(() => {
    createHearts(); // Gera corações quando a imagem troca
  }, [currentIndex]);

  const createHearts = () => {
    const newHearts = [...Array(20)].map((_, index) => ({
      id: Date.now() + index,
      left: Math.random() * 100,
      size: Math.random() * 20 + 10,
      delay: Math.random() * 0.5,
      duration: Math.random() * 2 + 3,
      startTop: Math.random() * -30 - 10,
    }));
    setHearts(newHearts);
  };

  useEffect(() => {
    const removeOldHearts = setInterval(() => {
      setHearts((prevHearts) =>
        prevHearts.filter((heart) => Date.now() - heart.id < 5000)
      );
    }, 5000);

    return () => clearInterval(removeOldHearts);
  }, []);

  if (validImageUrls.length === 0) {
    return null;
  }

  return (
    <div className={styles.slider}>
      {validImageUrls.map((imageUrl, index) => (
        <div
          key={index}
          className={`${styles.slide} ${
            index === currentIndex ? styles.active : ""
          }`}
        >
          <Image
            src={imageUrl}
            alt={`Image ${index}`}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      ))}

      {/* Animação dos corações */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className={styles.heart}
          style={{
            left: `${heart.left}%`,
            width: `${heart.size}px`,
            height: `${heart.size}px`,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
            top: `${heart.startTop}%`,
          }}
        >
          <Image
            src="/images/love.png"
            width={heart.size}
            height={heart.size}
          />
        </div>
      ))}
    </div>
  );
};

export default ImageTransition;
