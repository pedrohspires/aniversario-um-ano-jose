import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaGift, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";
import Rsvp from "./Rsvp";
import Presentes from "./Presentes";
import { buscarConvitePorToken } from "./lib/pessoas";

export default function App() {
  const tokenDaUrl = new URLSearchParams(window.location.search).get("token");

  const [jaConfirmado, setJaConfirmado] = useState(false);
  const [tokenValido, setTokenValido] = useState(false);
  const [rsvpAberto, setRsvpAberto] = useState(false);
  const [presentesAberto, setPresentesAberto] = useState(false);

  useEffect(() => {
    if (!tokenDaUrl) return;

    (async () => {
      const convite = await buscarConvitePorToken(tokenDaUrl);
      if (!convite) return;

      setTokenValido(true);
      setJaConfirmado(convite.titular.confirmado !== null);
    })();
  }, [tokenDaUrl]);

  const abrirLocal = () => {
    window.open(
      "https://maps.app.goo.gl/HDVFE1CTMshLkwgc6",
      "_blank"
    );
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Vídeo de fundo */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/video.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Conteúdo */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-4 text-5xl font-extrabold drop-shadow-lg"
        >
          José Pedro faz 1 aninho 🐮
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8 max-w-md text-lg"
        >
          Venha comemorar conosco uma tarde cheia de diversão na
          Fazendinha do Zenon!
        </motion.p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            onClick={abrirLocal}
            className="flex items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-6 py-4 text-lg font-bold text-black shadow-xl transition hover:scale-105"
          >
            <FaMapMarkerAlt />
            Ver Local
          </button>

          {tokenValido && !jaConfirmado && (
            <button
              onClick={() => setRsvpAberto(true)}
              className="flex items-center justify-center gap-2 rounded-2xl bg-green-500 px-6 py-4 text-lg font-bold text-white shadow-xl transition hover:scale-105"
            >
              <FaWhatsapp />
              Confirmar Presença
            </button>
          )}

          <button
            onClick={() => setPresentesAberto(true)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-pink-500 px-6 py-4 text-lg font-bold text-white shadow-xl transition hover:scale-105"
          >
            <FaGift />
            Sugestão de Presentes
          </button>
        </div>

        <div className="mt-10 text-sm opacity-90">
          <p>📅 7 de Novembro • 16h</p>
          <p>📍 Av.principal do conviver com  Rua Francisco Enéas rocha, Nº 47</p>
        </div>
      </div>

      {rsvpAberto && tokenDaUrl && (
        <Rsvp
          token={tokenDaUrl}
          onFechar={() => setRsvpAberto(false)}
          onConfirmado={() => setJaConfirmado(true)}
        />
      )}

      {presentesAberto && (
        <Presentes onFechar={() => setPresentesAberto(false)} />
      )}
    </div>
  );
}
