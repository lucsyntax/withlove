const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY;

import axios from "axios";

export const getApodData = async (date) => {
  const apiKey = "b9rKrEMbsVSYaP6cOcAl1d7E5Twf8wd3Bz2ppVUb";
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;

  try {
    const response = await axios.get(url);
    console.log("Resposta da API:", response.data); // Log para verificar a resposta
    return response.data;
  } catch (error) {
    // Aqui verificamos se é um erro com a resposta da API
    if (error.response) {
      console.error("Erro na resposta da API:", error.response.data);
      console.error("Status do erro:", error.response.status);
      throw new Error(
        `Erro da API: ${
          error.response.data.msg || "Erro ao buscar dados da API"
        }`
      );
    } else if (error.request) {
      // O pedido foi feito, mas nenhuma resposta foi recebida
      console.error("Nenhuma resposta da API:", error.request);
      throw new Error("Nenhuma resposta da API.");
    } else {
      // Outro tipo de erro
      console.error("Erro ao configurar a solicitação:", error.message);
      throw new Error("Erro ao configurar a solicitação.");
    }
  }
};
