import React, { useEffect, useState, useRef } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import YouTube from "react-youtube";
import ImageTransition from "./ImageTransition";
import LetterAnimation from "./LetterAnimation";
import SkyAnimation from "./SkyAnimation";
import PaperPlaneAnimation from "./PaperPlaneAnimation";
import SkyImage from "./SkyImage";
import loveMessages from "../components/loveMessages.json"; // Mesma lista de mensagens
import TextInput from "./TextInput";

const CouplePreview = ({
  coupleName,
  relationshipDate,
  customMessage,
  imageUrls,
  datePart,
  youtubeUrl, // Adicionar YouTube URL no preview
}) => {
  const [timeTogether, setTimeTogether] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState(null);
  const [volume, setVolume] = useState(10);
  const validImageUrls = Array.isArray(imageUrls) ? imageUrls : [];
  const intervalRef = useRef(null);

  useEffect(() => {
    const calculateTimeTogether = () => {
      const now = new Date();
      const startDate = new Date(relationshipDate);
      const diffTime = Math.abs(now - startDate);
      const years = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
      const months = Math.floor(
        (diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30)
      );
      const days = Math.floor(
        (diffTime % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)
      );
      const hours = Math.floor(
        (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);

      setTimeTogether({ years, months, days, hours, minutes, seconds });
    };

    calculateTimeTogether();
    const interval = setInterval(calculateTimeTogether, 1000);
    return () => clearInterval(interval);
  }, [relationshipDate]);

  // Função para alternar reprodução/pausa do vídeo
  const togglePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Configurações do player de YouTube
  const onPlayerReady = (event) => {
    setPlayer(event.target);
    event.target.setVolume(volume);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (player) {
      player.setVolume(newVolume);
    }
  };

  const opts = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 1,
    },
  };

  // Hook para rotação de mensagens de amor
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % loveMessages.length);
    }, 3000);

    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="border-2 border-gray-800 rounded-lg overflow-hidden w-full max-w-4xl mx-auto">
      {/* Barra de simulação do navegador */}
      <div className="bg-gray-800 p-2 flex items-center">
        <div className="flex gap-2 mr-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <input
          type="text"
          value={`with-lov.com/${coupleName
            .replace(/\s+/g, "-")
            .toLowerCase()}`}
          readOnly
          className="w-full px-2 border-none rounded bg-white font-bold text-black text-sm"
        />
      </div>

      <div className="flex justify-center p-4 w-full">
        <h2 className="text-white text-sm">
          Olá meu amor, estive pensando em você, em nós...
        </h2>
      </div>

      {/* Imagem */}
      <ImageTransition validImageUrls={validImageUrls} />

      {/* Controle de volume e vídeo */}
      {youtubeUrl && (
        <div className="flex flex-col items-center">
          <button className="text-black" onClick={togglePlayPause}>
            {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
          </button>
          <YouTube
            videoId={youtubeUrl.split("v=")[1]}
            opts={opts}
            onReady={onPlayerReady}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            aria-label="Controle de volume"
            className="w-80 h-0.5 bg-black rounded-sm appearance-none cursor-pointer accent-pink-700"
          />
        </div>
      )}

      {/* Contador de tempo e mensagem */}
      <div className="p-5 text-white text-center">
        <h1 className="text-xl mb-2">
          {relationshipDate && (
            <>
              <span className="text-pink-600">{timeTogether.years}</span> anos,{" "}
            </>
          )}
          {(timeTogether.months > 0 || timeTogether.years > 0) && (
            <>
              <span className="text-pink-600">{timeTogether.months}</span>{" "}
              meses,{" "}
            </>
          )}
          {(timeTogether.days > 0 ||
            timeTogether.months > 0 ||
            timeTogether.years > 0) && (
            <>
              <span className="text-pink-600">{timeTogether.days}</span> dias,{" "}
            </>
          )}
          {(timeTogether.hours > 0 ||
            timeTogether.days > 0 ||
            timeTogether.months > 0 ||
            timeTogether.years > 0) && (
            <>
              <span className="text-pink-600">{timeTogether.hours}</span> horas,{" "}
            </>
          )}
          {(timeTogether.minutes > 0 ||
            timeTogether.hours > 0 ||
            timeTogether.days > 0 ||
            timeTogether.months > 0 ||
            timeTogether.years > 0) && (
            <>
              <span className="text-pink-600">{timeTogether.minutes}</span>{" "}
              minutos e{" "}
            </>
          )}
          {!isNaN(timeTogether.seconds) && (
            <>
              <span className="text-pink-600">{timeTogether.seconds}</span>
              <span> segundos</span>
            </>
          )}
        </h1>

        {relationshipDate && (
          <>
            <LetterAnimation customMessage={customMessage} />
            <p className="text-white text-sm">Olhei o céu e descobri...</p>
            <SkyAnimation />
            <SkyImage date={relationshipDate.split("T")[0]} />
          </>
        )}
      </div>

      {/* Mensagens de amor rotativas */}
      <div className="text-white text-center">
        <p className="bg-white/50 rounded-xl text-pink-700 text-center">
          {loveMessages[currentIndex].message}
        </p>
        <p className="text-white text-xs">
          {loveMessages[currentIndex].language}
        </p>
      </div>
      <PaperPlaneAnimation />
      <TextInput />
    </div>
  );
};

export default CouplePreview;
