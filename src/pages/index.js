import { useState } from "react";
import { useRouter } from "next/router";
import { db } from "./api/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./api/firebase";
import Background from "@/components/Background";
import CouplePreview from "../components/CouplePreview";
import Link from "next/link";
import CoupleForm from "../components/CoupleForm";
import Image from "next/image";
import Head from "next/head";

export default function Home() {
  const [previewData, setPreviewData] = useState({
    coupleName: "",
    relationshipDate: "",
    customMessage: "",
    imageUrls: [],
  });
  const [plan, setPlan] = useState("premium");
  const router = useRouter();
  const [coupleName, setCoupleName] = useState("");
  const [relationshipDate, setRelationshipDate] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [photos, setPhotos] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]); // Para armazenar os previews
  const [openQuestion, setOpenQuestion] = useState(1);

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const generateUniqueHash = () => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  const handleSubmit = async (coupleData) => {
    const { coupleName, relationshipDate, customMessage, photos, plan } =
      coupleData;

    try {
      // Gerar hash único
      const uniqueHash = generateUniqueHash();

      // Fazer o upload das fotos para o Firebase Storage e obter as URLs
      const photoURLs = await Promise.all(
        photos.map(async (photo) => {
          const storageRef = ref(
            storage,
            `couples/${uniqueHash}/${photo.name}`
          );
          await uploadBytes(storageRef, photo); // Faz upload da foto
          return await getDownloadURL(storageRef); // Obtém a URL da foto
        })
      );

      // Salvar os dados no Firestore
      await addDoc(collection(db, "couples"), {
        coupleName,
        relationshipDate,
        customMessage,
        photos: photoURLs, // Armazena as URLs das fotos
        plan,
        uniqueHash,
      });
    } catch (e) {
      console.error("Erro ao salvar os dados: ", e);
      alert("Erro ao salvar os dados, tente novamente.");
    }
  };

  return (
    <>
      <Head>
        <title>With-Lov - Um Presente de Amor, Unico e Inesquecivel</title>
        <meta
          name="description"
          content="Comemore o amor com mensagens personalizadas, contagens de tempo juntos e muito mais no With-Lov."
        />
        <meta
          name="keywords"
          content="amor, casal, mensagens personalizadas, contagem de tempo, personalização de presentes"
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://with-lov.com/" />
        <meta
          property="og:title"
          content="With-Lov - Um Presente de Amor, Unico e Inesquecivel"
        />

        <meta
          property="og:description"
          content="Comemore o amor com mensagens personalizadas, contagens de tempo juntos e muito mais no With-Lov."
        />

        <meta
          property="og:image"
          content="https://with-lov.com/images/logoa.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Head>
      <div className="min-h-screen text-white flex flex-col items-center justify-center">
        <div className="text-center max-w-2xl p-6">
          <h1 className=" text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-t from-red-400 via-red-300 to-white mb-6">
            Surpreenda seu amor
          </h1>

          <p className="text-base md:text-xl text-white">
            Crie um site dinâmico do seu relacionamento. Compartilhe com o seu
            amor e faça um
            <span className="text-pink-400">
              &nbsp;presente surpresa inesquecível
            </span>
            . Só apontar para o QR Code 💕
          </p>
        </div>

        {/* <div className="rounded-lg p-8 max-w-2xl w-full bg-800">
          <CoupleForm
            coupleName={coupleName}
            setCoupleName={setCoupleName}
            relationshipDate={relationshipDate}
            setRelationshipDate={setRelationshipDate}
            customMessage={customMessage}
            setCustomMessage={setCustomMessage}
            photos={photos}
            setPhotos={setPhotos}
            imagePreviews={imagePreviews}
            setImagePreviews={setImagePreviews}
            plan={plan}
            setPlan={setPlan}
            onSubmit={handleSubmit}
            setPreviewData={setPreviewData}
          />
        </div>
        <div>
          <h1>Preencha os campos acima e veja como vai ficar 👇</h1>
        </div>

        <div>
          <CouplePreview
            coupleName={previewData.coupleName}
            relationshipDate={previewData.relationshipDate}
            customMessage={previewData.customMessage}
            imageUrls={previewData.imageUrls}
          />
        </div> */}
        <Link href="/create">
          <button
            type="button"
            className="mb-10 w-80% bg-gradient-to-r from-pink-500 to-red-400 text-white text-2xl font-bold py-3 px-4 rounded-lg hover:bg-gradient-to-l focus:outline-none focus:ring-4 focus:ring-pink-300 shadow-[0_1px_30px_rgba(255,170,211,0.8)]"
          >
            Quero fazer nosso site
          </button>
        </Link>

        <div className="relative w-[350px] h-[350px] mb-10">
          <div className="absolute inset-0 flex items-center justify-center z-[-1]">
            <div className="w-[300px] h-[300px] rounded-full bg-gradient-to-r from-pink-500 to-purple-500 blur-2xl opacity-80"></div>
          </div>

          <Image
            src="/images/hero-image.webp"
            alt="Hero"
            width={350}
            height={350}
            className="object-cover relative z-10 rounded-[30px]"
          />
        </div>

        <div className="min-h-screen from-black via-gray-900 to-gray-800 text-white flex flex-col items-center justify-center p-6">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-2">
            Como funciona
            <Image
              className="inline-block"
              src="/images/heart.webp"
              alt="Sorriso"
              width={70}
              height={70}
            />
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-screen-lg w-full px-4">
            <div className="flex flex-col justify-between items-center p-1 bg-dark-700 border border-pink-400 rounded-md h-full">
              <h2 className="text-white font-bold text-xl md:text-2xl text-center">
                1. Preencha os dados
              </h2>
              <div className="flex-grow flex justify-end items-end">
                <Image
                  src="/images/doc.webp"
                  alt="Documento"
                  width={180}
                  height={180}
                />
              </div>
            </div>

            <div className="flex flex-col justify-between items-center p-1 bg-dark-700 border border-pink-500 rounded-md h-full">
              <h2 className="text-white font-bold text-xl md:text-2xl text-center">
                2. Faça o pagamento
              </h2>
              <div className="flex-grow flex justify-end items-end">
                <Image
                  src="/images/coin.webp"
                  alt="Moeda"
                  width={120}
                  height={120}
                />
              </div>
            </div>

            <div className="flex flex-col justify-between items-center p-1 bg-dark-700 border border-red-400 rounded-md h-full">
              <h2 className="text-white font-bold text-xl md:text-2xl text-center">
                3. Receba o seu site + QR Code no e-mail
              </h2>
              <div className="flex-grow flex justify-end items-end">
                <Image
                  src="/images/email-phone.webp"
                  alt="Email e Celular"
                  width={180}
                  height={180}
                />
              </div>
            </div>

            <div className="flex flex-col justify-between items-center p-1 bg-dark-700 border border-red-500 rounded-md h-full">
              <h2 className="text-white font-bold text-xl md:text-2xl text-center">
                4. Surpreenda seu amor
              </h2>
              <div className="flex-grow flex justify-end items-end">
                <Image
                  src="/images/tela-final.webp"
                  alt="Tela final"
                  width={200}
                  height={200}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="min-h-screen flex flex-col items-center justify-center py-16">
          <h2 className="text-4xl font-bold text-white mb-10">Preços</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
            {/* Plano Básico */}
            <div className="relative glassmorphism">
              <div className="relative bg-gradient-to-br from-black/40 via-black/20 to-transparent backdrop-blur-lg rounded-lg shadow-lg">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center p-4 bg-black/30">
                    <div>
                      <h3 className="text-xl font-bold text-white">Básico</h3>
                      <p className="text-4xl font-bold text-white">R$24</p>
                    </div>
                    <Image
                      src="/images/bear.webp"
                      alt="Básico"
                      width={80}
                      height={80}
                      className="ml-auto"
                    />
                  </div>
                  <div className="p-4 flex-1 ">
                    <ul className="space-y-3">
                      <li className="flex items-center text-white">
                        <span className="text-pink-500 mr-2">✔</span> 1 ano de
                        acesso
                      </li>
                      <li className="flex items-center text-white">
                        <span className="text-pink-500 mr-2">✔</span> 3 fotos
                      </li>
                      <li className="flex items-center text-white">
                        <span className="text-pink-500 mr-2">✔</span> Foto do
                        céu do dia exato
                      </li>
                      <li className="flex items-center text-white">
                        <span className="text-pink-500 mr-2">✔</span> Chat
                        particular para vocês
                      </li>
                      <li className="flex items-center text-white">
                        <span className="text-red-400 mr-2">✖</span> Sem música
                      </li>
                    </ul>
                    <Link href="/create">
                      <button
                        type="button"
                        className="bg-pink-500 text-white font-bold py-2 px-6 rounded-lg w-full mt-6"
                      >
                        Quero fazer nosso site
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Plano Premium */}
            <div className="relative bg-gradient-to-br from-black/40 via-black/20 to-transparent backdrop-blur-lg rounded-lg shadow-lg border-2 border-red-500">
              <span className="absolute top-[-16px] left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs/[10px] font-bold py-1 px-3 rounded-full whitespace-nowrap">
                MAIS ESCOLHIDO
              </span>
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 bg-black/30 border-b-2 border-red-500">
                  <div>
                    <h3 className="text-xl font-bold text-white">Premium</h3>
                    <p className="text-4xl font-bold text-white">R$29</p>
                  </div>
                  <Image
                    src="/images/heart-fire.webp"
                    alt="Premium"
                    width={80}
                    height={80}
                    className="ml-auto"
                  />
                </div>
                <div className="p-4 flex-1 ">
                  <ul className="space-y-3">
                    <li className="flex items-center text-white">
                      <span className="text-pink-500 mr-2">✔</span> Pra sempre
                    </li>
                    <li className="flex items-center text-white">
                      <span className="text-pink-500 mr-2">✔</span> 7 fotos
                    </li>
                    <li className="flex items-center text-white">
                      <span className="text-pink-500 mr-2">✔</span> Foto do céu
                      do dia exato
                    </li>
                    <li className="flex items-center text-white">
                      <span className="text-pink-500 mr-2">✔</span> Chat
                      particular para vocês
                    </li>
                    <li className="flex items-center text-white">
                      <span className="text-pink-500 mr-2">✔</span> Com música
                    </li>
                  </ul>
                  <Link href="/create">
                    <button
                      type="button"
                      className="bg-pink-500 text-white font-bold py-2 px-6 rounded-lg w-full mt-6"
                    >
                      Quero fazer nosso site
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="min-h-screen from-black via-gray-900 to-gray-800 text-white flex flex-col items-center justify-center p-6">
          <h1 className="text-4xl font-extrabold text-white mb-6">
            Perguntas Frequentes
          </h1>
          <div className="max-w-6xl text-lg">
            <div className="space-y-3">
              {/* Pergunta 1 */}
              <div className="border border-gray-700 p-4 rounded-lg">
                <h2
                  onClick={() => toggleQuestion(1)}
                  className={`flex justify-between items-center font-bold text-xl mb-2 cursor-pointer transition-all ${
                    openQuestion === 1 ? "text-pink-500" : ""
                  }`}
                >
                  1. O que é with love?
                  <span>{openQuestion === 1 ? "-" : "+"}</span>
                </h2>
                <div
                  className={`overflow-hidden transition-max-height duration-300 ${
                    openQuestion === 1 ? "max-h-screen" : "max-h-0"
                  }`}
                >
                  <p>
                    Oferecemos a criação de um site personalizado para você
                    celebrar o seu relacionamento, com um contador dinâmico,
                    fotos, mensagens, uma foto única do céu especialmente da
                    data do seu relacionamento, um poema exclusivo para vocês,
                    &quot;eu te amo&quot; escrito em 100 línguas, um quadro de
                    recados para vocês trocarem recados quando quiserem, e um QR
                    Code exclusivo para você compartilhar.
                  </p>
                </div>
              </div>

              {/* Pergunta 2 */}
              <div className="border border-gray-700 p-4 rounded-lg">
                <h2
                  onClick={() => toggleQuestion(2)}
                  className={`flex justify-between items-center font-bold text-xl mb-2 cursor-pointer transition-all ${
                    openQuestion === 2 ? "text-pink-500" : ""
                  }`}
                >
                  2. Como faço o pagamento?
                  <span>{openQuestion === 2 ? "-" : "+"}</span>
                </h2>
                <div
                  className={`overflow-hidden transition-max-height duration-300 ${
                    openQuestion === 2 ? "max-h-screen" : "max-h-0"
                  }`}
                >
                  <p>
                    Após preencher os dados, você será redirecionado para a
                    página de checkout, onde poderá realizar o pagamento de
                    forma segura.
                  </p>
                </div>
              </div>

              {/* Pergunta 3 */}
              <div className="border border-gray-700 p-4 rounded-lg">
                <h2
                  onClick={() => toggleQuestion(3)}
                  className={`flex justify-between items-center font-bold text-xl mb-2 cursor-pointer transition-all ${
                    openQuestion === 3 ? "text-pink-500" : ""
                  }`}
                >
                  3. Quando receberei o meu site?
                  <span>{openQuestion === 3 ? "-" : "+"}</span>
                </h2>
                <div
                  className={`overflow-hidden transition-max-height duration-300 ${
                    openQuestion === 3 ? "max-h-screen" : "max-h-0"
                  }`}
                >
                  <p>
                    Após a confirmação do pagamento, você receberá um e-mail com
                    o link para o seu site personalizado e o QR Code, em até 24
                    horas.
                  </p>
                </div>
              </div>

              {/* Pergunta 4 */}
              <div className="border border-gray-700 p-4 rounded-lg">
                <h2
                  onClick={() => toggleQuestion(4)}
                  className={`flex justify-between items-center font-bold text-xl mb-2 cursor-pointer transition-all ${
                    openQuestion === 4 ? "text-pink-500" : ""
                  }`}
                >
                  4. Posso alterar o conteúdo depois?
                  <span>{openQuestion === 4 ? "-" : "+"}</span>
                </h2>
                <div
                  className={`overflow-hidden transition-max-height duration-300 ${
                    openQuestion === 4 ? "max-h-screen" : "max-h-0"
                  }`}
                >
                  <p>
                    Sim! Caso deseje alterar algo no seu site, entre em contato
                    conosco e faremos as modificações necessárias.
                  </p>
                </div>
              </div>

              {/* Pergunta 5 */}
              <div className="border border-gray-700 p-4 rounded-lg">
                <h2
                  onClick={() => toggleQuestion(5)}
                  className={`flex justify-between items-center font-bold text-xl mb-2 cursor-pointer transition-all ${
                    openQuestion === 5 ? "text-pink-500" : ""
                  }`}
                >
                  5. O que acontece se o pagamento falhar?
                  <span>{openQuestion === 5 ? "-" : "+"}</span>
                </h2>
                <div
                  className={`overflow-hidden transition-max-height duration-300 ${
                    openQuestion === 5 ? "max-h-screen" : "max-h-0"
                  }`}
                >
                  <p>
                    Se o pagamento falhar, você pode tentar pagar novamente por
                    outro meio de pagamento, sem perder nada do seu site.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="m-6 border border-gray-700 p-20 rounded-lg text-white flex flex-col items-center justify-center p-6">
          <div className="relative w-[150px] h-[150px] mb-4 border border-gray-700 p-2">
            <div className="absolute inset-0 flex items-center justify-center z-[-1]">
              <div className="w-[180px] h-[180px] rounded-full bg-gradient-to-r from-pink-500 to-purple-500 blur-xl opacity-80"></div>
            </div>

            <Image
              src="/images/QR.webp"
              alt="Qr Code"
              width={150}
              height={150}
              className="object-cover relative z-10 "
            />
          </div>

          <h1 className="text-xl mb-2 text-center">
            Vamos fazer um presente surpresa para o seu amor?
          </h1>

          <p className="text-gray-400 mb-6 text-sm">
            Demora menos de 5 minutos. É sério!
          </p>
          <Link href="/create">
            <button
              type="button"
              className="w-20% bg-gradient-to-r from-pink-500 to-red-400 text-white text-base font-bold py-3 px-4 rounded-lg hover:bg-gradient-to-l focus:outline-none focus:ring-4 focus:ring-pink-300 shadow-[0_1px_30px_rgba(255,170,211,0.8)]"
            >
              Quero fazer nosso site
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
