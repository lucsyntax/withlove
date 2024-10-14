import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});

const LetterAnimation = ({ animationPath, customMessage }) => {
  const [isClient, setIsClient] = useState(false);
  const [showMessage, setShowMessage] = useState(false); // Controle da mensagem

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleClick = () => {
    setShowMessage(true); // Exibir a mensagem após o clique
  };

  const handleCloseMessage = () => {
    setShowMessage(false); // Fechar a mensagem
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="relative flex justify-center items-center">
      <div onClick={handleClick} className="cursor-pointer">
        <Lottie
          animationData={require("/public/animations/letter.json")} // Atualize para o caminho correto
          style={{ height: "200px", width: "200px" }}
          loop={true} // Animação em loop
          autoplay={true} // Iniciar animação automaticamente
        />
      </div>

      {showMessage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 backdrop-blur-sm"
          onClick={handleCloseMessage}
        >
          <div
            className="p-5 bg-white rounded-lg shadow-lg text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-red-600">{customMessage}</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default LetterAnimation;
