import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import YouTube from "react-youtube";
import ImageSlider from "../components/ImageSlider";
import LetterAnimation from "../components/LetterAnimation";
import SkyAnimation from "../components/SkyAnimation";
import SkyImage from "../components/SkyImage";
import loveMessages from "../components/loveMessages.json";
import PaperPlaneAnimation from "@/components/PaperPlaneAnimation";
import TextInput from "@/components/TextInput";
import { collection, query, where, getDocs } from "firebase/firestore"; // Importações necessárias do Firestore
import { db } from "@/pages/api/firebase";
import Image from "next/image";
import Head from "next/head";
import { QRCodeCanvas } from "qrcode.react";
import Modal from "@/components/Modal";
import AOS from "aos";
import "aos/dist/aos.css";

const CouplePage = ({ coupleData }) => {
  // Inicializando hooks
  const router = useRouter();
  const { coupleName } = router.query;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState(null);
  const [volume, setVolume] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeTogether, setTimeTogether] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [relationshipDate, setRelationshipDate] = useState(
    coupleData.relationshipDate
  );
  const [customMessage, setCustomMessage] = useState(coupleData.customMessage);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const messageRef = useRef(null);
  const intervalRef = useRef(null);

  const generateQrCodeUrl = () => {
    const url = `https://www.with-lov.com/${coupleName}?hash=${coupleData.uniqueHash}`;
    return url;
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handlePrint = () => {
    // Tente obter o elemento canvas que contém o QR code
    const canvas = document.getElementById("qrCode");

    // Verifique se o canvas realmente existe
    if (canvas) {
      // Converta o canvas em uma imagem base64
      const qrCodeDataUrl = canvas.toDataURL("image/png");

      // Crie um iframe invisível
      const iframe = document.createElement("iframe");
      iframe.style.position = "absolute";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "none";

      document.body.appendChild(iframe); // Adiciona o iframe ao documento

      // Insira o conteúdo no iframe
      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(`
        <html>
          <head><title>QR Code</title></head>
          <body>
            <img id="qrImage" src="${qrCodeDataUrl}" style="width:100%; height:auto;" />
          </body>
        </html>
      `);
      doc.close();

      // Verifique se a imagem foi carregada antes de imprimir
      const qrImage = iframe.contentWindow.document.getElementById("qrImage");

      // Aguarde a imagem ser completamente carregada antes de imprimir
      qrImage.onload = () => {
        iframe.contentWindow.focus(); // Foca no iframe
        iframe.contentWindow.print(); // Executa o comando de impressão

        // Remove o iframe após a impressão
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      };
    } else {
      console.error("QR Code canvas not found.");
    }
  };

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

  // Hook para montar o componente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Hook para observar a visibilidade do componente
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (messageRef.current) {
      observer.observe(messageRef.current);
    }

    return () => {
      if (messageRef.current) {
        observer.unobserve(messageRef.current);
      }
    };
  }, []);

  // Hook para rotação de mensagens de amor
  useEffect(() => {
    if (isVisible) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % loveMessages.length);
      }, 3000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isVisible]);

  // Hook para calcular o tempo juntos
  useEffect(() => {
    if (typeof window !== "undefined") {
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
    }
  }, [relationshipDate]);

  if (!coupleData) return <div>Carregando...</div>;

  function formatCoupleName(coupleName) {
    return coupleName
      .split("-")
      .map((word) =>
        word === "e" ? word : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  }

  const formattedName = formatCoupleName(coupleName);

  return (
    <>
      <Head>
        <title>{formattedName}</title>
      </Head>
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1 className="text-white mb-8" data-aos="fade-up">
          Olá meu amor, estive pensando em você, em nós...
        </h1>
        {coupleData.youtubeUrl && (
          <button className="text-black" onClick={togglePlayPause}>
            {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
          </button>
        )}

        <YouTube
          videoId={coupleData.youtubeUrl.split("v=")[1]} // Extrai o ID do vídeo do YouTube
          opts={opts}
          onReady={onPlayerReady}
        />

        <ImageSlider images={coupleData.photos || []} />
        {coupleData.youtubeUrl && (
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            aria-label="Controle de volume"
            className="w-80 h-0.5 bg-black rounded-sm appearance-none cursor-pointer accent-pink-700"
            style={{
              WebkitAppearance: "none",
              appearance: "none",
            }}
          />
        )}

        <style jsx>{`
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            height: 12px;
            width: 12px;
            border-radius: 50%;
            background-color: #000;
            cursor: pointer;
            margin-top: -7px;
          }

          input[type="range"]::-moz-range-thumb {
            height: 12px;
            width: 12px;
            border-radius: 50%;
            background-color: #000;
            cursor: pointer;
          }

          input[type="range"]::-webkit-slider-runnable-track {
            height: 1px;
          }
          input[type="range"]::-moz-range-track {
            height: 1px;
          }
        `}</style>

        <div className="mt-5 text-white">
          <h2 className="text-base">{formattedName}</h2>
        </div>

        <div className="mt-5 text-white">
          <h2 className="text-base">
            Juntos há{" "}
            {timeTogether.years > 0 && (
              <>
                <span className="text-pink-600">{timeTogether.years}</span>{" "}
                anos,{" "}
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
                <span className="text-pink-600">{timeTogether.hours}</span>{" "}
                horas,{" "}
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
            <span className="text-pink-600">{timeTogether.seconds}</span>{" "}
            segundos
          </h2>

          <LetterAnimation customMessage={customMessage} />
        </div>

        <p className="text-white text-sm">
          Estava olhando o céu, e descobri uma coisa
        </p>

        <SkyAnimation />
        <div className="flex justify-center mb-10">
          <Image
            src="/images/arrow.png" // Caminho relativo à pasta public
            alt="Seta apontando para baixo"
            width={150} // Largura desejada
            height={150} // Altura desejada
          />
        </div>
        <SkyImage date={relationshipDate.split("T")[0]} />

        <h2 className="text-white text-sm">
          E tudo que eu quero te dizer com isso é:
        </h2>
        <div className="transition-opacity duration-700" ref={messageRef}>
          <p className="bg-white/50 rounded-xl text-pink-700 text-center">
            {loveMessages[currentIndex].message}
          </p>
          <p className="text-white text-xs">
            {loveMessages[currentIndex].language}
          </p>
        </div>
        <div>
          <PaperPlaneAnimation />
        </div>
        <div>
          <TextInput hash={coupleData.uniqueHash} />
        </div>
        <button
          className="bg-pink-500 text-white px-4 py-2 rounded"
          onClick={toggleModal}
        >
          Gerar QR Code
        </button>
        {isModalOpen && (
          <Modal onClose={toggleModal}>
            <div className="flex flex-col items-center">
              <h2 className="text-2xl text-black mb-4">Seu QR Code</h2>
              <QRCodeCanvas
                id="qrCode"
                value={generateQrCodeUrl()}
                size={256}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"H"}
                includeMargin={true}
              />
              <div className="mt-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  onClick={handlePrint}
                >
                  Imprimir
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    if (navigator.share) {
                      navigator
                        .share({
                          title: "QR Code",
                          url: generateQrCodeUrl(),
                        })
                        .catch((error) =>
                          console.error("Erro ao compartilhar:", error)
                        );
                    } else {
                      alert(
                        "Compartilhamento não suportado no seu dispositivo"
                      );
                    }
                  }}
                >
                  Compartilhar
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const { hash } = context.query;

  if (!hash) {
    return {
      notFound: true, // Retorna uma página 404 se o hash não estiver presente
    };
  }

  // Buscando todos os documentos na coleção "couples"
  const coupleQuery = query(
    collection(db, "couples"),
    where("uniqueHash", "==", hash) // Filtrando pelo uniqueHash
  );

  const querySnapshot = await getDocs(coupleQuery);

  if (!querySnapshot.empty) {
    const coupleDoc = querySnapshot.docs[0]; // Pegando o primeiro documento encontrado
    return {
      props: {
        coupleData: coupleDoc.data(),
      },
    };
  }

  return {
    notFound: true, // Retorna 404 se nenhum documento correspondente for encontrado
  };
}

export default CouplePage;
