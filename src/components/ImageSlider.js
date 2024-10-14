import React, { useEffect, useState } from "react";
import styles from "./slider.module.css";
import Image from "next/image";

const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Tempo de transição entre as imagens (3 segundos)

    return () => clearInterval(interval); // Limpa o intervalo quando o componente for desmontado
  }, [images.length]);

  const createHearts = () => {
    const newHearts = [...Array(20)].map((_, index) => ({
      id: Date.now() + index, // Usando timestamp como ID único
      left: Math.random() * 100, // Posição horizontal aleatória
      size: Math.random() * 20 + 10, // Tamanho aleatório
      delay: Math.random() * 0.5, // Delay aleatório para animação
      duration: Math.random() * 2 + 3, // Duração da queda
      startTop: Math.random() * -30 - 10, // Posição inicial acima da tela
    }));

    setHearts(newHearts);
  };

  // Chamar createHearts sempre que a imagem mudar
  useEffect(() => {
    createHearts();
  }, [currentIndex]);

  // Remove corações antigos (que já caíram da tela) a cada 5 segundos
  useEffect(() => {
    const removeOldHearts = setInterval(() => {
      setHearts((prevHearts) =>
        prevHearts.filter((heart) => Date.now() - heart.id < 5000)
      );
    }, 5000);

    return () => clearInterval(removeOldHearts);
  }, []);
  return (
    <div className={styles.slider}>
      {images.map((image, index) => (
        <div
          key={index}
          className={`${styles.slide} ${
            index === currentIndex ? styles.active : ""
          }`}
        >
          <Image
            src={image}
            alt={`Slide ${index}`}
            layout="fill"
            className="border-2 border-black "
          />
        </div>
      ))}

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
          <Image src={"/images/love.png"} width="5px" height="5px" />
        </div>
      ))}
    </div>
  );
};

export default ImageSlider;
