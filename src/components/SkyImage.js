import { useEffect, useState } from "react";
import { getApodData } from "../pages/api/nasa";
import Image from "next/image";

// Função para formatar a data
const formatDate = (dateString) => {
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
};

const SkyImage = ({ date }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApod = async () => {
      try {
        if (!date) return;

        const apodData = await getApodData(date);

        if (apodData.media_type !== "image") {
          throw new Error("Mídia retornada não é uma imagem.");
        }

        const imageUrl = apodData.hdurl || apodData.url;

        if (!imageUrl) {
          throw new Error("Nenhuma URL de imagem encontrada.");
        }

        setData({ ...apodData, imageUrl });
        setError(null);
      } catch (err) {
        setError("Erro ao carregar a imagem do céu.");
      }
    };

    fetchApod();
  }, [date]);

  if (error) return <p>{error}</p>;

  return (
    <div>
      {data ? (
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-pink-700">
            Estava assim o céu no dia em que começamos nossa história
          </h1>
          <div className="rounded-lg overflow-hidden max-w-80 w-full">
            <Image
              src={data.imageUrl} // Certifique-se de que a URL esteja correta e configurada no next.config.js para domínios externos
              alt={data.title}
              width={640} // max-w-80 é aproximadamente 640px (se o tamanho base do tailwind for 8)
              height={400} // h-[25rem] = 400px
              layout="responsive" // Garante que a imagem seja responsiva e respeite o aspect ratio
              className="rounded-lg" // Adiciona bordas arredondadas
            />
          </div>
          <p className="text-white text-sm">
            Essa é uma foto exatamente do dia {formatDate(date)}
          </p>
          <p className="text-white-300 text-xs mb-10 rounded-sm p-2">
            &quot;Em ti encontro todas as coisas que o mundo me negou.&#10; És o
            céu que cobre meus dias,&#10; o chão que sustenta meus passos&#10; e
            o ar que preenche meus pulmões de amor e vida&quot;
          </p>
        </div>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
};

export default SkyImage;
