import "@/styles/globals.css";
import Layout from "../components/Layout";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

const GA_MEASUREMENT_ID = "G-0WGZ3PKM4J";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: url,
      });
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
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
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
