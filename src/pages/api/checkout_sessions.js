import { MercadoPagoConfig, Preference } from "mercadopago";
import { db } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { uniqueHash, formattedCoupleName, userEmail, payment, items } =
        req.body;

      // Configuração do Mercado Pago
      const client = new MercadoPagoConfig({
        accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
      });

      // Criação da preferência de pagamento
      const preference = new Preference(client);

      const preferenceData = {
        items: items.map((item) => ({
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
        back_urls: {
          success: "https://www.with-lov.com/success",
          failure: "https://www.with-lov.com/cancel",
          pending: "https://www.with-lov.com/pending",
        },
        auto_return: "approved",
        expiration: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutos em milissegundos

        // expiration_date_to: new Date(
        //   Date.now() + 3600 * 1000 * 24
        // ).toISOString(),
        external_reference: JSON.stringify({
          uniqueHash: uniqueHash,
          formattedCoupleName: formattedCoupleName,
          userEmail: userEmail,
          payment: payment,
        }),
      };

      const response = await preference.create({ body: preferenceData });

      const { init_point } = response;

      res.status(200).json({ init_point });
    } catch (error) {
      res.status(500).json({ error: "Erro ao iniciar o checkout" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
